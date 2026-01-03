import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notificationCount, setNotificationCount] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="datetime-info">
                    <div className="current-time">{formatTime(currentTime)}</div>
                    <div className="current-date">{formatDate(currentTime)}</div>
                </div>
            </div>

            <div className="header-right">
                <div className="header-actions">
                    <button className="icon-btn" title="Tìm kiếm">
                        🔍
                    </button>

                    <button className="icon-btn notification-btn" title="Thông báo">
                        🔔
                        {notificationCount > 0 && (
                            <span className="notification-badge">{notificationCount}</span>
                        )}
                    </button>
                </div>

                <div className="user-menu">
                    <div className="user-avatar">
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user?.fullName || 'User'}</div>
                        <div className="user-role">
                            {user?.role === 'TEACHER' ? '👨‍🏫 Giảng viên' : '👨‍🎓 Sinh viên'}
                            {user?.role && <span style={{ fontSize: '0.8em', opacity: 0.8 }}> ({user.role})</span>}
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onLogout} title="Đăng xuất">
                        🚪
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
