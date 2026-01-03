package com.studyapp.service;

import com.studyapp.dto.ScheduleDTO;
import com.studyapp.model.Schedule;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    // Teacher creates schedule for their subject
    ScheduleDTO createSchedule(ScheduleDTO scheduleDTO, Long teacherId);

    // Teacher updates schedule
    ScheduleDTO updateSchedule(Long id, ScheduleDTO scheduleDTO, Long teacherId);

    // Teacher deletes schedule
    void deleteSchedule(Long id, Long teacherId);

    // Get schedules by subject (for teacher)
    List<ScheduleDTO> getSchedulesBySubject(Long subjectId, Long teacherId);

    // Get student's timetable (from all enrolled subjects)
    List<ScheduleDTO> getStudentTimetable(Long studentId);

    // Get student's timetable by day of week
    List<ScheduleDTO> getStudentTimetableByDay(Long studentId, Schedule.DayOfWeek dayOfWeek);

    // Get student's timetable in date range
    List<ScheduleDTO> getStudentTimetableByDateRange(Long studentId, LocalDate startDate, LocalDate endDate);

    // Get teacher's teaching timetable (from all subjects they teach)
    List<ScheduleDTO> getTeacherTimetable(Long teacherId);
}
