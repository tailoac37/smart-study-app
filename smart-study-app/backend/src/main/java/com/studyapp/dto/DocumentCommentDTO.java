package com.studyapp.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class DocumentCommentDTO {
    private Long id;
    private Long documentId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private Long parentId;
    private List<DocumentCommentDTO> replies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
