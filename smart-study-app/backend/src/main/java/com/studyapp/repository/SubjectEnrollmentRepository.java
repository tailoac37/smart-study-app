package com.studyapp.repository;

import com.studyapp.model.SubjectEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectEnrollmentRepository extends JpaRepository<SubjectEnrollment, Long> {

    // Tìm tất cả môn học mà sinh viên đã đăng ký
    List<SubjectEnrollment> findByStudent_Id(Long studentId);

    // Tìm tất cả sinh viên đăng ký 1 môn
    List<SubjectEnrollment> findBySubject_Id(Long subjectId);

    // Tìm đăng ký cụ thể
    Optional<SubjectEnrollment> findByStudent_IdAndSubject_Id(Long studentId, Long subjectId);

    // Tìm các môn đang học của sinh viên
    List<SubjectEnrollment> findByStudent_IdAndStatus(Long studentId, SubjectEnrollment.EnrollmentStatus status);

    // Kiểm tra sinh viên đã đăng ký môn chưa
    boolean existsByStudent_IdAndSubject_Id(Long studentId, Long subjectId);

    // Đếm số học sinh (distinct) của 1 giáo viên
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT e.student.id) FROM SubjectEnrollment e WHERE e.subject.teacher.id = ?1")
    Long countDistinctStudentBySubject_Teacher_Id(Long teacherId);
}
