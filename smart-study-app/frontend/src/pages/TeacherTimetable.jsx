import React, { useState, useEffect } from 'react';
import { scheduleAPI } from '../services/api';
import './TeacherTimetable.css';

const TeacherTimetable = ({ user }) => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const daysVN = {
        'MONDAY': 'Thứ 2', 'TUESDAY': 'Thứ 3', 'WEDNESDAY': 'Thứ 4',
        'THURSDAY': 'Thứ 5', 'FRIDAY': 'Thứ 6', 'SATURDAY': 'Thứ 7', 'SUNDAY': 'Chủ nhật'
    };

    useEffect(() => {
        loadTimetable();
    }, []);

    const loadTimetable = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await scheduleAPI.getMyTimetable();
            console.log('Teacher timetable data:', res.data);
            setTimetable(res.data || []);
        } catch (error) {
            console.error('Error loading timetable:', error);
            setError(error.message || 'Lỗi tải lịch giảng dạy');
        } finally {
            setLoading(false);
        }
    };

    // Group schedules by day
    const groupedByDay = {};
    Object.keys(daysVN).forEach(day => {
        groupedByDay[day] = timetable.filter(s => s.dayOfWeek === day);
    });

    if (loading) return <div className="loading-spinner">Đang tải...</div>;
    if (error) return <div className="error-message">Lỗi: {error}</div>;

    return (
        <div className="teacher-timetable-page">
            <div className="page-header">
                <div>
                    <h1>📅 Thời Khóa Biểu</h1>
                    <p className="subtitle">Lịch giảng dạy của bạn trong tuần</p>
                </div>
            </div>

            {timetable.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📆</div>
                    <h3>Chưa có lịch giảng dạy</h3>
                    <p>Hãy tạo môn học và thêm lịch giảng dạy</p>
                </div>
            ) : (
                <div className="timetable-container">
                    {Object.entries(groupedByDay).map(([day, schedules]) => (
                        <div key={day} className="timetable-day">
                            <div className="day-header">
                                <h3>{daysVN[day]}</h3>
                                <span className="schedule-count">{schedules.length} lịch</span>
                            </div>
                            <div className="day-schedules">
                                {schedules.length === 0 ? (
                                    <div className="no-schedule">Không có lịch</div>
                                ) : (
                                    schedules.map(schedule => (
                                        <div key={schedule.id} className="schedule-item" style={{ borderLeftColor: schedule.subjectColor }}>
                                            <div className="schedule-left">
                                                <div className="time-start">{schedule.startTime?.substring(0, 5)}</div>
                                                <div className="time-separator">-</div>
                                                <div className="time-end">{schedule.endTime?.substring(0, 5)}</div>
                                            </div>
                                            <div className="schedule-right">
                                                <div className="schedule-subject" style={{ color: schedule.subjectColor }}>
                                                    {schedule.subjectName}
                                                </div>
                                                <div className="schedule-badges">
                                                    <span className="schedule-code">{schedule.subjectCode}</span>
                                                    <span className={`schedule-type type-${schedule.type?.toLowerCase()}`}>
                                                        {schedule.type === 'THEORY' ? 'Lý thuyết' :
                                                            schedule.type === 'PRACTICE' ? 'Thực hành' :
                                                                schedule.type === 'LAB' ? 'Thí nghiệm' : 'Seminar'}
                                                    </span>
                                                </div>
                                                <div className="schedule-room">
                                                    <span className="room-icon">📍</span>
                                                    {schedule.room || schedule.building || 'Chưa có phòng'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherTimetable;
