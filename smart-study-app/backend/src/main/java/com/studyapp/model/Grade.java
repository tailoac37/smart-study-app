package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false, length = 100)
    private String examName; // Tên bài kiểm tra (VD: Giữa kỳ, Cuối kỳ, Thực hành 1)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GradeType type; // Loại điểm

    @Column(nullable = false)
    private Double score; // Điểm số

    @Column(nullable = false)
    private Double weight; // Trọng số (%) - VD: 30% cho giữa kỳ

    @Column
    private Double maxScore = 10.0; // Điểm tối đa

    @Column(columnDefinition = "TEXT")
    private String notes; // Ghi chú

    @Column
    private LocalDateTime examDate; // Ngày thi/kiểm tra

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum GradeType {
        ATTENDANCE, // Điểm chuyên cần
        HOMEWORK, // Điểm bài tập
        MIDTERM, // Điểm giữa kỳ
        FINAL, // Điểm cuối kỳ
        PROJECT, // Điểm đồ án
        PRESENTATION, // Điểm thuyết trình
        LAB, // Điểm thực hành
        OTHER // Khác
    }

    // Tính điểm có trọng số
    public Double getWeightedScore() {
        return (score / maxScore) * weight;
    }
}
