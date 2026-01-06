package com.studyapp.service.impl;

import com.studyapp.dto.DocumentCommentDTO;
import com.studyapp.dto.SharedDocumentDTO;
import com.studyapp.dto.UploadDocumentRequest;
import com.studyapp.model.*;
import com.studyapp.repository.*;
import com.studyapp.service.SharedDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SharedDocumentServiceImpl implements SharedDocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentLikeRepository likeRepository;

    @Autowired
    private DocumentCommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Value("${file.upload-dir:uploads/documents}")
    private String uploadDir;

    @Override
    public List<SharedDocumentDTO> getSharedFeed(Long currentUserId) {
        List<Document> documents = documentRepository.findByIsSharedTrueOrderByCreatedAtDesc();
        return documents.stream()
                .map(doc -> convertToDTO(doc, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public List<SharedDocumentDTO> getHotDocuments(Long currentUserId) {
        List<Document> documents = documentRepository.findByIsSharedTrueOrderByLikeCountDesc();
        return documents.stream()
                .map(doc -> convertToDTO(doc, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public List<SharedDocumentDTO> searchDocuments(String keyword, Long currentUserId) {
        List<Document> documents = documentRepository.searchSharedDocuments(keyword);
        return documents.stream()
                .map(doc -> convertToDTO(doc, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public List<SharedDocumentDTO> getDocumentsByType(String type, Long currentUserId) {
        Document.DocumentType docType = Document.DocumentType.valueOf(type);
        List<Document> documents = documentRepository.findByIsSharedTrueAndTypeOrderByCreatedAtDesc(docType);
        return documents.stream()
                .map(doc -> convertToDTO(doc, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public SharedDocumentDTO getDocumentById(Long documentId, Long currentUserId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return convertToDTO(document, currentUserId);
    }

    @Override
    @Transactional
    public SharedDocumentDTO uploadDocument(UploadDocumentRequest request, MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Save file
        String fileName = saveFile(file);
        String fileExtension = getFileExtension(file.getOriginalFilename());

        Document document = new Document();
        document.setUser(user);
        document.setTitle(request.getTitle());
        document.setDescription(request.getDescription());
        document.setType(Document.DocumentType.valueOf(request.getType()));
        document.setFileUrl("/uploads/documents/" + fileName);
        document.setFileName(file.getOriginalFilename());
        document.setFileSize(file.getSize());
        document.setFileExtension(fileExtension);
        document.setTags(request.getTags());
        document.setIsShared(request.getIsShared() != null ? request.getIsShared() : true);
        document.setIsPublic(true);

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElse(null);
            document.setSubject(subject);
        }

        Document saved = documentRepository.save(document);
        return convertToDTO(saved, userId);
    }

    @Override
    @Transactional
    public SharedDocumentDTO updateDocument(Long documentId, UploadDocumentRequest request, Long userId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own documents");
        }

        document.setTitle(request.getTitle());
        document.setDescription(request.getDescription());
        document.setType(Document.DocumentType.valueOf(request.getType()));
        document.setTags(request.getTags());
        document.setIsShared(request.getIsShared() != null ? request.getIsShared() : true);

        Document saved = documentRepository.save(document);
        return convertToDTO(saved, userId);
    }

    @Override
    @Transactional
    public void deleteDocument(Long documentId, Long userId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own documents");
        }

        documentRepository.delete(document);
    }

    @Override
    @Transactional
    public boolean toggleLike(Long documentId, Long userId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean exists = likeRepository.existsByUser_IdAndDocument_Id(userId, documentId);

        if (exists) {
            // Unlike
            likeRepository.deleteByUser_IdAndDocument_Id(userId, documentId);
            document.setLikeCount(Math.max(0, document.getLikeCount() - 1));
            documentRepository.save(document);
            return false;
        } else {
            // Like
            DocumentLike like = new DocumentLike();
            like.setUser(user);
            like.setDocument(document);
            likeRepository.save(like);
            document.setLikeCount(document.getLikeCount() + 1);
            documentRepository.save(document);
            return true;
        }
    }

    @Override
    public boolean isLiked(Long documentId, Long userId) {
        return likeRepository.existsByUser_IdAndDocument_Id(userId, documentId);
    }

    @Override
    @Transactional
    public DocumentCommentDTO addComment(Long documentId, String content, Long parentId, Long userId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DocumentComment comment = new DocumentComment();
        comment.setDocument(document);
        comment.setUser(user);
        comment.setContent(content);

        if (parentId != null) {
            DocumentComment parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parent);
        }

        DocumentComment saved = commentRepository.save(comment);

        // Update comment count
        document.setCommentCount(document.getCommentCount() + 1);
        documentRepository.save(document);

        return convertCommentToDTO(saved);
    }

    @Override
    public List<DocumentCommentDTO> getComments(Long documentId) {
        List<DocumentComment> comments = commentRepository
                .findByDocument_IdAndParentIsNullOrderByCreatedAtDesc(documentId);
        return comments.stream()
                .map(this::convertCommentWithReplies)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        DocumentComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        Document document = comment.getDocument();
        document.setCommentCount(Math.max(0, document.getCommentCount() - 1));
        documentRepository.save(document);

        commentRepository.delete(comment);
    }

    @Override
    @Transactional
    public void incrementDownloadCount(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        document.setDownloadCount(document.getDownloadCount() + 1);
        documentRepository.save(document);
    }

    @Override
    @Transactional
    public void incrementViewCount(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        document.setViewCount(document.getViewCount() + 1);
        documentRepository.save(document);
    }

    @Override
    public List<SharedDocumentDTO> getMyDocuments(Long userId) {
        List<Document> documents = documentRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        return documents.stream()
                .map(doc -> convertToDTO(doc, userId))
                .collect(Collectors.toList());
    }

    // Helper methods
    private String saveFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private SharedDocumentDTO convertToDTO(Document document, Long currentUserId) {
        SharedDocumentDTO dto = new SharedDocumentDTO();
        dto.setId(document.getId());
        dto.setTitle(document.getTitle());
        dto.setDescription(document.getDescription());
        dto.setType(document.getType().name());
        dto.setFileUrl(document.getFileUrl());
        dto.setFileName(document.getFileName());
        dto.setFileSize(document.getFileSize());
        dto.setFileExtension(document.getFileExtension());
        dto.setTags(document.getTags());

        // User info
        dto.setUserId(document.getUser().getId());
        dto.setUserName(document.getUser().getFullName());

        // Subject info
        if (document.getSubject() != null) {
            dto.setSubjectId(document.getSubject().getId());
            dto.setSubjectName(document.getSubject().getName());
            dto.setSubjectCode(document.getSubject().getCode());
        }

        // Stats
        dto.setLikeCount(document.getLikeCount());
        dto.setCommentCount(document.getCommentCount());
        dto.setDownloadCount(document.getDownloadCount());
        dto.setViewCount(document.getViewCount());

        // Current user's like status
        if (currentUserId != null) {
            dto.setIsLikedByCurrentUser(likeRepository.existsByUser_IdAndDocument_Id(currentUserId, document.getId()));
        } else {
            dto.setIsLikedByCurrentUser(false);
        }

        dto.setCreatedAt(document.getCreatedAt());
        dto.setUpdatedAt(document.getUpdatedAt());

        return dto;
    }

    private DocumentCommentDTO convertCommentToDTO(DocumentComment comment) {
        DocumentCommentDTO dto = new DocumentCommentDTO();
        dto.setId(comment.getId());
        dto.setDocumentId(comment.getDocument().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getFullName());
        dto.setContent(comment.getContent());
        if (comment.getParent() != null) {
            dto.setParentId(comment.getParent().getId());
        }
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }

    private DocumentCommentDTO convertCommentWithReplies(DocumentComment comment) {
        DocumentCommentDTO dto = convertCommentToDTO(comment);
        List<DocumentComment> replies = commentRepository.findByParent_IdOrderByCreatedAtAsc(comment.getId());
        dto.setReplies(replies.stream()
                .map(this::convertCommentToDTO)
                .collect(Collectors.toList()));
        return dto;
    }
}
