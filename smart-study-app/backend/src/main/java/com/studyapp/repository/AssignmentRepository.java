package com.studyapp.repository;

import com.studyapp.model.Assignment;
import com.studyapp.model.Assignment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByUser_Id(Long userId);

    List<Assignment> findByUser_IdAndStatus(Long userId, Status status);

    List<Assignment> findByUser_IdAndSubject_Id(Long userId, Long subjectId);

    @Query("SELECT a FROM Assignment a WHERE a.user.id = ?1 AND a.deadline BETWEEN ?2 AND ?3 ORDER BY a.deadline ASC")
    List<Assignment> findUpcomingAssignments(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Assignment a WHERE a.user.id = ?1 AND a.status != 'COMPLETED' AND a.deadline < ?2")
    List<Assignment> findOverdueAssignments(Long userId, LocalDateTime now);

    // Teacher methods
    List<Assignment> findByCreatedBy_Id(Long teacherId);

    List<Assignment> findByCreatedBy_IdAndSubject_Id(Long teacherId, Long subjectId);

    List<Assignment> findBySubject_Id(Long subjectId);

    @Query("SELECT a FROM Assignment a WHERE (a.user.id = :userId) OR (a.subject.id IN :subjectIds AND a.user IS NULL)")
    List<Assignment> findStudentAssignments(Long userId, List<Long> subjectIds);

    @Query("SELECT a FROM Assignment a WHERE a.subject.id = :subjectId AND (a.user.id = :userId OR a.user IS NULL)")
    List<Assignment> findStudentAssignmentsBySubject(Long userId, Long subjectId);
}
