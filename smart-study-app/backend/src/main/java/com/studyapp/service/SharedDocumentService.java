package com.studyapp.service;

import com.studyapp.dto.DocumentCommentDTO;
import com.studyapp.dto.SharedDocumentDTO;
import com.studyapp.dto.UploadDocumentRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SharedDocumentService {

    // Lấy feed tài liệu đã chia sẻ
    List<SharedDocumentDTO> getSharedFeed(Long currentUserId);

    // Lấy tài liệu hot (nhiều like)
    List<SharedDocumentDTO> getHotDocuments(Long currentUserId);

    // Tìm kiếm tài liệu
    List<SharedDocumentDTO> searchDocuments(String keyword, Long currentUserId);

    // Lấy tài liệu theo loại
    List<SharedDocumentDTO> getDocumentsByType(String type, Long currentUserId);

    // Lấy chi tiết tài liệu
    SharedDocumentDTO getDocumentById(Long documentId, Long currentUserId);

    // Upload tài liệu mới
    SharedDocumentDTO uploadDocument(UploadDocumentRequest request, MultipartFile file, Long userId);

    // Cập nhật tài liệu
    SharedDocumentDTO updateDocument(Long documentId, UploadDocumentRequest request, Long userId);

    // Xóa tài liệu
    void deleteDocument(Long documentId, Long userId);

    // Like/Unlike tài liệu
    boolean toggleLike(Long documentId, Long userId);

    // Kiểm tra đã like chưa
    boolean isLiked(Long documentId, Long userId);

    // Thêm bình luận
    DocumentCommentDTO addComment(Long documentId, String content, Long parentId, Long userId);

    // Lấy danh sách bình luận
    List<DocumentCommentDTO> getComments(Long documentId);

    // Xóa bình luận
    void deleteComment(Long commentId, Long userId);

    // Tăng lượt tải
    void incrementDownloadCount(Long documentId);

    // Tăng lượt xem
    void incrementViewCount(Long documentId);

    // Lấy tài liệu của user
    List<SharedDocumentDTO> getMyDocuments(Long userId);
}
