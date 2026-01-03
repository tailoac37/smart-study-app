import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Subjects from './pages/Subjects';
import TeacherSubjects from './pages/TeacherSubjects';
import Assignments from './pages/Assignments';
import TeacherAssignments from './pages/TeacherAssignments';
import TeacherGrades from './pages/TeacherGrades';
import Grades from './pages/Grades';
import Documents from './pages/Documents';
import Notes from './pages/Notes';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherTimetable from './pages/TeacherTimetable';
import StudentManagement from './pages/StudentManagement';
import './App.css';

import { useWebSocket } from './hooks/useWebSocket';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            setIsAuthenticated(true);
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    // Websocket Hook
    const { notifications, unreadCount, setUnreadCount } = useWebSocket(currentUser?.id);

    const handleLogin = (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setIsAuthenticated(false);
        // Force redirect to login to clear any app state
        // window.location.href = '/login'; // Do not use this in Electron/HashRouter
        setIsAuthenticated(false);
        // Force reload to clear all state and reset Router
        window.location.reload();
    };

    if (!isAuthenticated) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        );
    }

    return (
        <Router>
            <div className="app">
                <Sidebar
                    user={currentUser}
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    unreadCount={unreadCount}
                />
                <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                    <Header
                        user={currentUser}
                        onLogout={handleLogout}
                        notifications={notifications}
                        unreadCount={unreadCount}
                        setUnreadCount={setUnreadCount}
                    />
                    <div className="page-content">
                        <Routes>
                            <Route path="/" element={<Dashboard user={currentUser} />} />
                            <Route path="/schedule" element={<Schedule user={currentUser} />} />
                            <Route path="/subjects" element={<Subjects user={currentUser} />} />
                            <Route path="/teacher/subjects" element={<TeacherSubjects user={currentUser} />} />
                            <Route path="/teacher/timetable" element={<TeacherTimetable user={currentUser} />} />
                            <Route path="/teacher/students" element={<StudentManagement user={currentUser} />} />
                            <Route path="/teacher/assignments" element={<TeacherAssignments user={currentUser} />} />
                            <Route path="/teacher/grades" element={<TeacherGrades user={currentUser} />} />
                            <Route path="/assignments" element={<Assignments user={currentUser} />} />
                            <Route path="/grades" element={<Grades user={currentUser} />} />
                            <Route path="/documents" element={<Documents user={currentUser} />} />
                            <Route path="/notes" element={<Notes user={currentUser} />} />
                            <Route path="/notifications" element={<Notifications user={currentUser} setUnreadCount={setUnreadCount} />} />
                            <Route path="/settings" element={<Settings user={currentUser} />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
