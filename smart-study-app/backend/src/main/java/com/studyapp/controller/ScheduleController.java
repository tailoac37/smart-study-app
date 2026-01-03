package com.studyapp.controller;

import com.studyapp.dto.ScheduleDTO;
import com.studyapp.model.Schedule;
import com.studyapp.model.User;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String usernameOrEmail = authentication.getName();
        return userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail)));
    }

    // Teacher creates schedule for their subject
    @PostMapping
    public ResponseEntity<ScheduleDTO> createSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        User user = getCurrentUser();
        return new ResponseEntity<>(scheduleService.createSchedule(scheduleDTO, user.getId()), HttpStatus.CREATED);
    }

    // Teacher updates schedule
    @PutMapping("/{id}")
    public ResponseEntity<ScheduleDTO> updateSchedule(@PathVariable Long id, @RequestBody ScheduleDTO scheduleDTO) {
        User user = getCurrentUser();
        return ResponseEntity.ok(scheduleService.updateSchedule(id, scheduleDTO, user.getId()));
    }

    // Teacher deletes schedule
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        User user = getCurrentUser();
        scheduleService.deleteSchedule(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    // Get schedules by subject (for teacher)
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<ScheduleDTO>> getSchedulesBySubject(@PathVariable Long subjectId) {
        User user = getCurrentUser();
        return ResponseEntity.ok(scheduleService.getSchedulesBySubject(subjectId, user.getId()));
    }

    // Get student's full timetable
    @GetMapping("/my-timetable")
    public ResponseEntity<List<ScheduleDTO>> getMyTimetable() {
        User user = getCurrentUser();

        // Check if user is TEACHER or STUDENT
        if (user.getRole() == User.Role.TEACHER) {
            return ResponseEntity.ok(scheduleService.getTeacherTimetable(user.getId()));
        } else {
            return ResponseEntity.ok(scheduleService.getStudentTimetable(user.getId()));
        }
    }

    // Get student's timetable by day
    @GetMapping("/my-timetable/day/{dayOfWeek}")
    public ResponseEntity<List<ScheduleDTO>> getMyTimetableByDay(@PathVariable Schedule.DayOfWeek dayOfWeek) {
        User user = getCurrentUser();
        return ResponseEntity.ok(scheduleService.getStudentTimetableByDay(user.getId(), dayOfWeek));
    }

    // Get student's timetable by date range
    @GetMapping("/my-timetable/range")
    public ResponseEntity<List<ScheduleDTO>> getMyTimetableByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        User user = getCurrentUser();
        return ResponseEntity.ok(scheduleService.getStudentTimetableByDateRange(user.getId(), startDate, endDate));
    }
}
