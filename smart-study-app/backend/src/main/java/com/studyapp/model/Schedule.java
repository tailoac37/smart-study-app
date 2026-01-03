package com.studyapp.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek; // Thứ trong tuần

    @Column(nullable = false)
    private LocalTime startTime; // Giờ bắt đầu

    @Column(nullable = false)
    private LocalTime endTime; // Giờ kết thúc

    @Column(length = 100)
    private String room; // Phòng học

    @Column(length = 100)
    private String building; // Tòa nhà

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleType type = ScheduleType.THEORY; // Lý thuyết/Thực hành

    @Column
    private LocalDate startDate; // Ngày bắt đầu học kỳ (optional)

    @Column
    private LocalDate endDate; // Ngày kết thúc học kỳ (optional)

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum DayOfWeek {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }

    public enum ScheduleType {
        THEORY, PRACTICE, LAB, SEMINAR
    }
}
