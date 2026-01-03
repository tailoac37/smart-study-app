package com.studyapp.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private String title;
    private String description;
    private String type;
    private LocalDateTime deadline;
    private String priority;
    private String status;
    private LocalDateTime completedAt;
    private String attachmentUrl;
    private String notes;
    private Boolean reminderEnabled;
    private Integer reminderMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional fields
    private Integer daysUntilDeadline;
    private Boolean isOverdue;
    private Long submissionCount;
    private AssignmentSubmissionDTO latestSubmission;
}
