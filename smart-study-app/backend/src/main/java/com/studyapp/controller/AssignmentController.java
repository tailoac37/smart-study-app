package com.studyapp.controller;

import com.studyapp.dto.AssignmentDTO;
import com.studyapp.dto.AssignmentSubmissionDTO;
import com.studyapp.model.User;
import com.studyapp.repository.UserRepository;
import com.studyapp.security.JwtTokenProvider;
import com.studyapp.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
// @CrossOrigin(origins = "*") // Removed to avoid conflict with credential
// support
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String usernameOrEmail = jwtTokenProvider.getUsername(token);
            System.out.println("Processing request for user: " + usernameOrEmail);
            User user = userRepository.findByUsername(usernameOrEmail)
                    .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                            .orElseThrow(() -> new RuntimeException("User '" + usernameOrEmail
                                    + "' not found in database. Please log out and sign up again.")));
            return user.getId();
        }
        throw new RuntimeException("Unauthorized");
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<AssignmentDTO> createAssignment(
            @RequestPart("assignment") String assignmentDTOStr,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        try {
            System.out.println("Received assignment payload: " + assignmentDTOStr);
            if (file != null) {
                System.out.println("Received file: " + file.getOriginalFilename());
            } else {
                System.out.println("No file received");
            }

            AssignmentDTO assignmentDTO = objectMapper.readValue(assignmentDTOStr, AssignmentDTO.class);
            AssignmentDTO created = assignmentService.createAssignment(assignmentDTO, file, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Invalid assignment data: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentDTO> updateAssignment(
            @PathVariable Long id,
            @RequestBody AssignmentDTO assignmentDTO,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        AssignmentDTO updated = assignmentService.updateAssignment(id, assignmentDTO, userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAssignment(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        assignmentService.deleteAssignment(id, userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Assignment deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDTO> getAssignmentById(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        AssignmentDTO assignment = assignmentService.getAssignmentById(id, userId);
        return ResponseEntity.ok(assignment);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentDTO>> getAllAssignments(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<AssignmentDTO> assignments = assignmentService.getAllAssignments(userId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsBySubject(
            @PathVariable Long subjectId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<AssignmentDTO> assignments = assignmentService.getAssignmentsBySubject(subjectId, userId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByStatus(
            @PathVariable String status,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<AssignmentDTO> assignments = assignmentService.getAssignmentsByStatus(status, userId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<AssignmentDTO>> getUpcomingAssignments(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<AssignmentDTO> assignments = assignmentService.getUpcomingAssignments(userId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<AssignmentDTO>> getOverdueAssignments(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<AssignmentDTO> assignments = assignmentService.getOverdueAssignments(userId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<AssignmentSubmissionDTO> submitAssignment(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "notes", required = false) String notes,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        AssignmentSubmissionDTO submission = assignmentService.submitAssignment(id, file, notes, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    }

    @GetMapping("/{id}/submissions")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getSubmissionHistory(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<AssignmentSubmissionDTO> submissions = assignmentService.getSubmissionHistory(id, userId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/{id}/submissions/latest")
    public ResponseEntity<AssignmentSubmissionDTO> getLatestSubmission(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        AssignmentSubmissionDTO submission = assignmentService.getLatestSubmission(id, userId);
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/{id}/all-submissions")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getAllSubmissions(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<AssignmentSubmissionDTO> submissions = assignmentService.getAllSubmissionsForAssignment(id, userId);
        return ResponseEntity.ok(submissions);
    }

    @PostMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<AssignmentSubmissionDTO> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody Map<String, Object> gradeData,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);

        Double score = null;
        Object scoreObj = gradeData.get("score");
        if (scoreObj != null && !scoreObj.toString().trim().isEmpty()) {
            try {
                score = Double.valueOf(scoreObj.toString());
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid score format");
            }
        }

        String feedback = (String) gradeData.get("feedback");
        AssignmentSubmissionDTO graded = assignmentService.gradeSubmission(submissionId, score, feedback, userId);
        return ResponseEntity.ok(graded);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AssignmentDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        String status = statusUpdate.get("status");
        AssignmentDTO updated = assignmentService.updateStatus(id, status, userId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        Map<String, Long> stats = new HashMap<>();
        stats.put("completed", assignmentService.getCompletedCount(userId));
        stats.put("pending", assignmentService.getPendingCount(userId));
        stats.put("overdue", assignmentService.getOverdueCount(userId));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/subject/{subjectId}/submissions")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getSubjectSubmissions(@PathVariable Long subjectId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        return ResponseEntity.ok(assignmentService.getSubmissionsBySubject(subjectId, userId));
    }
}
