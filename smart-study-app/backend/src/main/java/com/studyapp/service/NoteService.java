package com.studyapp.service;

import com.studyapp.dto.NoteDTO;
import java.util.List;

public interface NoteService {
    List<NoteDTO> getMyNotes(Long userId);

    List<NoteDTO> getNotesBySubject(Long userId, Long subjectId);

    NoteDTO createNote(NoteDTO noteDTO, Long userId);

    NoteDTO updateNote(Long id, NoteDTO noteDTO, Long userId);

    void deleteNote(Long id, Long userId);

    NoteDTO getNoteById(Long id, Long userId);

    void togglePin(Long id, Long userId);

    // Messaging / Sending Notes
    void sendNoteToStudent(Long senderId, Long studentId, NoteDTO noteDTO);

    void sendNoteToSubject(Long senderId, Long subjectId, NoteDTO noteDTO);

    void sendNoteToAllStudents(Long senderId, NoteDTO noteDTO); // Optional: Send to all taught students

    NoteDTO replyToNote(Long senderId, Long originalNoteId, String content);

    void markAsRead(Long noteId, Long userId);
}
