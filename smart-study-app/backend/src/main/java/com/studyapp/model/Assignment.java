package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user; // Student (nullable cho teacher-created assignments)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = true)
    private User createdBy; // Teacher who created this assignment

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false, length = 200)
    private String title; // Tên bài tập

    @Column(columnDefinition = "TEXT")
    private String description; // Mô tả chi tiết

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentType type = AssignmentType.HOMEWORK; // Loại bài tập

    @Column(nullable = false)
    private LocalDateTime deadline; // Hạn nộp

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM; // Độ ưu tiên

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.TODO; // Trạng thái

    @Column
    private LocalDateTime completedAt; // Thời gian hoàn thành

    @Column(length = 500)
    private String attachmentUrl; // Link file đính kèm

    @Column(columnDefinition = "TEXT")
    private String notes; // Ghi chú

    @Column(nullable = false)
    private Boolean reminderEnabled = true; // Bật nhắc nhở

    @Column
    private Integer reminderMinutes = 60; // Nhắc trước bao nhiêu phút

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.Set<AssignmentSubmission> submissions = new java.util.HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum AssignmentType {
        HOMEWORK, PROJECT, EXAM, PRESENTATION, REPORT, LAB
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum Status {
        TODO, IN_PROGRESS, COMPLETED, OVERDUE
    }
}
