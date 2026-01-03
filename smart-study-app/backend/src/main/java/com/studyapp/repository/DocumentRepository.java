package com.studyapp.repository;

import com.studyapp.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUser_Id(Long userId);

    List<Document> findBySubject_Id(Long subjectId);

    List<Document> findByIsPublicTrue();

    List<Document> findByUser_IdOrIsPublicTrue(Long userId);
}
