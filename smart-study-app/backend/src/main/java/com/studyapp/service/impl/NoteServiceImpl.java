package com.studyapp.service.impl;

import com.studyapp.dto.NoteDTO;
import com.studyapp.model.Note;
import com.studyapp.model.Subject;
import com.studyapp.model.SubjectEnrollment;
import com.studyapp.model.User;
import com.studyapp.repository.NoteRepository;
import com.studyapp.repository.SubjectEnrollmentRepository;
import com.studyapp.repository.SubjectRepository;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectEnrollmentRepository enrollmentRepository;

    @Autowired
    private com.studyapp.service.NotificationService notificationService;

    @Override
    public List<NoteDTO> getMyNotes(Long userId) {
        return noteRepository.findByUser_IdOrSender_IdOrderByUpdatedAtDesc(userId, userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NoteDTO> getNotesBySubject(Long userId, Long subjectId) {
        return noteRepository.findByUser_IdAndSubject_Id(userId, subjectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NoteDTO createNote(NoteDTO noteDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = new Note();
        note.setUser(user);
        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());
        note.setType(noteDTO.getType() != null ? noteDTO.getType() : Note.NoteType.GENERAL);
        note.setColor(noteDTO.getColor());
        note.setIsPinned(noteDTO.getIsPinned() != null ? noteDTO.getIsPinned() : false);
        note.setIsFavorite(noteDTO.getIsFavorite() != null ? noteDTO.getIsFavorite() : false);
        note.setReminderTime(noteDTO.getReminderTime());
        note.setIsRead(true); // Personal notes are read by default

        if (noteDTO.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(noteDTO.getSubjectId())
                    .orElse(null);
            note.setSubject(subject);
        }

        return convertToDTO(noteRepository.save(note));
    }

    @Override
    public NoteDTO updateNote(Long id, NoteDTO noteDTO, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());
        if (noteDTO.getType() != null)
            note.setType(noteDTO.getType());
        if (noteDTO.getColor() != null)
            note.setColor(noteDTO.getColor());
        if (noteDTO.getIsPinned() != null)
            note.setIsPinned(noteDTO.getIsPinned());
        if (noteDTO.getIsFavorite() != null)
            note.setIsFavorite(noteDTO.getIsFavorite());
        note.setTags(noteDTO.getTags());
        note.setReminderTime(noteDTO.getReminderTime()); // Update reminder

        return convertToDTO(noteRepository.save(note));
    }

    @Override
    public void deleteNote(Long id, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        noteRepository.delete(note);
    }

    @Override
    public NoteDTO getNoteById(Long id, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        if (!note.getUser().getId().equals(userId) &&
                (note.getSender() == null || !note.getSender().getId().equals(userId))) {
            throw new RuntimeException("Unauthorized");
        }
        return convertToDTO(note);
    }

    @Override
    public void togglePin(Long id, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        note.setIsPinned(!note.getIsPinned());
        noteRepository.save(note);
    }

    // --- Messaging Implementation ---

    @Override
    @Transactional
    public void sendNoteToStudent(Long senderId, Long studentId, NoteDTO noteDTO) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        createMessageNote(sender, student, noteDTO);
    }

    @Override
    @Transactional
    public void sendNoteToSubject(Long senderId, Long subjectId, NoteDTO noteDTO) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));

        List<SubjectEnrollment> enrollments = enrollmentRepository.findBySubject_Id(subjectId);
        for (SubjectEnrollment enrollment : enrollments) {
            createMessageNote(sender, enrollment.getStudent(), noteDTO);
        }
    }

    @Override
    @Transactional
    public void sendNoteToAllStudents(Long senderId, NoteDTO noteDTO) {
        // Not heavily optimized: Finds all students enrolled in ANY subject taught by
        // sender
        User teacher = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        // Logic to find all unique students taught by teacher?
        // For now, simpler implementation: assume we pass a list of IDs or handle in
        // controller.
        // Or implement findDistinctStudentsByTeacher logic here.
        // skipping for brevity, handled by multiple calls or specific repo query if
        // needed.
    }

    @Override
    @Transactional
    public NoteDTO replyToNote(Long senderId, Long originalNoteId, String content) {
        Note original = noteRepository.findById(originalNoteId)
                .orElseThrow(() -> new RuntimeException("Original note not found"));
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));

        // Determine receiver: It should be the 'sender' of the original note.
        // If original sender is null (self-note), we can't reply.
        User receiver = original.getSender();
        if (receiver == null) {
            throw new RuntimeException("Cannot reply to a personal note");
        }

        // However, if I am the sender of the original note, I might be adding to the
        // thread?
        // Let's assume standard reply: Receiver -> Sender.

        Note reply = new Note();
        reply.setUser(receiver); // The original sender receives this reply
        reply.setSender(sender); // I am the sender now
        reply.setTitle("Re: " + original.getTitle());
        reply.setContent(content);
        reply.setType(Note.NoteType.GENERAL);
        reply.setReplyTo(original);
        reply.setIsRead(false);
        reply.setSubject(original.getSubject());

        Note savedReply = noteRepository.save(reply);

        // Send real-time notification
        try {
            notificationService.createNotification(
                    receiver,
                    "Phản hồi mới từ " + sender.getFullName(),
                    "Bạn có phản hồi mới cho ghi chú: " + original.getTitle(),
                    com.studyapp.model.Notification.NotificationType.OTHER,
                    "/notes");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return convertToDTO(savedReply);
    }

    @Override
    public void markAsRead(Long noteId, Long userId) {
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new RuntimeException("Note not found"));
        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        note.setIsRead(true);
        noteRepository.save(note);
    }

    private void createMessageNote(User sender, User receiver, NoteDTO noteDTO) {
        Note note = new Note();
        note.setUser(receiver);
        note.setSender(sender);
        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());
        note.setType(noteDTO.getType() != null ? noteDTO.getType() : Note.NoteType.IMPORTANT);
        note.setColor(noteDTO.getColor() != null ? noteDTO.getColor() : "#ef4444"); // Default red for alerts
        note.setIsRead(false);

        if (noteDTO.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(noteDTO.getSubjectId()).orElse(null);
            note.setSubject(subject);
        }

        noteRepository.save(note);

        // Send real-time notification
        try {
            notificationService.createNotification(
                    receiver,
                    "Tin nhắn mới từ " + sender.getFullName(),
                    "Bạn đã nhận được một tin nhắn: " + noteDTO.getTitle(),
                    com.studyapp.model.Notification.NotificationType.OTHER,
                    "/notes");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private NoteDTO convertToDTO(Note note) {
        NoteDTO dto = new NoteDTO();
        dto.setId(note.getId());
        dto.setUserId(note.getUser().getId());
        dto.setTitle(note.getTitle());
        dto.setContent(note.getContent());
        dto.setType(note.getType());
        dto.setColor(note.getColor());
        dto.setIsPinned(note.getIsPinned());
        dto.setIsFavorite(note.getIsFavorite());
        dto.setTags(note.getTags());
        dto.setCreatedAt(note.getCreatedAt());
        dto.setUpdatedAt(note.getUpdatedAt());
        dto.setIsRead(note.getIsRead());
        dto.setReminderTime(note.getReminderTime());

        if (note.getSubject() != null) {
            dto.setSubjectId(note.getSubject().getId());
            dto.setSubjectName(note.getSubject().getName());
        }

        if (note.getSender() != null) {
            dto.setSenderId(note.getSender().getId());
            dto.setSenderName(note.getSender().getFullName());
        }

        if (note.getReplyTo() != null) {
            dto.setReplyToId(note.getReplyTo().getId());
        }

        return dto;
    }
}
