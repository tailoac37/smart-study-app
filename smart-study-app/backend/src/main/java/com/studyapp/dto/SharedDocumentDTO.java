package com.studyapp.dto;

import com.studyapp.model.Document;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SharedDocumentDTO {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String fileExtension;
    private String tags;

    // Thông tin người đăng
    private Long userId;
    private String userName;
    private String userAvatar;

    // Thông tin môn học (optional)
    private Long subjectId;
    private String subjectName;
    private String subjectCode;

    // Thống kê tương tác
    private Integer likeCount;
    private Integer commentCount;
    private Integer downloadCount;
    private Integer viewCount;

    // Trạng thái của người xem hiện tại
    private Boolean isLikedByCurrentUser;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
