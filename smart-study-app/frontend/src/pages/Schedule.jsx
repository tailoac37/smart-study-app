import React, { useState, useEffect } from 'react';
import { scheduleAPI, enrollmentAPI } from '../services/api';
import './Schedule.css';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [enrolledSubjects, setEnrolledSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('ALL');
    const [view, setView] = useState('week'); // week or list

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const daysVN = {
        'MONDAY': 'Thứ 2',
        'TUESDAY': 'Thứ 3',
        'WEDNESDAY': 'Thứ 4',
        'THURSDAY': 'Thứ 5',
        'FRIDAY': 'Thứ 6',
        'SATURDAY': 'Thứ 7',
        'SUNDAY': 'Chủ nhật'
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [schedulesRes, subjectsRes] = await Promise.all([
                scheduleAPI.getMyTimetable(),
                enrollmentAPI.getMySubjects()
            ]);
            setSchedules(schedulesRes.data);
            setEnrolledSubjects(subjectsRes.data);
        } catch (error) {
            console.error('Error loading schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSchedulesByDay = (day) => {
        return schedules.filter(s => s.dayOfWeek === day);
    };

    const formatTime = (time) => {
        if (!time) return '';
        return time.substring(0, 5); // HH:mm
    };

    const getFilteredSchedules = () => {
        if (selectedDay === 'ALL') return schedules;
        return schedules.filter(s => s.dayOfWeek === selectedDay);
    };

    if (loading) {
        return (
            <div className="schedule-page">
                <div className="loading-spinner">Đang tải thời khóa biểu...</div>
            </div>
        );
    }

    return (
        <div className="schedule-page">
            <div className="schedule-header">
                <div>
                    <h1>📅 Thời Khóa Biểu</h1>
                    <p className="subtitle">Xem lịch học các môn đã đăng ký</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${view === 'week' ? 'active' : ''}`}
                            onClick={() => setView('week')}
                        >
                            📆 Tuần
                        </button>
                        <button
                            className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                        >
                            📋 Danh sách
                        </button>
                    </div>
                </div>
            </div>

            {enrolledSubjects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>Chưa đăng ký môn học nào</h3>
                    <p>Hãy đăng ký môn học để xem thời khóa biểu</p>
                    <a href="/subjects" className="btn btn-primary">Đăng ký môn học</a>
                </div>
            ) : schedules.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>Chưa có lịch học</h3>
                    <p>Giảng viên chưa tạo lịch học cho các môn bạn đã đăng ký</p>
                </div>
            ) : (
                <>
                    {view === 'week' ? (
                        <div className="calendar-view">
                            <div className="calendar-grid">
                                {daysOfWeek.map(day => (
                                    <div key={day} className="day-column">
                                        <div className="day-header">
                                            <span className="day-name">{daysVN[day]}</span>
                                            <span className="class-count">
                                                {getSchedulesByDay(day).length} tiết
                                            </span>
                                        </div>
                                        <div className="day-classes">
                                            {getSchedulesByDay(day).length === 0 ? (
                                                <div className="no-class">Không có lịch</div>
                                            ) : (
                                                getSchedulesByDay(day).map(schedule => (
                                                    <div
                                                        key={schedule.id}
                                                        className="class-card"
                                                        style={{ borderLeftColor: schedule.subjectColor }}
                                                    >
                                                        <div className="class-time">
                                                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                        </div>
                                                        <div className="class-subject">{schedule.subjectName}</div>
                                                        <div className="class-code">{schedule.subjectCode}</div>
                                                        <div className="class-room">
                                                            📍 {schedule.room} {schedule.building && `- ${schedule.building}`}
                                                        </div>
                                                        <div className="class-teacher">👨‍🏫 {schedule.teacherName}</div>
                                                        {schedule.type && (
                                                            <div className={`class-type ${schedule.type.toLowerCase()}`}>
                                                                {schedule.type === 'THEORY' ? 'Lý thuyết' :
                                                                    schedule.type === 'PRACTICE' ? 'Thực hành' :
                                                                        schedule.type === 'LAB' ? 'Thí nghiệm' : 'Seminar'}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="list-view">
                            <div className="filters">
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="ALL">Tất cả các ngày</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{daysVN[day]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="schedule-list">
                                {getFilteredSchedules().map(schedule => (
                                    <div
                                        key={schedule.id}
                                        className="schedule-item"
                                        style={{ borderLeftColor: schedule.subjectColor }}
                                    >
                                        <div className="schedule-day">{daysVN[schedule.dayOfWeek]}</div>
                                        <div className="schedule-info">
                                            <div className="schedule-main">
                                                <h3>{schedule.subjectName}</h3>
                                                <span className="schedule-code">{schedule.subjectCode}</span>
                                            </div>
                                            <div className="schedule-details">
                                                <span>🕒 {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                                                <span>📍 {schedule.room} {schedule.building && `- ${schedule.building}`}</span>
                                                <span>👨‍🏫 {schedule.teacherName}</span>
                                                {schedule.type && (
                                                    <span className={`type-badge ${schedule.type.toLowerCase()}`}>
                                                        {schedule.type === 'THEORY' ? 'Lý thuyết' :
                                                            schedule.type === 'PRACTICE' ? 'Thực hành' :
                                                                schedule.type === 'LAB' ? 'Thí nghiệm' : 'Seminar'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Subject Summary */}
            <div className="subjects-summary">
                <h3>Môn học đã đăng ký ({enrolledSubjects.length})</h3>
                <div className="subjects-grid">
                    {enrolledSubjects.map(subject => (
                        <div key={subject.id} className="subject-card" style={{ borderLeftColor: subject.color }}>
                            <div className="subject-name">{subject.name}</div>
                            <div className="subject-code">{subject.code}</div>
                            <div className="subject-info">
                                <span>{subject.credits} tín chỉ</span>
                                <span>👨‍🏫 {subject.teacherName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Schedule;
