package com.studyapp.repository;

import com.studyapp.model.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUser_Id(Long userId);

    List<Document> findBySubject_Id(Long subjectId);

    List<Document> findByIsPublicTrue();

    List<Document> findByUser_IdOrIsPublicTrue(Long userId);

    // Lấy tài liệu đã chia sẻ (shared feed) - sắp xếp theo thời gian mới nhất
    List<Document> findByIsSharedTrueOrderByCreatedAtDesc();

    // Lấy tài liệu chia sẻ có phân trang
    Page<Document> findByIsSharedTrueOrderByCreatedAtDesc(Pageable pageable);

    // Lấy tài liệu hot (nhiều like nhất)
    List<Document> findByIsSharedTrueOrderByLikeCountDesc();

    // Tìm kiếm tài liệu theo title hoặc tags
    @Query("SELECT d FROM Document d WHERE d.isShared = true AND " +
            "(LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(d.tags) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Document> searchSharedDocuments(@Param("keyword") String keyword);

    // Lấy tài liệu theo loại
    List<Document> findByIsSharedTrueAndTypeOrderByCreatedAtDesc(Document.DocumentType type);

    // Tài liệu của user (bao gồm cả chưa chia sẻ)
    List<Document> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
