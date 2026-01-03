import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const useWebSocket = (userId) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClientRef = useRef(null);

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
