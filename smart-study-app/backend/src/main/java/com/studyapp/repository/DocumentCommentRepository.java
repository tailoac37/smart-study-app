package com.studyapp.repository;

import com.studyapp.model.DocumentComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentCommentRepository extends JpaRepository<DocumentComment, Long> {

    List<DocumentComment> findByDocument_IdOrderByCreatedAtDesc(Long documentId);

    List<DocumentComment> findByDocument_IdAndParentIsNullOrderByCreatedAtDesc(Long documentId);

    List<DocumentComment> findByParent_IdOrderByCreatedAtAsc(Long parentId);

    long countByDocument_Id(Long documentId);

    void deleteByDocument_Id(Long documentId);
}
