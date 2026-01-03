package com.studyapp.dto;

import com.studyapp.model.SubjectEnrollment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubjectEnrollmentDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private SubjectEnrollment.EnrollmentStatus status;
    private LocalDateTime enrolledAt;
}
