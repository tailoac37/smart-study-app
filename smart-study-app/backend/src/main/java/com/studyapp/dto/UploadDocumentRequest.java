package com.studyapp.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadDocumentRequest {
    private String title;
    private String description;
    private String type; // LECTURE_SLIDES, TEXTBOOK, etc.
    private Long subjectId; // Optional
    private String tags; // Comma separated
    private Boolean isShared = true; // Chia sẻ lên cộng đồng
}
