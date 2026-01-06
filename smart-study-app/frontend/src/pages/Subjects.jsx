import React, { useState, useEffect } from 'react';
import { enrollmentAPI } from '../services/api';
import './Subjects.css';

const Subjects = () => {
    const [mySubjects, setMySubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('enrolled'); // enrolled or available

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const [enrolled, available] = await Promise.all([
                enrollmentAPI.getMySubjects(),
                enrollmentAPI.getAvailableSubjects()
            ]);
            setMySubjects(enrolled.data);
            setAvailableSubjects(available.data);
        } catch (error) {
            console.error('Error loading subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (subjectId) => {
        try {
            await enrollmentAPI.enroll(subjectId);
            await loadSubjects();
            alert('Đăng ký môn học thành công!');
        } catch (error) {
            console.error('Error enrolling:', error);
            alert(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    const handleDrop = async (subjectId) => {
        if (!confirm('Bạn có chắc muốn hủy môn học này?')) return;

        try {
            await enrollmentAPI.drop(subjectId);
            await loadSubjects();
            alert('Đã hủy môn học');
        } catch (error) {
            console.error('Error dropping:', error);
            alert('Hủy môn thất bại. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <div className="subjects-page">
                <div className="loading-spinner">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="subjects-page">
            <div className="subjects-header">
                <div>
                    <h1>📚 Quản lý Môn Học</h1>
                    <p className="subtitle">Đăng ký và quản lý các môn học của bạn</p>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'enrolled' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enrolled')}
                >
                    Môn đã đăng ký ({mySubjects.length})
                </button>
                <button
                    className={`tab ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    Môn có thể đăng ký ({availableSubjects.length})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'enrolled' ? (
                    mySubjects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📖</div>
                            <h3>Chưa đăng ký môn học nào</h3>
                            <p>Hãy chuyển sang tab "Môn có thể đăng ký" để đăng ký môn học</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setActiveTab('available')}
                            >
                                Xem môn có thể đăng ký
                            </button>
                        </div>
                    ) : (
                        <div className="subjects-grid">
                            {mySubjects.map(subject => (
                                <div key={subject.id} className="subject-card enrolled" style={{ borderLeftColor: subject.color }}>
                                    <div className="subject-header">
                                        <div>
                                            <h3>{subject.name}</h3>
                                            <span className="subject-code">{subject.code}</span>
                                        </div>
                                        <div className="subject-status enrolled">
                                            ✓ Đã đăng ký
                                        </div>
                                    </div>

                                    <div className="subject-info">
                                        <div className="info-row">
                                            <span className="icon">👨‍🏫</span>
                                            <span>{subject.teacherName}</span>
                                        </div>
                                        {subject.teacherEmail && (
                                            <div className="info-row">
                                                <span className="icon">📧</span>
                                                <span>{subject.teacherEmail}</span>
                                            </div>
                                        )}
                                        <div className="info-row">
                                            <span className="icon">📊</span>
                                            <span>{subject.credits} tín chỉ</span>
                                        </div>
                                        {subject.room && (
                                            <div className="info-row">
                                                <span className="icon">📍</span>
                                                <span>Phòng {subject.room}</span>
                                            </div>
                                        )}
                                        {subject.semester && (
                                            <div className="info-row">
                                                <span className="icon">📅</span>
                                                <span>{subject.semester}</span>
                                            </div>
                                        )}
                                    </div>

                                    {subject.description && (
                                        <div className="subject-description">
                                            {subject.description}
                                        </div>
                                    )}

                                    <div className="subject-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDrop(subject.id)}
                                        >
                                            Hủy môn
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    availableSubjects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎓</div>
                            <h3>Không còn môn nào để đăng ký</h3>
                            <p>Bạn đã đăng ký tất cả các môn học có sẵn</p>
                        </div>
                    ) : (
                        <div className="subjects-grid">
                            {availableSubjects.map(subject => (
                                <div key={subject.id} className={`subject-card available ${!subject.registrationOpen ? 'registration-closed' : ''}`} style={{ borderLeftColor: subject.color }}>
                                    <div className="subject-header">
                                        <div>
                                            <h3>{subject.name}</h3>
                                            <span className="subject-code">{subject.code}</span>
                                        </div>
                                        {/* Registration Status Badge */}
                                        <div className={`registration-badge ${subject.registrationStatus?.toLowerCase() || 'open'}`}>
                                            {subject.registrationStatus === 'OPEN' && '🟢 Đang mở'}
                                            {subject.registrationStatus === 'NOT_STARTED' && '🟡 Chưa mở'}
                                            {subject.registrationStatus === 'CLOSED' && '🔴 Đã đóng'}
                                            {!subject.registrationStatus && '🟢 Đang mở'}
                                        </div>
                                    </div>

                                    <div className="subject-info">
                                        <div className="info-row">
                                            <span className="icon">👨‍🏫</span>
                                            <span>{subject.teacherName}</span>
                                        </div>
                                        {subject.teacherEmail && (
                                            <div className="info-row">
                                                <span className="icon">📧</span>
                                                <span>{subject.teacherEmail}</span>
                                            </div>
                                        )}
                                        <div className="info-row">
                                            <span className="icon">📊</span>
                                            <span>{subject.credits} tín chỉ</span>
                                        </div>
                                        {subject.room && (
                                            <div className="info-row">
                                                <span className="icon">📍</span>
                                                <span>Phòng {subject.room}</span>
                                            </div>
                                        )}
                                        {subject.semester && (
                                            <div className="info-row">
                                                <span className="icon">📅</span>
                                                <span>{subject.semester}</span>
                                            </div>
                                        )}
                                        {/* Registration Period Info */}
                                        {(subject.registrationStartDate || subject.registrationEndDate) && (
                                            <div className="info-row registration-period-info">
                                                <span className="icon">⏰</span>
                                                <span>
                                                    Đăng ký:
                                                    {subject.registrationStartDate && (
                                                        <> từ {new Date(subject.registrationStartDate).toLocaleDateString('vi-VN')}</>
                                                    )}
                                                    {subject.registrationEndDate && (
                                                        <> đến {new Date(subject.registrationEndDate).toLocaleDateString('vi-VN')}</>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {subject.description && (
                                        <div className="subject-description">
                                            {subject.description}
                                        </div>
                                    )}

                                    <div className="subject-actions">
                                        {subject.registrationOpen !== false ? (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleEnroll(subject.id)}
                                            >
                                                Đăng ký môn này
                                            </button>
                                        ) : (
                                            <div className="registration-status-message">
                                                {subject.registrationStatus === 'NOT_STARTED' && (
                                                    <span className="status-not-started">
                                                        ⏳ Chưa đến thời gian đăng ký
                                                        {subject.registrationStartDate && (
                                                            <small>Mở từ: {new Date(subject.registrationStartDate).toLocaleString('vi-VN')}</small>
                                                        )}
                                                    </span>
                                                )}
                                                {subject.registrationStatus === 'CLOSED' && (
                                                    <span className="status-closed">
                                                        🚫 Đã hết thời gian đăng ký
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Subjects;
