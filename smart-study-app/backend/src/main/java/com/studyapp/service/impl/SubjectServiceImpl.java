package com.studyapp.service.impl;

import com.studyapp.dto.SubjectDTO;
import com.studyapp.model.Subject;
import com.studyapp.model.User;
import com.studyapp.repository.SubjectRepository;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.studyapp.repository.SubjectEnrollmentRepository subjectEnrollmentRepository;

    @Override
    public List<SubjectDTO> getAllSubjects(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.TEACHER) {
            return subjectRepository.findByTeacherId(userId).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            return subjectEnrollmentRepository.findByStudent_Id(userId).stream()
                    .map(enrollment -> convertToDTO(enrollment.getSubject()))
                    .collect(Collectors.toList());
        }
    }

    @Override
    public SubjectDTO getSubjectById(Long id, Long userId) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.TEACHER) {
            if (!subject.getTeacher().getId().equals(userId)) {
                throw new RuntimeException("Unauthorized access to subject");
            }
        } else {
            // Check enrollment for student
            boolean isEnrolled = subjectEnrollmentRepository.existsByStudent_IdAndSubject_Id(userId, id);
            if (!isEnrolled) {
                throw new RuntimeException("Unauthorized access to subject (Not enrolled)");
            }
        }

        return convertToDTO(subject);
    }

    @Override
    public SubjectDTO createSubject(SubjectDTO subjectDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subject subject = new Subject();
        updateEntityFromDTO(subject, subjectDTO);
        subject.setTeacher(user);

        // Auto-fill teacher info if not provided
        if (subject.getTeacherName() == null || subject.getTeacherName().isEmpty()) {
            subject.setTeacherName(user.getFullName());
        }
        if (subject.getTeacherEmail() == null || subject.getTeacherEmail().isEmpty()) {
            subject.setTeacherEmail(user.getEmail());
        }

        Subject savedSubject = subjectRepository.save(subject);
        return convertToDTO(savedSubject);
    }

    @Override
    public SubjectDTO updateSubject(Long id, SubjectDTO subjectDTO, Long userId) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (!subject.getTeacher().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to subject");
        }

        updateEntityFromDTO(subject, subjectDTO);
        Subject updatedSubject = subjectRepository.save(subject);
        return convertToDTO(updatedSubject);
    }

    @Override
    public void deleteSubject(Long id, Long userId) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (!subject.getTeacher().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to subject");
        }

        subjectRepository.delete(subject);
    }

    private SubjectDTO convertToDTO(Subject subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setCode(subject.getCode());
        dto.setTeacherName(subject.getTeacherName());
        dto.setTeacherEmail(subject.getTeacherEmail());
        dto.setCredits(subject.getCredits());
        dto.setRoom(subject.getRoom());
        dto.setSemester(subject.getSemester());
        dto.setColor(subject.getColor());
        dto.setDescription(subject.getDescription());
        dto.setTargetYear(subject.getTargetYear());
        return dto;
    }

    private void updateEntityFromDTO(Subject subject, SubjectDTO dto) {
        subject.setName(dto.getName());
        subject.setCode(dto.getCode());
        subject.setTeacherName(dto.getTeacherName());
        subject.setTeacherEmail(dto.getTeacherEmail());
        subject.setCredits(dto.getCredits());
        subject.setRoom(dto.getRoom());
        subject.setSemester(dto.getSemester());
        subject.setColor(dto.getColor());
        subject.setDescription(dto.getDescription());
        subject.setTargetYear(dto.getTargetYear() != null ? dto.getTargetYear() : 1);
    }
}
