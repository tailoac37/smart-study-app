package com.studyapp.dto;

import com.studyapp.model.Grade;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GradeDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String examName;
    private Grade.GradeType type;
    private Double score;
    private Double weight;
    private Double maxScore;
    private String notes;
    private LocalDateTime examDate;
}
