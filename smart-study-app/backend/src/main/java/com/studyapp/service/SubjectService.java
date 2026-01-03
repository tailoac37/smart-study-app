package com.studyapp.service;

import com.studyapp.dto.SubjectDTO;
import java.util.List;

public interface SubjectService {
    List<SubjectDTO> getAllSubjects(Long userId);

    SubjectDTO getSubjectById(Long id, Long userId);

    SubjectDTO createSubject(SubjectDTO subjectDTO, Long userId);

    SubjectDTO updateSubject(Long id, SubjectDTO subjectDTO, Long userId);

    void deleteSubject(Long id, Long userId);
}
