import React, { useState, useEffect } from 'react';
import { assignmentAPI, subjectAPI } from '../services/api';
import './Assignments.css';

const Assignments = ({ user }) => {
    const [assignments, setAssignments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        subject: '',
        status: '',
        search: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [submissionNotes, setSubmissionNotes] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [assignmentsRes, subjectsRes] = await Promise.all([
                assignmentAPI.getAll(),
                subjectAPI.getAll()
            ]);
            setAssignments(assignmentsRes.data || []);
            setSubjects(subjectsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate days until deadline
    const getDaysUntilDeadline = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get deadline status color
    const getDeadlineColor = (deadline, status) => {
        if (status === 'COMPLETED') return 'success';
        const days = getDaysUntilDeadline(deadline);
        if (days < 0) return 'danger';
        if (days === 0) return 'danger';
        if (days <= 3) return 'warning';
        return 'info';
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'TODO': { label: 'Chưa làm', color: 'secondary' },
            'IN_PROGRESS': { label: 'Đang làm', color: 'primary' },
            'COMPLETED': { label: 'Đã nộp', color: 'success' },
            'OVERDUE': { label: 'Quá hạn', color: 'danger' }
        };
        return statusMap[status] || statusMap['TODO'];
    };

    // Filter assignments
    const filteredAssignments = assignments.filter(assignment => {
        // Use loose equality (==) to handle string/number comparison
        // Check both subjectId (flat) and subject.id (nested) to be safe
        const assignmentSubjectId = assignment.subjectId || assignment.subject?.id;
        const matchSubject = !filter.subject || assignmentSubjectId == filter.subject;

        const matchStatus = !filter.status || assignment.status === filter.status;
        const matchSearch = !filter.search ||
            assignment.title?.toLowerCase().includes(filter.search.toLowerCase()) ||
            assignment.description?.toLowerCase().includes(filter.search.toLowerCase());
        return matchSubject && matchStatus && matchSearch;
    });

    // Group by subject
    const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
        const subjectName = assignment.subjectName || 'Không có môn';
        if (!acc[subjectName]) acc[subjectName] = [];
        acc[subjectName].push(assignment);
        return acc;
    }, {});

    // Handle file upload
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) {
            alert('Vui lòng chọn file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('notes', submissionNotes);

        try {
            await assignmentAPI.submit(selectedAssignment.id, formData);
            alert('Nộp bài thành công!');
            setShowModal(false);
            setUploadFile(null);
            setSubmissionNotes('');
            fetchData();
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.message || 'Lỗi khi nộp bài!');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="assignments-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>📝 Quản Lý Bài Tập</h1>
                    <p>Theo dõi và quản lý tất cả bài tập của bạn</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-card">
                <div className="filters-grid">
                    <div className="filter-item">
                        <label>🔍 Tìm kiếm</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Tìm theo tên bài tập..."
                            value={filter.search}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                    </div>
                    <div className="filter-item">
                        <label>📚 Môn học</label>
                        <select
                            className="select"
                            value={filter.subject}
                            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                        >
                            <option value="">Tất cả môn</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>📊 Trạng thái</label>
                        <select
                            className="select"
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        >
                            <option value="">Tất cả</option>
                            <option value="TODO">Chưa làm</option>
                            <option value="IN_PROGRESS">Đang làm</option>
                            <option value="COMPLETED">Đã nộp</option>
                            <option value="OVERDUE">Quá hạn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>{assignments.length}</h3>
                        <p>Tổng bài tập</p>
                    </div>
                </div>
                <div className="stat-card stat-pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{assignments.filter(a => a.status === 'TODO' || a.status === 'IN_PROGRESS').length}</h3>
                        <p>Chưa hoàn thành</p>
                    </div>
                </div>
                <div className="stat-card stat-completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>{assignments.filter(a => a.status === 'COMPLETED').length}</h3>
                        <p>Đã nộp</p>
                    </div>
                </div>
                <div className="stat-card stat-overdue">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-info">
                        <h3>{assignments.filter(a => getDaysUntilDeadline(a.deadline) < 0 && a.status !== 'COMPLETED').length}</h3>
                        <p>Quá hạn</p>
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            <div className="assignments-container">
                {Object.keys(groupedAssignments).length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <h3>Không có bài tập nào</h3>
                        <p>Chưa có bài tập nào phù hợp với bộ lọc của bạn</p>
                    </div>
                ) : (
                    Object.entries(groupedAssignments).map(([subjectName, subjectAssignments]) => (
                        <div key={subjectName} className="subject-group">
                            <div className="subject-header">
                                <h2>{subjectName}</h2>
                                <span className="assignment-count">{subjectAssignments.length} bài tập</span>
                            </div>
                            <div className="assignments-grid">
                                {subjectAssignments.map(assignment => {
                                    const daysLeft = getDaysUntilDeadline(assignment.deadline);
                                    const deadlineColor = getDeadlineColor(assignment.deadline, assignment.status);
                                    const statusInfo = getStatusBadge(assignment.status);

                                    return (
                                        <div key={assignment.id} className={`assignment-card ${deadlineColor}`}>
                                            <div className="assignment-header">
                                                <h3>{assignment.title}</h3>
                                                <span className={`badge badge-${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>

                                            <p className="assignment-description">
                                                {assignment.description || 'Không có mô tả'}
                                            </p>

                                            <div className="assignment-meta">
                                                <div className="meta-item">
                                                    <span className="meta-icon">📅</span>
                                                    <span>
                                                        Hạn nộp: {new Date(assignment.deadline).toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon">⏰</span>
                                                    <span className={`deadline-${deadlineColor}`}>
                                                        {daysLeft >= 0 ? (
                                                            daysLeft === 0 ? (
                                                                <strong>Hôm nay!</strong>
                                                            ) : (
                                                                `Còn ${daysLeft} ngày`
                                                            )
                                                        ) : (
                                                            <strong>Quá hạn {Math.abs(daysLeft)} ngày</strong>
                                                        )}
                                                    </span>
                                                </div>
                                                {assignment.type && (
                                                    <div className="meta-item">
                                                        <span className="meta-icon">📝</span>
                                                        <span>{assignment.type}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {assignment.notes && (
                                                <div className="assignment-notes">
                                                    <strong>Ghi chú:</strong> {assignment.notes}
                                                </div>
                                            )}

                                            <div className="assignment-actions">
                                                {assignment.attachmentUrl && (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => window.open(`http://localhost:8080${assignment.attachmentUrl}`, '_blank')}
                                                    >
                                                        📥 Tải đề bài
                                                    </button>
                                                )}
                                                {assignment.status !== 'COMPLETED' && (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => {
                                                            setSelectedAssignment(assignment);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        📤 Nộp bài
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => {
                                                        setSelectedAssignment(assignment);
                                                        setShowModal(false); // Ensure upload modal is closed
                                                    }}
                                                >
                                                    👁️ Chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showModal && selectedAssignment && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📤 Nộp Bài Tập</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="assignment-info-box">
                                <h3>{selectedAssignment.title}</h3>
                                <p>{selectedAssignment.subjectName}</p>
                                <p className="deadline-info">
                                    Hạn nộp: {new Date(selectedAssignment.deadline).toLocaleString('vi-VN')}
                                </p>
                            </div>

                            <form onSubmit={handleFileUpload}>
                                <div className="form-group">
                                    <label className="file-upload-label">
                                        <input
                                            type="file"
                                            onChange={(e) => setUploadFile(e.target.files[0])}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        <div className="file-upload-box">
                                            <span className="upload-icon">📁</span>
                                            <span className="upload-text">
                                                {uploadFile ? uploadFile.name : 'Chọn file (PDF, Word, JPG, PNG)'}
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label>Ghi chú (tùy chọn)</label>
                                    <textarea
                                        className="textarea"
                                        rows="4"
                                        placeholder="Thêm ghi chú về bài làm của bạn..."
                                        value={submissionNotes}
                                        onChange={(e) => setSubmissionNotes(e.target.value)}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        📤 Nộp bài
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedAssignment && !showModal && (
                <div className="modal-overlay" onClick={() => setSelectedAssignment(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📖 Chi Tiết Bài Tập</h2>
                            <button className="modal-close" onClick={() => setSelectedAssignment(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <h3>{selectedAssignment.title}</h3>
                            <p><strong>Môn học:</strong> {selectedAssignment.subjectName}</p>
                            <p><strong>Hạn nộp:</strong> {new Date(selectedAssignment.deadline).toLocaleString('vi-VN')}</p>
                            <p><strong>Mô tả:</strong></p>
                            <p className="assignment-description-full">{selectedAssignment.description}</p>
                            {selectedAssignment.notes && (
                                <p><strong>Ghi chú giáo viên:</strong> {selectedAssignment.notes}</p>
                            )}

                            {/* Teacher Info */}
                            {selectedAssignment.userName && (
                                <p><strong>Giảng viên:</strong> {selectedAssignment.userName}</p>
                            )}

                            {/* Score & Feedback Section */}
                            {selectedAssignment.latestSubmission && selectedAssignment.latestSubmission.score !== null && (
                                <div className="feedback-section" style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    backgroundColor: '#f0f9ff',
                                    border: '1px solid #bae6fd',
                                    borderRadius: '8px'
                                }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#0284c7' }}>🎉 Kết quả đánh giá</h4>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        Điểm số: <span style={{ color: '#0369a1' }}>{selectedAssignment.latestSubmission.score}/10</span>
                                    </p>
                                    <p><strong>Nhận xét:</strong> {selectedAssignment.latestSubmission.feedback || 'Không có nhận xét'}</p>
                                    <p><strong>Người chấm:</strong> {selectedAssignment.latestSubmission.gradedBy || 'Giảng viên'}</p>
                                </div>
                            )}

                            {selectedAssignment.attachmentUrl && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.open(`http://localhost:8080${selectedAssignment.attachmentUrl}`, '_blank')}
                                    style={{ marginTop: '1rem' }}
                                >
                                    📥 Tải đề bài
                                </button>
                            )}
                        </div>
                        <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedAssignment(null)}>Đóng Detail</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;
