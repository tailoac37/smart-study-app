package com.studyapp.controller;

import com.studyapp.dto.SubjectDTO;
import com.studyapp.dto.SubjectEnrollmentDTO;
import com.studyapp.model.User;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

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

    // Student enrolls in a subject
    @PostMapping("/enroll/{subjectId}")
    public ResponseEntity<SubjectEnrollmentDTO> enrollSubject(@PathVariable Long subjectId) {
        User user = getCurrentUser();
        return new ResponseEntity<>(enrollmentService.enrollSubject(user.getId(), subjectId), HttpStatus.CREATED);
    }

    // Student drops a subject
    @PostMapping("/drop/{subjectId}")
    public ResponseEntity<Void> dropSubject(@PathVariable Long subjectId) {
        User user = getCurrentUser();
        enrollmentService.dropSubject(user.getId(), subjectId);
        return ResponseEntity.noContent().build();
    }

    // Get all enrollments for current student
    @GetMapping("/my-enrollments")
    public ResponseEntity<List<SubjectEnrollmentDTO>> getMyEnrollments() {
        User user = getCurrentUser();
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(user.getId()));
    }

    // Get all enrolled subjects for current student
    @GetMapping("/my-subjects")
    public ResponseEntity<List<SubjectDTO>> getMySubjects() {
        User user = getCurrentUser();
        return ResponseEntity.ok(enrollmentService.getEnrolledSubjects(user.getId()));
    }

    // Get available subjects to enroll
    @GetMapping("/available-subjects")
    public ResponseEntity<List<SubjectDTO>> getAvailableSubjects() {
        User user = getCurrentUser();
        return ResponseEntity.ok(enrollmentService.getAvailableSubjects(user.getId()));
    }

    // Teacher views students enrolled in their subject
    @GetMapping("/subject/{subjectId}/students")
    public ResponseEntity<List<SubjectEnrollmentDTO>> getSubjectEnrollments(@PathVariable Long subjectId) {
        User user = getCurrentUser();
        return ResponseEntity.ok(enrollmentService.getSubjectEnrollments(subjectId, user.getId()));
    }
}
