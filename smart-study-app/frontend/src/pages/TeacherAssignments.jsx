import React, { useState, useEffect, useRef } from 'react';
import { assignmentAPI, subjectAPI, enrollmentAPI } from '../services/api';
import './TeacherAssignments.css';

const TeacherAssignments = ({ user }) => {
    const [assignments, setAssignments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [missingStudents, setMissingStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('submitted');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        type: 'HOMEWORK',
        priority: 'MEDIUM',
        subjectId: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (!user) return;
            // Get teacher's subjects
            const subjectsRes = await subjectAPI.getAll();
            setSubjects(subjectsRes.data || []);

            // Get all assignments created by teacher
            const assignmentsRes = await assignmentAPI.getAll();
            setAssignments(assignmentsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append('assignment', JSON.stringify({
                ...formData,
                createdBy: user.id
            }));

            if (fileInputRef.current && fileInputRef.current.files[0]) {
                payload.append('file', fileInputRef.current.files[0]);
            }

            await assignmentAPI.create(payload);

            alert('Tạo bài tập thành công!');
            setShowCreateModal(false);
            setFormData({
                title: '',
                description: '',
                deadline: '',
                type: 'HOMEWORK',
                priority: 'MEDIUM',
                subjectId: ''
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchData();
        } catch (error) {
            console.error('Create error:', error);
            const msg = error.response?.data?.message || error.message || 'Lỗi khi tạo bài tập!';
            alert('Lỗi: ' + msg);
        }
    };

    const viewSubmissions = async (assignment) => {
        setSelectedAssignment(assignment);
        setActiveTab('submitted');
        try {
            // Parallel fetch: submissions and enrolled students
            const [submissionsRes, studentsRes] = await Promise.all([
                assignmentAPI.getAllSubmissions(assignment.id),
                enrollmentAPI.getSubjectStudents(assignment.subjectId)
            ]);

            const currentSubmissions = submissionsRes.data || [];
            const allStudents = studentsRes.data || [];

            // Identify students who haven't submitted
            // Note: submissions have 'userId', students (enrollments) have 'studentId'
            const submittedUserIds = new Set(currentSubmissions.map(s => s.userId));

            // Filter out enrollments where the student has already submitted
            const missing = allStudents.filter(enrollment => !submittedUserIds.has(enrollment.studentId));

            setSubmissions(currentSubmissions);
            setMissingStudents(missing);
            setShowSubmissionsModal(true);
        } catch (error) {
            console.error('Error fetching submissions or students:', error);
            alert('Lỗi khi tải danh sách bài nộp và sinh viên!');
        }
    };

    // Grading Logic
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });

    const handleOpenGrade = (submission) => {
        setGradingSubmission(submission);
        setGradeForm({
            score: submission.score !== null ? submission.score : '',
            feedback: submission.feedback || ''
        });
        setShowGradeModal(true);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignmentAPI.gradeSubmission(gradingSubmission.id, gradeForm);
            alert('Đã chấm điểm thành công!');

            // Close modal and refresh submissions
            setShowGradeModal(false);
            // Refresh logic: call viewSubmissions to reload both lists
            viewSubmissions(selectedAssignment);
        } catch (error) {
            console.error('Grade error:', error);
            const msg = error.response?.data?.message || error.message || 'Lỗi khi chấm điểm!';
            alert('Lỗi: ' + msg);
        }
    };

    const filteredAssignments = selectedSubject
        ? assignments.filter(a => a.subjectId === parseInt(selectedSubject))
        : assignments;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="teacher-assignments-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>📚 Quản Lý Bài Tập</h1>
                    <p>Tạo và quản lý bài tập cho các lớp của bạn</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    ➕ Tạo bài tập mới
                </button>
            </div>

            {/* Filter */}
            <div className="filter-section">
                <label>📖 Lọc theo môn học:</label>
                <select
                    className="select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="">Tất cả môn học</option>
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                        </option>
                    ))}
                </select>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>{assignments.length}</h3>
                        <p>Tổng bài tập</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <h3>{subjects.length}</h3>
                        <p>Môn học</p>
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            <div className="assignments-list-container">
                {filteredAssignments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>Chưa có bài tập nào</h3>
                        <p>Hãy chọn "Tạo bài tập mới" để bắt đầu</p>
                    </div>
                ) : (
                    <div className="assignments-list">
                        {filteredAssignments.map(assignment => (
                            <div key={assignment.id} className="assignment-card">
                                {/* Left: Main Info */}
                                <div className="card-main">
                                    <div className="card-header">
                                        <h4>{assignment.title}</h4>
                                        <div className="badges-row">
                                            <span className="badge-subject">{assignment.subjectName}</span>
                                            <span className={`badge-type type-${assignment.type?.toLowerCase()}`}>
                                                {assignment.type}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="description">
                                        {assignment.description ? (
                                            assignment.description.length > 100
                                                ? assignment.description.substring(0, 100) + '...'
                                                : assignment.description
                                        ) : 'Không có mô tả'}
                                    </p>
                                    {assignment.attachmentUrl && (
                                        <a href={`http://localhost:8080${assignment.attachmentUrl}`} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                            📎 Tài liệu đính kèm
                                        </a>
                                    )}
                                </div>

                                {/* Middle: Meta Info */}
                                <div className="card-meta">
                                    <div className="meta-item">
                                        <span className="label">Ngày tạo:</span>
                                        <span className="value">{new Date(assignment.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="label">Hạn nộp:</span>
                                        <span className={`value deadline ${new Date() > new Date(assignment.deadline) ? 'overdue' : ''}`}>
                                            {new Date(assignment.deadline).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Stats & Actions */}
                                <div className="card-actions-section">
                                    <div className="submission-stat">
                                        <div className="stat-number">{assignment.submissionCount || 0}</div>
                                        <div className="stat-label">bài nộp</div>
                                    </div>
                                    <div className="action-buttons-col">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => viewSubmissions(assignment)}
                                        >
                                            👁️ Xem bài nộp
                                        </button>
                                        <button className="btn btn-outline">
                                            ✏️ Sửa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>➕ Tạo Bài Tập Mới</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleCreateAssignment} className="modal-body">
                            <div className="form-group">
                                <label>Môn học *</label>
                                <select
                                    className="select"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                    required
                                >
                                    <option value="">Chọn môn học</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name} ({subject.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Tên bài tập *</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="VD: Bài tập tuần 1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    className="textarea"
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả chi tiết về bài tập..."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Loại bài tập</label>
                                    <select
                                        className="select"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="HOMEWORK">Bài tập về nhà</option>
                                        <option value="PROJECT">Đồ án</option>
                                        <option value="EXAM">Bài kiểm tra</option>
                                        <option value="PRESENTATION">Thuyết trình</option>
                                        <option value="REPORT">Báo cáo</option>
                                        <option value="LAB">Thực hành</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Độ ưu tiên</label>
                                    <select
                                        className="select"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="LOW">Thấp</option>
                                        <option value="MEDIUM">Trung bình</option>
                                        <option value="HIGH">Cao</option>
                                        <option value="URGENT">Khẩn cấp</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Hạn nộp *</label>
                                <input
                                    type="datetime-local"
                                    className="input"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Đính kèm tài liệu (nếu có)</label>
                                <input
                                    type="file"
                                    className="input"
                                    ref={fileInputRef}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    ➕ Tạo bài tập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submissions Modal */}
            {showSubmissionsModal && selectedAssignment && (
                <div className="modal-overlay" onClick={() => setShowSubmissionsModal(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📝 Tình hình nộp bài: {selectedAssignment.title}</h2>
                            <button className="modal-close" onClick={() => setShowSubmissionsModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            {/* Tabs for Submitted / Not Submitted */}
                            <div className="submission-tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('submitted')}
                                >
                                    Đã nộp ({submissions.length})
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'missing' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('missing')}
                                >
                                    Chưa nộp ({missingStudents.length})
                                </button>
                            </div>

                            <div className="submissions-list-container">
                                {activeTab === 'submitted' ? (
                                    <div className="submissions-list">
                                        {submissions.length === 0 ? (
                                            <p className="empty-message">Chưa có sinh viên nào nộp bài</p>
                                        ) : (
                                            submissions.map(submission => (
                                                <div key={submission.id} className="submission-item">
                                                    <div className="submission-header">
                                                        <div>
                                                            <strong>{submission.userName}</strong>
                                                            <span className={`status ${submission.status?.toLowerCase() || 'submitted'}`}>
                                                                {submission.status === 'LATE' ? 'Nộp muộn' :
                                                                    submission.status === 'GRADED' ? 'Đã chấm' : 'Đã nộp'}
                                                            </span>
                                                        </div>
                                                        <span className="submit-time">
                                                            {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    {submission.fileUrl && (
                                                        <div className="submission-file">
                                                            <a href={`http://localhost:8080${submission.fileUrl}`} target="_blank" rel="noopener noreferrer">
                                                                📎 {submission.fileName || 'Xem file'}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {submission.notes && (
                                                        <div className="submission-notes">
                                                            <strong>Ghi chú của SV:</strong> {submission.notes}
                                                        </div>
                                                    )}

                                                    {/* Show Grade Info if exists */}
                                                    {submission.score !== null && (
                                                        <div className="grade-info" style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                                                            <p><strong>Điểm:</strong> <span className="score-badge">{submission.score}</span></p>
                                                            {submission.feedback && <p><strong>Nhận xét:</strong> {submission.feedback}</p>}
                                                        </div>
                                                    )}

                                                    <div className="submission-actions">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleOpenGrade(submission)}
                                                        >
                                                            {submission.score !== null ? '✏️ Sửa điểm' : '📝 Chấm điểm'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <div className="missing-list">
                                        {missingStudents.length === 0 ? (
                                            <p className="empty-message">Tất cả sinh viên đã nộp bài! 🎉</p>
                                        ) : (
                                            <table className="missing-table">
                                                <thead>
                                                    <tr>
                                                        <th>Tên sinh viên</th>
                                                        <th>Email</th>
                                                        <th>Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {missingStudents.map(student => (
                                                        <tr key={student.studentId || student.id}>
                                                            <td><strong>{student.studentName || student.fullName || student.username}</strong></td>
                                                            <td>{student.studentEmail || student.email}</td>
                                                            <td><span className="badge badge-danger">Chưa nộp</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grade Modal */}
            {showGradeModal && gradingSubmission && (
                <div className="modal-overlay" onClick={() => setShowGradeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🎓 Chấm điểm: {gradingSubmission.userName}</h2>
                            <button className="modal-close" onClick={() => setShowGradeModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleGradeSubmit} className="modal-body">
                            <div className="form-group">
                                <label>Điểm số (0-10) *</label>
                                <input
                                    type="number"
                                    className="input"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={gradeForm.score}
                                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nhận xét / Góp ý</label>
                                <textarea
                                    className="textarea"
                                    rows="4"
                                    value={gradeForm.feedback}
                                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                                    placeholder="Nhập nhận xét cho sinh viên..."
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowGradeModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    💾 Lưu kết quả
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherAssignments;
