package com.studyapp.service;

import com.studyapp.dto.AssignmentDTO;
import com.studyapp.dto.AssignmentSubmissionDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AssignmentService {

    // Assignment CRUD
    AssignmentDTO createAssignment(AssignmentDTO assignmentDTO, MultipartFile file, Long userId);

    AssignmentDTO updateAssignment(Long id, AssignmentDTO assignmentDTO, Long userId);

    void deleteAssignment(Long id, Long userId);

    AssignmentDTO getAssignmentById(Long id, Long userId);

    List<AssignmentDTO> getAllAssignments(Long userId);

    // Filter assignments
    List<AssignmentDTO> getAssignmentsBySubject(Long subjectId, Long userId);

    List<AssignmentDTO> getAssignmentsByStatus(String status, Long userId);

    List<AssignmentDTO> getUpcomingAssignments(Long userId);

    List<AssignmentDTO> getOverdueAssignments(Long userId);

    // Assignment submissions
    AssignmentSubmissionDTO submitAssignment(Long assignmentId, MultipartFile file, String notes, Long userId);

    // Get submission history for student
    List<AssignmentSubmissionDTO> getSubmissionHistory(Long assignmentId, Long userId);

    // Get all submissions for an assignment (Teacher view)
    List<AssignmentSubmissionDTO> getAllSubmissionsForAssignment(Long assignmentId, Long userId);

    // Get all submissions for a subject (Teacher view)
    List<AssignmentSubmissionDTO> getSubmissionsBySubject(Long subjectId, Long userId);

    AssignmentSubmissionDTO getLatestSubmission(Long assignmentId, Long userId);

    // Update status
    AssignmentDTO updateStatus(Long id, String status, Long userId);

    // Grade a submission
    AssignmentSubmissionDTO gradeSubmission(Long submissionId, Double score, String feedback, Long userId);

    // Statistics
    Long getCompletedCount(Long userId);

    Long getPendingCount(Long userId);

    Long getOverdueCount(Long userId);
}
