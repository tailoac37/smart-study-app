package com.studyapp.service.impl;

import com.studyapp.dto.ScheduleDTO;
import com.studyapp.model.Schedule;
import com.studyapp.model.Subject;
import com.studyapp.model.SubjectEnrollment;
import com.studyapp.repository.ScheduleRepository;
import com.studyapp.repository.SubjectRepository;
import com.studyapp.repository.SubjectEnrollmentRepository;
import com.studyapp.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectEnrollmentRepository enrollmentRepository;

    @Override
    public ScheduleDTO createSchedule(ScheduleDTO scheduleDTO, Long teacherId) {
        Subject subject = subjectRepository.findById(scheduleDTO.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        // Verify teacher owns this subject
        if (!subject.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You are not authorized to create schedule for this subject");
        }

        // Check for time conflicts with teacher's other schedules
        checkTeacherScheduleConflict(teacherId, scheduleDTO, null);

        Schedule schedule = new Schedule();
        updateEntityFromDTO(schedule, scheduleDTO);
        schedule.setSubject(subject);

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return convertToDTO(savedSchedule);
    }

    @Override
    public ScheduleDTO updateSchedule(Long id, ScheduleDTO scheduleDTO, Long teacherId) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // Verify teacher owns the subject
        if (!schedule.getSubject().getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You are not authorized to update this schedule");
        }

        // Check for time conflicts (excluding current schedule)
        checkTeacherScheduleConflict(teacherId, scheduleDTO, id);

        updateEntityFromDTO(schedule, scheduleDTO);
        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return convertToDTO(updatedSchedule);
    }

    @Override
    public void deleteSchedule(Long id, Long teacherId) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (!schedule.getSubject().getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You are not authorized to delete this schedule");
        }

        scheduleRepository.delete(schedule);
    }

    @Override
    public List<ScheduleDTO> getSchedulesBySubject(Long subjectId, Long teacherId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (!subject.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You are not authorized to view schedules for this subject");
        }

        return scheduleRepository.findBySubjectId(subjectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getStudentTimetable(Long studentId) {
        // Get all enrolled subjects
        List<Long> subjectIds = enrollmentRepository.findByStudent_IdAndStatus(
                studentId, SubjectEnrollment.EnrollmentStatus.ACTIVE)
                .stream()
                .map(enrollment -> enrollment.getSubject().getId())
                .collect(Collectors.toList());

        if (subjectIds.isEmpty()) {
            return Collections.emptyList();
        }

        return scheduleRepository.findBySubjectIdIn(subjectIds).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getStudentTimetableByDay(Long studentId, Schedule.DayOfWeek dayOfWeek) {
        List<Long> subjectIds = enrollmentRepository.findByStudent_IdAndStatus(
                studentId, SubjectEnrollment.EnrollmentStatus.ACTIVE)
                .stream()
                .map(enrollment -> enrollment.getSubject().getId())
                .collect(Collectors.toList());

        if (subjectIds.isEmpty()) {
            return Collections.emptyList();
        }

        return scheduleRepository.findBySubjectIdInAndDayOfWeek(subjectIds, dayOfWeek).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getStudentTimetableByDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        List<Long> subjectIds = enrollmentRepository.findByStudent_IdAndStatus(
                studentId, SubjectEnrollment.EnrollmentStatus.ACTIVE)
                .stream()
                .map(enrollment -> enrollment.getSubject().getId())
                .collect(Collectors.toList());

        if (subjectIds.isEmpty()) {
            return Collections.emptyList();
        }

        // Filter schedules that overlap with the date range
        return scheduleRepository.findBySubjectIdIn(subjectIds).stream()
                .filter(s -> !s.getStartDate().isAfter(endDate) && !s.getEndDate().isBefore(startDate))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getTeacherTimetable(Long teacherId) {
        // Get all subjects taught by this teacher
        List<Long> subjectIds = subjectRepository.findByTeacherId(teacherId).stream()
                .map(Subject::getId)
                .collect(Collectors.toList());

        if (subjectIds.isEmpty()) {
            return Collections.emptyList();
        }

        // Get all schedules for these subjects
        return scheduleRepository.findBySubjectIdIn(subjectIds).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ScheduleDTO convertToDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setSubjectId(schedule.getSubject().getId());
        dto.setSubjectName(schedule.getSubject().getName());
        dto.setSubjectCode(schedule.getSubject().getCode());
        dto.setSubjectColor(schedule.getSubject().getColor());
        dto.setDayOfWeek(schedule.getDayOfWeek());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setRoom(schedule.getRoom());
        dto.setBuilding(schedule.getBuilding());
        dto.setType(schedule.getType());
        dto.setStartDate(schedule.getStartDate());
        dto.setEndDate(schedule.getEndDate());
        dto.setNotes(schedule.getNotes());
        dto.setTeacherName(schedule.getSubject().getTeacherName());
        return dto;
    }

    private void updateEntityFromDTO(Schedule schedule, ScheduleDTO dto) {
        schedule.setDayOfWeek(dto.getDayOfWeek());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setRoom(dto.getRoom());
        schedule.setBuilding(dto.getBuilding());
        schedule.setType(dto.getType());
        schedule.setStartDate(dto.getStartDate());
        schedule.setEndDate(dto.getEndDate());
        schedule.setNotes(dto.getNotes());
    }

    /**
     * Check if new schedule conflicts with teacher's existing schedules
     * 
     * @param teacherId         Teacher ID
     * @param newSchedule       New schedule to check
     * @param excludeScheduleId Schedule ID to exclude from check (when updating)
     */
    private void checkTeacherScheduleConflict(Long teacherId, ScheduleDTO newSchedule, Long excludeScheduleId) {
        // Get all schedules of this teacher on the same day of week
        List<Schedule> existingSchedules = scheduleRepository.findByTeacherIdAndDayOfWeek(
                teacherId, newSchedule.getDayOfWeek());

        for (Schedule existing : existingSchedules) {
            // Skip if this is the schedule being updated
            if (excludeScheduleId != null && existing.getId().equals(excludeScheduleId)) {
                continue;
            }

            // Check time overlap
            if (isTimeOverlap(existing.getStartTime(), existing.getEndTime(),
                    newSchedule.getStartTime(), newSchedule.getEndTime())) {
                throw new RuntimeException(
                        String.format("Trùng lịch! Bạn đã có lịch dạy môn '%s' vào %s, %s - %s",
                                existing.getSubject().getName(),
                                getDayOfWeekVietnamese(existing.getDayOfWeek()),
                                existing.getStartTime(),
                                existing.getEndTime()));
            }
        }
    }

    /**
     * Check if two time ranges overlap
     */
    private boolean isTimeOverlap(java.time.LocalTime start1, java.time.LocalTime end1,
            java.time.LocalTime start2, java.time.LocalTime end2) {
        return !start1.isAfter(end2.minusMinutes(1)) && !end1.isBefore(start2.plusMinutes(1));
    }

    /**
     * Convert DayOfWeek to Vietnamese
     */
    private String getDayOfWeekVietnamese(Schedule.DayOfWeek day) {
        switch (day) {
            case MONDAY:
                return "Thứ 2";
            case TUESDAY:
                return "Thứ 3";
            case WEDNESDAY:
                return "Thứ 4";
            case THURSDAY:
                return "Thứ 5";
            case FRIDAY:
                return "Thứ 6";
            case SATURDAY:
                return "Thứ 7";
            case SUNDAY:
                return "Chủ nhật";
            default:
                return "";
        }
    }
}
