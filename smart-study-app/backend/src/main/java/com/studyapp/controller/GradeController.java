package com.studyapp.controller;

import com.studyapp.dto.GradeDTO;
import com.studyapp.dto.StudentGradeDTO;
import com.studyapp.model.User;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

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

    @GetMapping
    public ResponseEntity<List<GradeDTO>> getAllGrades() {
        return ResponseEntity.ok(gradeService.getAllGrades(getCurrentUser().getId()));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<GradeDTO>> getGradesBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeService.getGradesBySubject(getCurrentUser().getId(), subjectId));
    }

    @GetMapping("/subject/{subjectId}/students") // Teacher endpoint
    public ResponseEntity<List<StudentGradeDTO>> getSubjectGradesForTeacher(@PathVariable Long subjectId) {
        User user = getCurrentUser();
        // Check if teacher? Service handles ownership check.
        return ResponseEntity.ok(gradeService.getGradesBySubjectForTeacher(subjectId, user.getId()));
    }

    @GetMapping("/gpa")
    public ResponseEntity<Double> getGPA() {
        return ResponseEntity.ok(gradeService.getGPA(getCurrentUser().getId()));
    }

    @GetMapping("/subject/{subjectId}/average")
    public ResponseEntity<Double> getSubjectAverage(@PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeService.getSubjectAverage(getCurrentUser().getId(), subjectId));
    }

    @PostMapping
    public ResponseEntity<GradeDTO> createGrade(@RequestBody GradeDTO gradeDTO) {
        return new ResponseEntity<>(gradeService.createGrade(gradeDTO, getCurrentUser().getId()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradeDTO> updateGrade(@PathVariable Long id, @RequestBody GradeDTO gradeDTO) {
        return ResponseEntity.ok(gradeService.updateGrade(id, gradeDTO, getCurrentUser().getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id, getCurrentUser().getId());
        return ResponseEntity.noContent().build();
    }
}
