package com.studyapp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubjectDTO {
    private Long id;
    private String name;
    private String code;
    private String teacherName;
    private String teacherEmail;
    private Integer credits;
    private String room;
    private String semester;
    private String color;
    private String description;
    private Integer targetYear;

    // Thời gian đăng ký môn học
    private LocalDateTime registrationStartDate;
    private LocalDateTime registrationEndDate;
    private Boolean registrationOpen; // true nếu đang trong thời gian đăng ký
    private String registrationStatus; // "NOT_STARTED", "OPEN", "CLOSED"
}
