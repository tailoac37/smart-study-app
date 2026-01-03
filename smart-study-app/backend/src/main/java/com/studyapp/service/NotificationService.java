package com.studyapp.service;

import com.studyapp.model.Notification;
import com.studyapp.model.User;
import java.util.List;

public interface NotificationService {
    Notification createNotification(User user, String title, String message, Notification.NotificationType type,
            String actionUrl);

    List<Notification> getUserNotifications(Long userId);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long userId);
}
