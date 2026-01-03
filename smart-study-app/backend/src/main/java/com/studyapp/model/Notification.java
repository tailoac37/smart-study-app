package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(length = 500)
    private String actionUrl; // Link để click vào thông báo

    @Column
    private Long relatedId; // ID liên quan (assignment_id, schedule_id, etc.)

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime readAt;

    public enum NotificationType {
        ASSIGNMENT_REMINDER, // Nhắc deadline bài tập
        SCHEDULE_REMINDER, // Nhắc lịch học
        GRADE_UPDATED, // Điểm được cập nhật
        DOCUMENT_SHARED, // Tài liệu mới được chia sẻ
        SYSTEM, // Thông báo hệ thống
        OTHER // Khác
    }
}
