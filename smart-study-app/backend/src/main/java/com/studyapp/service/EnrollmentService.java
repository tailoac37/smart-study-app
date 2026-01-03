package com.studyapp.service;

import com.studyapp.dto.SubjectDTO;
import com.studyapp.dto.SubjectEnrollmentDTO;

import java.util.List;

public interface EnrollmentService {
    // Student enrolls in a subject
    SubjectEnrollmentDTO enrollSubject(Long studentId, Long subjectId);

    // Student drops a subject
    void dropSubject(Long studentId, Long subjectId);

    // Get all subjects student is enrolled in
    List<SubjectEnrollmentDTO> getStudentEnrollments(Long studentId);

    // Get all active subjects for student
    List<SubjectDTO> getEnrolledSubjects(Long studentId);

    // Get available subjects to enroll (not yet enrolled)
    List<SubjectDTO> getAvailableSubjects(Long studentId);

    // Teacher views students enrolled in their subject
    List<SubjectEnrollmentDTO> getSubjectEnrollments(Long subjectId, Long teacherId);
}
