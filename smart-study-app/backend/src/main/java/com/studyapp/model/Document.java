package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người upload

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = true)
    private Subject subject; // Có thể null nếu không gắn với môn học cụ thể

    @Column(nullable = false, length = 200)
    private String title; // Tên tài liệu

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type; // Loại tài liệu

    @Column(nullable = false, length = 500)
    private String fileUrl; // Đường dẫn file

    @Column(nullable = false, length = 100)
    private String fileName; // Tên file gốc

    @Column(nullable = false)
    private Long fileSize; // Kích thước file (bytes)

    @Column(length = 50)
    private String fileExtension; // Phần mở rộng (.pdf, .docx, etc.)

    @Column(nullable = false)
    private Boolean isPublic = false; // Công khai hay riêng tư

    @Column(nullable = false)
    private Integer downloadCount = 0; // Số lượt tải

    @Column(nullable = false)
    private Integer viewCount = 0; // Số lượt xem

    @Column(columnDefinition = "TEXT")
    private String tags; // Tags để tìm kiếm (cách nhau bởi dấu phẩy)

    @Column(nullable = false)
    private Integer likeCount = 0; // Số lượt thích

    @Column(nullable = false)
    private Integer commentCount = 0; // Số bình luận

    @Column(nullable = false)
    private Boolean isShared = false; // Đã được chia sẻ lên cộng đồng

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum DocumentType {
        LECTURE_SLIDES, // Slide bài giảng
        TEXTBOOK, // Giáo trình
        EXERCISE, // Bài tập
        SOLUTION, // Đáp án
        REFERENCE, // Tài liệu tham khảo
        EXAM, // Đề thi
        OTHER // Khác
    }
}
