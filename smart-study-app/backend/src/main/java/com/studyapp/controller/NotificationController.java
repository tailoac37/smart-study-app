package com.studyapp.controller;

import com.studyapp.dto.NotificationDTO;
import com.studyapp.model.Notification;
import com.studyapp.model.User;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.NotificationService;
import com.studyapp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String usernameOrEmail = tokenProvider.getUsername(token);
            User user = userRepository.findByUsername(usernameOrEmail)
                    .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                            .orElseThrow(() -> new RuntimeException("User not found")));
            return user.getId();
        }
        throw new RuntimeException("Unauthorized");
    }

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(HttpServletRequest request) {
        System.out.println("============ GET /api/notifications ============");
        try {
            Long userId = getUserIdFromRequest(request);
            System.out.println("User ID from token: " + userId);
            List<Notification> notifications = notificationService.getUserNotifications(userId);
            System.out.println("Found " + notifications.size() + " notifications");
            List<NotificationDTO> dtos = notifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            System.out.println("Returning " + dtos.size() + " DTOs");
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("ERROR in getUserNotifications: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUser().getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType() != null ? notification.getType().toString() : null);
        dto.setIsRead(notification.getIsRead());
        dto.setActionUrl(notification.getActionUrl());
        dto.setRelatedId(notification.getRelatedId());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setReadAt(notification.getReadAt());
        return dto;
    }
}
