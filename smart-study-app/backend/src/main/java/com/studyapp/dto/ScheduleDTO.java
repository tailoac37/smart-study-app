package com.studyapp.dto;

import com.studyapp.model.Schedule;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private String subjectColor;
    private Schedule.DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
    private String building;
    private Schedule.ScheduleType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private String teacherName;
}
