import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, collapsed, onToggle, unreadCount }) => {
    const isTeacher = user?.role === 'TEACHER';

    const menuItems = [
        { path: '/', icon: '📊', label: 'Tổng Quan', name: 'dashboard' },
        // Schedule only for students
        ...(!isTeacher ? [{ path: '/schedule', icon: '📅', label: 'Thời Khóa Biểu', name: 'schedule' }] : []),
        // Show different Subject item based on role
        ...(isTeacher
            ? [
                { path: '/teacher/subjects', icon: '👨‍🏫', label: 'Quản lý Môn học', name: 'teacher-subjects' },
                { path: '/teacher/timetable', icon: '📆', label: 'Lịch Giảng dạy', name: 'teacher-timetable' },
                { path: '/teacher/students', icon: '👥', label: 'Quản lý Sinh viên', name: 'teacher-students' },
            ]
            : [{ path: '/subjects', icon: '📖', label: 'Đăng ký Môn học', name: 'subjects' }]
        ),
        ...(isTeacher
            ? [{ path: '/teacher/assignments', icon: '📝', label: 'Quản lý Bài tập', name: 'teacher-assignments' }]
            : [{ path: '/assignments', icon: '📝', label: 'Bài Tập', name: 'assignments' }]
        ),
        ...(isTeacher
            ? [{ path: '/teacher/grades', icon: '📈', label: 'Quản lý Điểm số', name: 'teacher-grades' }]
            : [{ path: '/grades', icon: '📈', label: 'Điểm Số', name: 'grades' }]
        ),
        { path: '/documents', icon: '📚', label: 'Tài Liệu', name: 'documents' },
        { path: '/notes', icon: '📔', label: 'Ghi Chú', name: 'notes' },
        { path: '/notifications', icon: '🔔', label: 'Thông Báo', name: 'notifications', badge: unreadCount },
        { path: '/settings', icon: '⚙️', label: 'Cài Đặt', name: 'settings' },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🎓</span>
                    {!collapsed && <span className="logo-text">Smart Study</span>}
                </div>
                <button className="toggle-btn" onClick={onToggle} title={collapsed ? 'Mở rộng' : 'Thu gọn'}>
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={collapsed ? item.label : ''}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                        {item.badge > 0 && (
                            <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="version-info">
                    {!collapsed && <span>v1.0.0</span>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
