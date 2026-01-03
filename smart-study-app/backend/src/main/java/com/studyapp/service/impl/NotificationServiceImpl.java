package com.studyapp.service.impl;

import com.studyapp.model.Notification;
import com.studyapp.model.User;
import com.studyapp.repository.NotificationRepository;
import com.studyapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Notification createNotification(User user, String title, String message, Notification.NotificationType type,
            String actionUrl) {
        System.out.println("================== CREATING NOTIFICATION ==================");
        System.out.println("User ID: " + user.getId() + ", User: " + user.getUsername());
        System.out.println("Title: " + title);
        System.out.println("Message: " + message);
        System.out.println("Type: " + type);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setActionUrl(actionUrl);
        notification.setIsRead(false);

        Notification saved = notificationRepository.save(notification);
        System.out.println("Notification saved with ID: " + saved.getId());

        // Push to WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), saved);
            System.out.println("SUCCESS: Sent notification to /topic/notifications/" + user.getId());
        } catch (Exception e) {
            System.err.println("ERROR sending WebSocket notification: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("============================================================");

        return saved;
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        System.out.println("Fetching notifications for user: " + userId);
        List<Notification> list = notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        System.out.println("Found " + list.size() + " notifications");
        return list;
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUser_IdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
}
