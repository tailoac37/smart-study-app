package com.studyapp.repository;

import com.studyapp.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);

    List<Subject> findByTeacherId(Long teacherId);

    List<Subject> findBySemester(String semester);

    List<Subject> findByTargetYear(Integer targetYear);

    Boolean existsByCode(String code);

    Long countByTeacher_Id(Long teacherId);
}
