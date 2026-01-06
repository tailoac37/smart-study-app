package com.studyapp.repository;

import com.studyapp.model.DocumentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentLikeRepository extends JpaRepository<DocumentLike, Long> {

    Optional<DocumentLike> findByUser_IdAndDocument_Id(Long userId, Long documentId);

    boolean existsByUser_IdAndDocument_Id(Long userId, Long documentId);

    List<DocumentLike> findByDocument_Id(Long documentId);

    void deleteByUser_IdAndDocument_Id(Long userId, Long documentId);

    long countByDocument_Id(Long documentId);
}
