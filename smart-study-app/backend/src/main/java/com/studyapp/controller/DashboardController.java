package com.studyapp.controller;

import com.studyapp.model.AssignmentSubmission;
import com.studyapp.model.User;
import com.studyapp.repository.AssignmentSubmissionRepository;
import com.studyapp.repository.NoteRepository;
import com.studyapp.repository.SubjectEnrollmentRepository;
import com.studyapp.repository.SubjectRepository;
import com.studyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectEnrollmentRepository enrollmentRepository;

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Autowired
    private NoteRepository noteRepository;

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

    @GetMapping("/teacher/stats")
    public ResponseEntity<Map<String, Long>> getTeacherStats() {
        User teacher = getCurrentUser();
        Long teacherId = teacher.getId();

        Map<String, Long> stats = new HashMap<>();

        // 1. Total Subjects Taught
        Long totalSubjects = subjectRepository.countByTeacher_Id(teacherId);
        stats.put("totalSubjects", totalSubjects);

        // 2. Total Students (Distinct across all subjects)
        Long totalStudents = enrollmentRepository.countDistinctStudentBySubject_Teacher_Id(teacherId);
        stats.put("totalStudents", totalStudents);

        // 3. Pending Grading (Submissions with status SUBMITTED for assignments created
        // by this teacher)
        Long pendingGrading = submissionRepository.countByAssignment_CreatedBy_IdAndStatus(teacherId,
                AssignmentSubmission.SubmissionStatus.SUBMITTED);
        stats.put("pendingGrading", pendingGrading);

        return ResponseEntity.ok(stats);
    }
}
