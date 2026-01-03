package com.studyapp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudentGradeDTO {
    private Long id; // Grade ID
    private Long userId; // Student ID
    private String studentName;
    private String studentCode;
    private Long subjectId;
    private String subjectName;
    private String examName;
    private String type; // MIDTERM, FINAL, etc.
    private Double score;
    private Double weight;
    private Double maxScore;
    private String notes;
    private LocalDateTime examDate;
}
