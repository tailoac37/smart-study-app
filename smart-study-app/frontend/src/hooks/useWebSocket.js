import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { notificationAPI } from '../services/api';

export const useWebSocket = (userId) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClientRef = useRef(null);

    // Fetch initial unread count from API
    useEffect(() => {
        if (!userId) return;

        const fetchInitialNotifications = async () => {
            try {
                const res = await notificationAPI.getAll();
                const notifs = res.data || [];
                setNotifications(notifs);
                // Count unread notifications
                const unread = notifs.filter(n => !n.isRead).length;
                setUnreadCount(unread);
                console.log(`Loaded ${notifs.length} notifications, ${unread} unread`);
            } catch (error) {
                console.error('Error fetching initial notifications:', error);
            }
        };

        fetchInitialNotifications();
    }, [userId]);

    // WebSocket connection for real-time updates
    useEffect(() => {
        if (!userId) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null; // Disable debug logs

        stompClient.connect({}, (frame) => {
            console.log('Connected to WebSocket');

            // Subscribe to user notifications
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                const newNotification = JSON.parse(message.body);
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show browser notification if allowed
                if (Notification.permission === 'granted') {
                    new Notification(newNotification.title, { body: newNotification.message });
                } else if (Notification.permission !== 'denied') {
                    // Request permission
                    Notification.requestPermission();
                }
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
        });

        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    }, [userId]);

    return { notifications, setNotifications, unreadCount, setUnreadCount };
};

