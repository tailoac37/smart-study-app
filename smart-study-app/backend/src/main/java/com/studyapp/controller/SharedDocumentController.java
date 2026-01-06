package com.studyapp.controller;

import com.studyapp.dto.DocumentCommentDTO;
import com.studyapp.dto.SharedDocumentDTO;
import com.studyapp.dto.UploadDocumentRequest;
import com.studyapp.model.User;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.SharedDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shared-documents")
public class SharedDocumentController {

    @Autowired
    private SharedDocumentService sharedDocumentService;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    // Lấy feed tài liệu
    @GetMapping("/feed")
    public ResponseEntity<List<SharedDocumentDTO>> getFeed(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(sharedDocumentService.getSharedFeed(userId));
    }

    // Lấy tài liệu hot
    @GetMapping("/hot")
    public ResponseEntity<List<SharedDocumentDTO>> getHotDocuments(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(sharedDocumentService.getHotDocuments(userId));
    }

    // Tìm kiếm
    @GetMapping("/search")
    public ResponseEntity<List<SharedDocumentDTO>> search(
            @RequestParam String keyword,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(sharedDocumentService.searchDocuments(keyword, userId));
    }

    // Lấy theo loại
    @GetMapping("/type/{type}")
    public ResponseEntity<List<SharedDocumentDTO>> getByType(
            @PathVariable String type,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(sharedDocumentService.getDocumentsByType(type, userId));
    }

    // Lấy chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<SharedDocumentDTO> getDocument(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        sharedDocumentService.incrementViewCount(id);
        return ResponseEntity.ok(sharedDocumentService.getDocumentById(id, userId));
    }

    // Upload tài liệu mới
    @PostMapping("/upload")
    public ResponseEntity<SharedDocumentDTO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("type") String type,
            @RequestParam(value = "subjectId", required = false) Long subjectId,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "isShared", defaultValue = "true") Boolean isShared,
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);

        UploadDocumentRequest request = new UploadDocumentRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setType(type);
        request.setSubjectId(subjectId);
        request.setTags(tags);
        request.setIsShared(isShared);

        return ResponseEntity.ok(sharedDocumentService.uploadDocument(request, file, userId));
    }

    // Cập nhật tài liệu
    @PutMapping("/{id}")
    public ResponseEntity<SharedDocumentDTO> update(
            @PathVariable Long id,
            @RequestBody UploadDocumentRequest request,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(sharedDocumentService.updateDocument(id, request, userId));
    }

    // Xóa tài liệu
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        sharedDocumentService.deleteDocument(id, userId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Document deleted successfully"));
    }

    // Like/Unlike
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        boolean isLiked = sharedDocumentService.toggleLike(id, userId);
        return ResponseEntity.ok(Collections.singletonMap("liked", isLiked));
    }

    // Lấy comments
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<DocumentCommentDTO>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(sharedDocumentService.getComments(id));
    }

    // Thêm comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<DocumentCommentDTO> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        String content = (String) body.get("content");
        Long parentId = body.get("parentId") != null ? Long.valueOf(body.get("parentId").toString()) : null;
        return ResponseEntity.ok(sharedDocumentService.addComment(id, content, parentId, userId));
    }

    // Xóa comment
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        sharedDocumentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Comment deleted"));
    }

    // Track download
    @PostMapping("/{id}/download")
    public ResponseEntity<?> trackDownload(@PathVariable Long id) {
        sharedDocumentService.incrementDownloadCount(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Download tracked"));
    }

    // Lấy tài liệu của tôi
    @GetMapping("/my-documents")
    public ResponseEntity<List<SharedDocumentDTO>> getMyDocuments(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(sharedDocumentService.getMyDocuments(userId));
    }
}
