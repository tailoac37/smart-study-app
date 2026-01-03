import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import './Notifications.css';

const Notifications = ({ user, setUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            console.log('Fetching notifications...');
            const res = await notificationAPI.getAll();
            console.log('Notifications response:', res);
            console.log('Notifications data:', res.data);
            setNotifications(res.data || []);

            // Assuming the sidebar badge updates based on websocket live count,
            // but we might want to refresh from API too.
            // setUnreadCount is passed but here we just list them.
        } catch (error) {
            console.error('Error fetching notifications:', error);
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            // Decrease global count? 
            // The best way is to fetch unread count again or decrement locally
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="notifications-page">
            <div className="page-header">
                <h1>🔔 Thông Báo</h1>
                <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
                    Đánh dấu đã đọc tất cả
                </button>
            </div>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔕</div>
                        <p>Bạn chưa có thông báo nào</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        >
                            <div className="notification-icon">
                                {getIconByType(notification.type)}
                            </div>
                            <div className="notification-content">
                                <h3>{notification.title}</h3>
                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {new Date(notification.createdAt).toLocaleString('vi-VN')}
                                </span>
                            </div>
                            {!notification.isRead && <div className="unread-dot"></div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const getIconByType = (type) => {
    switch (type) {
        case 'GRADE_UPDATED': return '📈';
        case 'ASSIGNMENT_REMINDER': return '⏰';
        case 'SCHEDULE_REMINDER': return '📅';
        default: return '📢';
    }
};

export default Notifications;
