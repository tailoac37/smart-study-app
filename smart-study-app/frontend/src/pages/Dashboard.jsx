import React, { useState, useEffect } from 'react';
import { assignmentAPI, scheduleAPI, subjectAPI, noteAPI, demoAPI, dashboardAPI } from '../services/api';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSubjects: 0,
        upcomingAssignments: 0,
        averageGPA: 0,
        completedTasks: 0,
        // Teacher stats
        totalStudents: 0,
        pendingGrading: 0
    });

    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [recentAssignments, setRecentAssignments] = useState([]);
    const [unreadNotes, setUnreadNotes] = useState(0);

    const isTeacher = user?.role === 'TEACHER' || user?.roles?.includes('ROLE_TEACHER');

    useEffect(() => {
        if (isTeacher) {
            fetchTeacherDashboardData();
        } else {
            fetchStudentDashboardData();
        }
    }, [isTeacher]);

    const fetchTeacherDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, scheduleRes, noteRes] = await Promise.all([
                dashboardAPI.getTeacherStats(),
                scheduleAPI.getMyTimetable(), // Teacher schedule from /schedules/my-timetable
                noteAPI.getAll()
            ]);

            const tStats = statsRes.data || {};
            const schedules = scheduleRes.data || []; // Assuming this returns teacher's schedule
            const notes = noteRes.data || [];

            setStats({
                totalSubjects: tStats.totalSubjects || 0,
                totalStudents: tStats.totalStudents || 0,
                pendingGrading: tStats.pendingGrading || 0,
                // Reusing upcomingAssignments for Pending Grading in UI or separate
            });

            // 3. Today's Classes
            const todaySchedule = filterTodayClasses(schedules);
            setUpcomingClasses(todaySchedule);

            // 4. Unread Notes
            const unread = notes.filter(n => n.sender && n.sender.id !== user.id && !n.isRead).length; // Notes received
            setUnreadNotes(unread);

        } catch (error) {
            console.error("Error loading teacher dashboard:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchStudentDashboardData = async () => {
        try {
            setLoading(true);
            const [assignRes, scheduleRes, subjectRes, noteRes] = await Promise.all([
                assignmentAPI.getAll(),
                scheduleAPI.getMyTimetable(),
                subjectAPI.getAll(),
                noteAPI.getAll()
            ]);

            const assignments = assignRes.data || [];
            const schedules = scheduleRes.data || [];
            const subjects = subjectRes.data || [];
            const notes = noteRes.data || [];

            // 1. Calculate Stats
            const totalSubjects = subjects.length;
            const completedTasks = assignments.filter(a => a.status === 'COMPLETED').length;
            const upcoming = assignments.filter(a => a.status !== 'COMPLETED' && new Date(a.deadline) > new Date()).length;

            // GPA Calculation (4.0 Scale)
            const gpa = calculateGPA(assignments, subjects);

            setStats({
                totalSubjects,
                upcomingAssignments: upcoming,
                averageGPA: parseFloat(gpa),
                completedTasks
            });

            // 2. Upcoming Assignments (Next 3)
            const pending = assignments
                .filter(a => a.status !== 'COMPLETED' && new Date(a.deadline) > new Date())
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 3);
            setRecentAssignments(pending);

            // 3. Today's Classes
            const todaySchedule = filterTodayClasses(schedules);
            setUpcomingClasses(todaySchedule);

            // 4. Unread Notes
            const unread = notes.filter(n => n.senderId && !n.isRead).length;
            setUnreadNotes(unread);

        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Helpers ---

    const convertTo4Scale = (score10) => {
        if (score10 >= 8.5) return 4.0;
        if (score10 >= 7.0) return 3.0;
        if (score10 >= 5.5) return 2.0;
        if (score10 >= 4.0) return 1.0;
        return 0.0;
    };

    const calculateGPA = (assignments, subjectList) => {
        const subjectGroups = {};
        assignments.forEach(a => {
            if (a.latestSubmission && a.latestSubmission.score !== null) {
                if (!subjectGroups[a.subjectId]) subjectGroups[a.subjectId] = [];
                subjectGroups[a.subjectId].push(a);
            }
        });

        let totalWeightedScore4 = 0;
        let totalCredits = 0;

        Object.keys(subjectGroups).forEach(subId => {
            const subject = subjectList.find(s => s.id === parseInt(subId));
            const credits = subject?.credits || 0;

            if (credits > 0) {
                const group = subjectGroups[subId];
                let totalScore = 0;
                let totalWeight = 0;

                group.forEach(a => {
                    const score = a.latestSubmission.score;
                    let weight = 1;
                    const title = a.title.toLowerCase();
                    if (title.includes('giữa kì') || title.includes('midterm')) weight = 2;
                    if (title.includes('cuối kì') || title.includes('final')) weight = 3;

                    totalScore += score * weight;
                    totalWeight += weight;
                });

                const avg10 = totalWeight === 0 ? 0 : totalScore / totalWeight;
                const avg4 = convertTo4Scale(avg10);

                totalWeightedScore4 += avg4 * credits;
                totalCredits += credits;
            }
        });

        return totalCredits === 0 ? "0.00" : (totalWeightedScore4 / totalCredits).toFixed(2);
    };

    const filterTodayClasses = (allSchedules) => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
        // Assuming backend Schedule model has dayOfWeek (2-8 or 0-6 or MONDAY enum)
        // Adjust based on your backend. Usually we map JS 0-6 to Backend format.
        // Let's assume standard 'MONDAY', 'TUESDAY' etc or 2,3,4,5,6,7,CN

        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const todayStr = days[dayOfWeek];

        return allSchedules
            .filter(s => s.dayOfWeek === todayStr)
            .sort((a, b) => a.startTime || a.lessonStart - b.startTime || b.lessonStart) // Sort by lesson
            .map(s => ({
                id: s.id,
                subject: s.subjectName || (s.subject ? s.subject.name : 'Môn học'), // Handle subject obj or name
                time: (s.startTime && s.endTime)
                    ? `${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)}`
                    : `Tiết ${s.lessonStart} - ${s.lessonEnd}`,
                room: s.room || 'P.---',
                color: s.subject?.color || '#3b82f6'
            }));
    };

    const getDaysUntil = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Quá hạn';
        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Ngày mai';
        return `${diffDays} ngày`;
    };

    if (loading) return <div className="loading-spinner">Đang tải dữ liệu...</div>;

    // --- RENDER TEACHER DASHBOARD ---
    if (isTeacher) {
        return (
            <div className="dashboard fade-in">
                <div className="page-header">
                    <div>
                        <h1>Xin chào, Giáo viên {user?.fullName}! 👋</h1>
                        <p>Chào mừng thầy/cô quay trở lại hệ thống.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card" style={{ borderLeftColor: '#2563eb' }}>
                        <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                            📚
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Lớp học phụ trách</div>
                            <div className="stat-value">{stats.totalSubjects}</div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
                        <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                            👨‍🎓
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Tổng sinh viên</div>
                            <div className="stat-value">{stats.totalStudents}</div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
                        <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                            📝
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Bài cần chấm</div>
                            <div className="stat-value">{stats.pendingGrading}</div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
                        <div className="stat-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>
                            🔔
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Tin nhắn mới</div>
                            <div className="stat-value">{unreadNotes}</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Teacher Schedule */}
                    <div className="card dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">📅 Lịch dạy hôm nay</h3>
                        </div>
                        <div className="card-body">
                            {upcomingClasses.length > 0 ? (
                                <div className="class-list">
                                    {upcomingClasses.map((cls) => (
                                        <div key={cls.id} className="class-item hover-lift">
                                            <div className="class-color" style={{ background: cls.color }}></div>
                                            <div className="class-info">
                                                <div className="class-subject">{cls.subject}</div>
                                                <div className="class-details">
                                                    <span>🕐 {cls.time}</span>
                                                    <span>📍 {cls.room}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">☕</div>
                                    <p>Hôm nay thầy/cô không có lịch dạy!</p>
                                </div>
                            )}
                            <button className="btn-link" onClick={() => navigate('/schedule')}>Xem toàn bộ lịch dạy</button>
                        </div>
                    </div>

                    {/* Teacher Quick Actions */}
                    <div className="card dashboard-card quick-actions-card">
                        <div className="card-header">
                            <h3 className="card-title">⚡ Thao tác nhanh</h3>
                        </div>
                        <div className="card-body">
                            <div className="quick-actions">
                                <button className="quick-action-btn" onClick={() => navigate('/assignments')}>
                                    <span className="action-icon">➕</span>
                                    <span className="action-label">Tạo bài tập</span>
                                </button>
                                <button className="quick-action-btn" onClick={() => navigate('/notes')}>
                                    <span className="action-icon">📢</span>
                                    <span className="action-label">Gửi thông báo</span>
                                </button>
                                <button className="quick-action-btn" onClick={() => navigate('/teacher/grades')}>
                                    <span className="action-icon">💯</span>
                                    <span className="action-label">Vào sổ điểm</span>
                                </button>
                                <button className="quick-action-btn" onClick={() => navigate('/documents')}>
                                    <span className="action-icon">📂</span>
                                    <span className="action-label">Upload tài liệu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER STUDENT DASHBOARD ---
    return (
        <div className="dashboard fade-in">
            <div className="page-header">
                <div>
                    <h1>Xin chào, {user?.fullName || user?.username}! 👋</h1>
                    <p>Chúc bạn một ngày học tập hiệu quả!</p>
                </div>
            </div>

            {/* Stats Grid */}
            {stats.totalSubjects === 0 && !loading ? (
                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <p>Chào mừng bạn mới! Hiện tại bạn chưa có dữ liệu môn học nào.</p>
                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            setLoading(true);
                            await demoAPI.generate(); // Only works for students if configured? 
                            // Demo data logic might need adjustment for teacher if desired.
                            fetchStudentDashboardData();
                        }}
                    >
                        🚀 Khởi tạo dữ liệu mẫu
                    </button>
                </div>
            ) : (
                <div className="stats-grid">
                    <div className="stat-card" style={{ borderLeftColor: '#2563eb' }}>
                        <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                            📚
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Tổng môn học</div>
                            <div className="stat-value">{stats.totalSubjects}</div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
                        <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                            📝
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Bài tập cần làm</div>
                            <div className="stat-value">{stats.upcomingAssignments}</div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
                        <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                            🏆
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">GPA (Hệ 4)</div>
                            <div className="stat-value">{stats.averageGPA}</div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
                        <div className="stat-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>
                            🔔
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Tin nhắn mới</div>
                            <div className="stat-value">{unreadNotes}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-grid">
                {/* Upcoming Classes */}
                <div className="card dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">📅 Lịch học hôm nay</h3>
                    </div>
                    <div className="card-body">
                        {upcomingClasses.length > 0 ? (
                            <div className="class-list">
                                {upcomingClasses.map((cls) => (
                                    <div key={cls.id} className="class-item hover-lift">
                                        <div className="class-color" style={{ background: cls.color }}></div>
                                        <div className="class-info">
                                            <div className="class-subject">{cls.subject}</div>
                                            <div className="class-details">
                                                <span>🕐 {cls.time}</span>
                                                <span>📍 {cls.room}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">☕</div>
                                <p>Hôm nay không có lịch học!</p>
                            </div>
                        )}
                        <button className="btn-link" onClick={() => navigate('/schedule')}>Xem toàn bộ lịch</button>
                    </div>
                </div>

                {/* Recent Assignments */}
                <div className="card dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">🚨 Deadline sắp tới</h3>
                    </div>
                    <div className="card-body">
                        {recentAssignments.length > 0 ? (
                            <div className="assignment-list">
                                {recentAssignments.map((assignment) => (
                                    <div key={assignment.id} className="assignment-item hover-lift" onClick={() => navigate('/assignments')}>
                                        <div className="assignment-priority" style={{ background: '#ef4444' }}></div>
                                        <div className="assignment-info">
                                            <div className="assignment-title">{assignment.title}</div>
                                            <div className="assignment-meta">
                                                <span className="assignment-subject">{assignment.subjectName}</span>
                                                <span className="assignment-deadline urgent">
                                                    ⏰ {getDaysUntil(assignment.deadline)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">✨</div>
                                <p>Bạn đã hoàn thành hết bài tập!</p>
                            </div>
                        )}
                        <button className="btn-link" onClick={() => navigate('/assignments')}>Xem tất cả bài tập</button>
                    </div>
                </div>

                {/* Notes/Announcements Preview */}
                <div className="card dashboard-card quick-actions-card">
                    <div className="card-header">
                        <h3 className="card-title">📌 Thao tác nhanh</h3>
                    </div>
                    <div className="card-body">
                        <div className="quick-actions">
                            <button className="quick-action-btn" onClick={() => navigate('/notes')}>
                                <span className="action-icon">📩</span>
                                <span className="action-label">Hộp thư</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/documents')}>
                                <span className="action-icon">📚</span>
                                <span className="action-label">Tài liệu</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/grades')}>
                                <span className="action-icon">📊</span>
                                <span className="action-label">Xem điểm</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/chat-ai')}>
                                <span className="action-icon">🤖</span>
                                <span className="action-label">Hỏi AI</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
