package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject; // Có thể null nếu là ghi chú chung

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content; // Nội dung ghi chú (có thể là HTML/Markdown)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoteType type = NoteType.GENERAL;

    @Column(length = 7)
    private String color = "#3b82f6"; // Màu ghi chú

    @Column(nullable = false)
    private Boolean isPinned = false; // Ghim ghi chú

    @Column(nullable = false)
    private Boolean isFavorite = false; // Yêu thích

    @Column(columnDefinition = "TEXT")
    private String tags; // Tags (cách nhau bởi dấu phẩy)

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender; // Người gửi (nếu là tin nhắn/thông báo)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    private Note replyTo; // Phản hồi cho ghi chú nào

    @Column(nullable = false)
    private Boolean isRead = true; // Đã đọc chưa (mặc định true cho ghi chú cá nhân, false cho tin nhắn)

    private LocalDateTime reminderTime; // Thời gian nhắc nhở

    public enum NoteType {
        GENERAL, // Ghi chú chung
        LECTURE, // Ghi chú bài giảng
        SUMMARY, // Tóm tắt
        QUESTION, // Câu hỏi
        IMPORTANT, // Quan trọng
        TODO // Việc cần làm
    }
}
