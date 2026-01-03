package com.studyapp.repository;

import com.studyapp.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {

    // Tìm tất cả submissions của một bài tập
    List<AssignmentSubmission> findByAssignment_Id(Long assignmentId);

    // Tìm submissions của một user cho bài tập cụ thể
    List<AssignmentSubmission> findByAssignment_IdAndUser_IdOrderBySubmittedAtDesc(Long assignmentId, Long userId);

    // Tìm submission mới nhất của user cho bài tập
    Optional<AssignmentSubmission> findFirstByAssignment_IdAndUser_IdOrderBySubmittedAtDesc(Long assignmentId,
            Long userId);

    // Tìm tất cả submissions của một user
    List<AssignmentSubmission> findByUser_IdOrderBySubmittedAtDesc(Long userId);

    // Đếm số lần nộp của user cho bài tập
    Long countByAssignment_IdAndUser_Id(Long assignmentId, Long userId);

    // Tìm submissions chưa chấm
    List<AssignmentSubmission> findByStatusOrderBySubmittedAtDesc(AssignmentSubmission.SubmissionStatus status);

    // Tìm tất cả submissions của một môn học
    List<AssignmentSubmission> findByAssignment_Subject_Id(Long subjectId);

    // Đếm submissions theo giáo viên tạo assignment và status
    Long countByAssignment_CreatedBy_IdAndStatus(Long teacherId, AssignmentSubmission.SubmissionStatus status);
}
