import React, { useState, useEffect } from 'react';
import { subjectAPI, scheduleAPI } from '../services/api';
import './TeacherSubjects.css';

const TeacherSubjects = ({ user }) => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [schedules, setSchedules] = useState([]);

    // Form states
    const [subjectForm, setSubjectForm] = useState({
        name: '', code: '', credits: 3, room: '', semester: '', description: '', color: '#2563eb', targetYear: 1,
        registrationStartDate: '', registrationEndDate: ''
    });
    const [scheduleForm, setScheduleForm] = useState({
        dayOfWeek: 'MONDAY', startTime: '', endTime: '', room: '', type: 'THEORY'
    });

    const daysVN = {
        'MONDAY': 'Thứ 2', 'TUESDAY': 'Thứ 3', 'WEDNESDAY': 'Thứ 4',
        'THURSDAY': 'Thứ 5', 'FRIDAY': 'Thứ 6', 'SATURDAY': 'Thứ 7', 'SUNDAY': 'Chủ nhật'
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const res = await subjectAPI.getAll();
            setSubjects(res.data);
        } catch (error) {
            console.error('Error loading subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Subject Management ---
    const handleCreateSubject = () => {
        setEditingSubject(null);
        setSubjectForm({
            name: '', code: '', credits: 3, room: '', semester: '', description: '', color: '#2563eb', targetYear: 1,
            registrationStartDate: '', registrationEndDate: ''
        });
        setShowSubjectModal(true);
    };

    const handleEditSubject = (subject) => {
        setEditingSubject(subject);
        setSubjectForm({
            name: subject.name,
            code: subject.code,
            credits: subject.credits,
            room: subject.room || '',
            semester: subject.semester || '',
            description: subject.description || '',
            color: subject.color || '#2563eb',
            targetYear: subject.targetYear || 1,
            registrationStartDate: subject.registrationStartDate ? subject.registrationStartDate.substring(0, 16) : '',
            registrationEndDate: subject.registrationEndDate ? subject.registrationEndDate.substring(0, 16) : ''
        });
        setShowSubjectModal(true);
    };

    const handleDeleteSubject = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa môn học này? Tất cả lịch học và đăng ký sẽ bị xóa.')) return;
        try {
            await subjectAPI.delete(id);
            loadSubjects();
        } catch (error) {
            alert('Xóa thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    const submitSubjectForm = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...subjectForm,
                credits: parseInt(subjectForm.credits) || 3,
                targetYear: parseInt(subjectForm.targetYear) || 1,
                registrationStartDate: subjectForm.registrationStartDate || null,
                registrationEndDate: subjectForm.registrationEndDate || null
            };

            if (editingSubject) {
                await subjectAPI.update(editingSubject.id, dataToSend);
            } else {
                await subjectAPI.create(dataToSend);
            }
            setShowSubjectModal(false);
            loadSubjects();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    // --- Schedule Management ---
    const handleManageSchedule = async (subject) => {
        setSelectedSubject(subject);
        setShowScheduleModal(true);
        loadSchedules(subject.id);
    };

    const loadSchedules = async (subjectId) => {
        try {
            const res = await scheduleAPI.getBySubject(subjectId);
            setSchedules(res.data);
        } catch (error) {
            console.error('Error loading schedules:', error);
        }
    };

    const handleAddSchedule = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...scheduleForm,
                subjectId: selectedSubject.id,
                // Add seconds to time if needed, backend expects LocalTime "HH:mm:ss" usually, but "HH:mm" might work if configured
                startTime: scheduleForm.startTime + ':00',
                endTime: scheduleForm.endTime + ':00'
            };
            await scheduleAPI.create(data);
            loadSchedules(selectedSubject.id);
            // Reset form but keep some fields
            setScheduleForm(prev => ({ ...prev, startTime: '', endTime: '' }));
        } catch (error) {
            alert('Lỗi thêm lịch: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteSchedule = async (id) => {
        if (!confirm('Xóa lịch học này?')) return;
        try {
            await scheduleAPI.delete(id);
            loadSchedules(selectedSubject.id);
        } catch (error) {
            alert('Lỗi xóa lịch: ' + error.message);
        }
    };

    if (loading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="teacher-subjects-page">
            <div className="page-header">
                <div>
                    <h1><span className="page-icon">👨‍🏫</span> Quản lý Môn Học</h1>
                    <p className="subtitle">Tạo môn học và sắp xếp lịch giảng dạy</p>
                </div>
                <button className="btn btn-primary" onClick={handleCreateSubject}>
                    + Tạo Môn Học Mới
                </button>
            </div>

            <div className="subjects-grid">
                {subjects.map(subject => (
                    <div key={subject.id} className="subject-card" style={{ borderLeftColor: subject.color }}>
                        <div className="subject-header">
                            <div>
                                <h3>{subject.name}</h3>
                                <span className="subject-code">{subject.code}</span>
                            </div>
                            {/* Registration Status Badge */}
                            <div className={`registration-badge ${subject.registrationStatus?.toLowerCase() || 'open'}`}>
                                {subject.registrationStatus === 'OPEN' && '🟢 Đang mở đăng ký'}
                                {subject.registrationStatus === 'NOT_STARTED' && '🟡 Chưa mở đăng ký'}
                                {subject.registrationStatus === 'CLOSED' && '🔴 Đã đóng đăng ký'}
                                {!subject.registrationStatus && '🟢 Đang mở đăng ký'}
                            </div>
                        </div>
                        <div className="subject-info">
                            <div className="info-row">📊 {subject.credits} tín chỉ</div>
                            <div className="info-row">📅 {subject.semester}</div>
                            <div className="info-row">📍 {subject.room}</div>
                            <div className="info-row">🎓 Năm: {subject.targetYear}</div>
                            {(subject.registrationStartDate || subject.registrationEndDate) && (
                                <div className="info-row registration-period">
                                    📝 Thời gian ĐK:
                                    {subject.registrationStartDate && (
                                        <span> từ {new Date(subject.registrationStartDate).toLocaleDateString('vi-VN')} </span>
                                    )}
                                    {subject.registrationEndDate && (
                                        <span> đến {new Date(subject.registrationEndDate).toLocaleDateString('vi-VN')}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="subject-actions">
                            <button className="btn btn-outline" onClick={() => handleManageSchedule(subject)}>
                                📅 Lịch học
                            </button>
                            <button className="btn btn-secondary" onClick={() => handleEditSubject(subject)}>
                                ✏️ Sửa
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDeleteSubject(subject.id)}>
                                🗑️ Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Subject Modal */}
            {showSubjectModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingSubject ? 'Sửa Môn Học' : 'Tạo Môn Học Mới'}</h2>
                            <button className="close-btn" onClick={() => setShowSubjectModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={submitSubjectForm}>
                            <div className="form-group">
                                <label>Tên môn học</label>
                                <input className="form-control" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Mã môn học</label>
                                <input className="form-control" value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Số tín chỉ</label>
                                    <input type="number" min="1" step="1" className="form-control" value={subjectForm.credits} onChange={e => setSubjectForm({ ...subjectForm, credits: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Màu sắc</label>
                                    <input type="color" className="form-control" value={subjectForm.color} onChange={e => setSubjectForm({ ...subjectForm, color: e.target.value })} style={{ height: '45px' }} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Dành cho năm</label>
                                    <select className="form-control" value={subjectForm.targetYear} onChange={e => setSubjectForm({ ...subjectForm, targetYear: e.target.value })}>
                                        <option value="1">Năm 1</option>
                                        <option value="2">Năm 2</option>
                                        <option value="3">Năm 3</option>
                                        <option value="4">Năm 4</option>
                                        <option value="5">Năm 5</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phòng học mặc định</label>
                                <input className="form-control" value={subjectForm.room} onChange={e => setSubjectForm({ ...subjectForm, room: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Học kỳ</label>
                                <input className="form-control" value={subjectForm.semester} onChange={e => setSubjectForm({ ...subjectForm, semester: e.target.value })} placeholder="VD: HK1 2024-2025" />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea className="form-control" value={subjectForm.description} onChange={e => setSubjectForm({ ...subjectForm, description: e.target.value })} rows="3" />
                            </div>

                            {/* Registration Period */}
                            <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#0369a1', fontSize: '0.95rem' }}>⏰ Thời gian đăng ký môn học</h4>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 10px 0' }}>Sinh viên chỉ có thể đăng ký môn học trong khoảng thời gian này. Nếu không đặt, môn học sẽ luôn mở đăng ký.</p>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                        <label>Bắt đầu đăng ký</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={subjectForm.registrationStartDate}
                                            onChange={e => setSubjectForm({ ...subjectForm, registrationStartDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                        <label>Kết thúc đăng ký</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={subjectForm.registrationEndDate}
                                            onChange={e => setSubjectForm({ ...subjectForm, registrationEndDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSubjectModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }

            {/* Schedule Manager Modal */}
            {
                showScheduleModal && selectedSubject && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '800px' }}>
                            <div className="modal-header">
                                <h2>Quản lý Lịch học - {selectedSubject.name}</h2>
                                <button className="close-btn" onClick={() => setShowScheduleModal(false)}>&times;</button>
                            </div>

                            {/* Add Schedule Form */}
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                <h4>Thêm lịch học mới</h4>
                                <form onSubmit={handleAddSchedule} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '120px' }}>
                                        <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Thứ</label>
                                        <select className="form-control" value={scheduleForm.dayOfWeek} onChange={e => setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })}>
                                            {Object.entries(daysVN).map(([key, val]) => (
                                                <option key={key} value={key}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Bắt đầu</label>
                                        <input type="time" className="form-control" value={scheduleForm.startTime} onChange={e => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} required />
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Kết thúc</label>
                                        <input type="time" className="form-control" value={scheduleForm.endTime} onChange={e => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} required />
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Phòng</label>
                                        <input className="form-control" value={scheduleForm.room} onChange={e => setScheduleForm({ ...scheduleForm, room: e.target.value })} placeholder={selectedSubject.room} />
                                    </div>
                                    <div style={{ width: '120px' }}>
                                        <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Loại</label>
                                        <select className="form-control" value={scheduleForm.type} onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })}>
                                            <option value="THEORY">Lý thuyết</option>
                                            <option value="PRACTICE">Thực hành</option>
                                            <option value="LAB">Thí nghiệm</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>+ Thêm</button>
                                </form>
                            </div>

                            {/* Schedule List */}
                            <div className="schedule-list">
                                {schedules.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#666' }}>Chưa có lịch học nào.</p>
                                ) : (
                                    schedules.map(sch => (
                                        <div key={sch.id} className="schedule-item">
                                            <div className="schedule-info">
                                                <span className="schedule-day">{daysVN[sch.dayOfWeek]}</span>
                                                <span>⏰ {sch.startTime.substring(0, 5)} - {sch.endTime.substring(0, 5)}</span>
                                                <span>📍 {sch.room || selectedSubject.room}</span>
                                                <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: '#e2e8f0', borderRadius: '10px' }}>
                                                    {sch.type === 'THEORY' ? 'Lý thuyết' : 'Thực hành'}
                                                </span>
                                            </div>
                                            <button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDeleteSchedule(sch.id)}>🗑️</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TeacherSubjects;
