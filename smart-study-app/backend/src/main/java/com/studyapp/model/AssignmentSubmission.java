package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 500)
    private String fileUrl; // URL file bài làm

    @Column(length = 255)
    private String fileName; // Tên file gốc

    @Column
    private Long fileSize; // Kích thước file (bytes)

    @Column(columnDefinition = "TEXT")
    private String notes; // Ghi chú khi nộp

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.SUBMITTED; // Trạng thái

    @Column
    private Double score; // Điểm số (nếu đã chấm)

    @Column(columnDefinition = "TEXT")
    private String feedback; // Phản hồi từ giảng viên

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @Column
    private LocalDateTime gradedAt; // Thời gian chấm điểm

    public enum SubmissionStatus {
        SUBMITTED, // Đã nộp
        GRADED, // Đã chấm
        LATE, // Nộp muộn
        REJECTED // Bị từ chối (nếu cần nộp lại)
    }
}
