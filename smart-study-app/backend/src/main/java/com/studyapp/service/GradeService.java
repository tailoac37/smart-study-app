package com.studyapp.service;

import com.studyapp.dto.GradeDTO;
import com.studyapp.dto.StudentGradeDTO;
import java.util.List;

public interface GradeService {
    List<GradeDTO> getAllGrades(Long userId);

    List<GradeDTO> getGradesBySubject(Long userId, Long subjectId);

    Double getGPA(Long userId);

    Double getSubjectAverage(Long userId, Long subjectId);

    GradeDTO createGrade(GradeDTO gradeDTO, Long userId);

    GradeDTO updateGrade(Long id, GradeDTO gradeDTO, Long userId);

    void deleteGrade(Long id, Long userId);

    // Teacher methods
    List<StudentGradeDTO> getGradesBySubjectForTeacher(Long subjectId, Long teacherId);
}
