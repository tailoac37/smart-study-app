package com.studyapp.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentSubmissionDTO {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long userId;
    private String userName;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String notes;
    private String status;
    private Double score;
    private String feedback;
    private LocalDateTime submittedAt;
    private LocalDateTime gradedAt;

    // Additional fields
    private Boolean isLate;
    private String fileSizeFormatted;
}
