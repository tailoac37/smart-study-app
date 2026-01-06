package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code; // Mã môn học (VD: IT001)

    @Column(nullable = false, length = 200)
    private String name; // Tên môn học

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer credits = 3; // Số tín chỉ

    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    private Integer targetYear = 1; // Dành cho sinh viên năm thứ mấy

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher; // Giảng viên dạy môn này

    @Column(length = 100)
    private String teacherName;

    @Column(length = 100)
    private String teacherEmail;

    @Column(length = 50)
    private String room;

    @Column(length = 50)
    private String semester; // Học kỳ (VD: HK1 2024-2025)

    @Column(length = 7)
    private String color = "#2563eb"; // Màu đại diện cho môn học

    // Thời gian mở đăng ký môn học
    @Column
    private LocalDateTime registrationStartDate; // Ngày bắt đầu cho phép đăng ký

    @Column
    private LocalDateTime registrationEndDate; // Ngày kết thúc đăng ký

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Schedule> schedules = new HashSet<>();

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Assignment> assignments = new HashSet<>();

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Grade> grades = new HashSet<>();

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Document> documents = new HashSet<>();

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Note> notes = new HashSet<>();
}
