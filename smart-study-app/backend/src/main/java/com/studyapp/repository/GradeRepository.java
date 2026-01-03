package com.studyapp.repository;

import com.studyapp.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByUser_Id(Long userId);

    List<Grade> findByUser_IdAndSubject_Id(Long userId, Long subjectId);

    @Query("SELECT AVG((g.score / g.maxScore) * g.weight) FROM Grade g WHERE g.user.id = ?1 AND g.subject.id = ?2")
    Double calculateSubjectAverage(Long userId, Long subjectId);

    @Query("SELECT AVG((g.score / g.maxScore) * 10) FROM Grade g WHERE g.user.id = ?1")
    Double calculateOverallGPA(Long userId);

    List<Grade> findBySubject_Id(Long subjectId);
}
