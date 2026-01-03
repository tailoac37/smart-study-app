import React, { useState, useEffect } from 'react';
import { assignmentAPI, subjectAPI } from '../services/api';
import './TeacherGrades.css';

const TeacherGrades = ({ user }) => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    // Data for the table
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);
    const [filterAssignment, setFilterAssignment] = useState('');
    const [filterGradeRange, setFilterGradeRange] = useState('ALL'); // ALL, GOOD, FAIR, AVG, BAD

    useEffect(() => {
        loadSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            loadGradebookData(selectedSubject);
        } else {
            setAssignments([]);
            setSubmissions([]);
            setStudents([]);
        }
    }, [selectedSubject]);

    const loadSubjects = async () => {
        try {
            const res = await subjectAPI.getTeacherSubjects();
            setSubjects(res.data || []);
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    };

    const loadGradebookData = async (subjectId) => {
        setLoading(true);
        try {
            const assignRes = await assignmentAPI.getAssignmentsBySubject(subjectId);
            setAssignments(assignRes.data || []);

            const subRes = await assignmentAPI.getSubmissionsBySubject(subjectId);
            setSubmissions(subRes.data || []);

            const studentRes = await subjectAPI.getSubjectStudents(subjectId);
            setStudents(studentRes.data || []);

        } catch (error) {
            console.error('Error loading gradebook:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSubmission = (studentId, assignmentId) => {
        return submissions.find(s =>
            (s.studentId === studentId || s.userId === studentId) &&
            s.assignmentId === assignmentId
        );
    };

    const getTypeColor = (score) => {
        if (score === null || score === undefined) return 'grade-none';
        if (score >= 8.5) return 'grade-good';
        if (score >= 7.0) return 'grade-avg'; // Using yellow for Fair
        if (score >= 5.0) return 'grade-avg'; // AVG is same color as FAIR in original css but using avg for yellow-orange
        return 'grade-bad';
    };

    // Calculate Average for a student
    const calculateAverage = (studentId) => {
        if (assignments.length === 0) return '-';

        let totalScore = 0;
        let count = 0;
        const now = new Date();

        assignments.forEach(assign => {
            const sub = getSubmission(studentId, assign.id);

            if (sub && sub.score !== null) {
                totalScore += parseFloat(sub.score);
                count++;
            } else {
                // If no score/submission, check if overdue
                if (new Date(assign.deadline) < now) {
                    totalScore += 0;
                    count++;
                }
            }
        });

        if (count === 0) return '-';
        return (totalScore / count).toFixed(1);
    };

    // Filter Logic
    const filteredStudents = students.filter(student => {
        const studentId = student.studentId || student.id;
        let score = -1;

        if (filterAssignment) {
            // Filter by specific assignment
            const sub = getSubmission(studentId, parseInt(filterAssignment));
            if (sub && sub.score !== null) {
                score = sub.score;
            } else {
                // Check if overdue
                const targetAssign = assignments.find(a => a.id === parseInt(filterAssignment));
                if (targetAssign && new Date(targetAssign.deadline) < new Date()) {
                    score = 0;
                }
            }
        } else {
            // Filter by Average
            const avg = calculateAverage(studentId);
            score = avg === '-' ? -1 : parseFloat(avg);
        }

        if (score === -1) return filterGradeRange === 'ALL'; // Only show in ALL

        switch (filterGradeRange) {
            case 'GOOD': return score >= 8.5;
            case 'FAIR': return score >= 7.0 && score < 8.5;
            case 'AVG': return score >= 5.0 && score < 7.0;
            case 'BAD': return score < 5.0;
            default: return true;
        }
    });

    const renderHeader = () => (
        <>
            <div className="page-header">
                <h1>📊 Quản Lý Điểm Số</h1>
            </div>

            <div className="grade-controls">
                <div className="control-group">
                    <label>Chọn môn học:</label>
                    <select
                        className="select-input"
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                    >
                        <option value="">-- Chọn môn học --</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                    </select>
                </div>

                {selectedSubject && (
                    <>
                        <div className="control-group">
                            <label>Lọc theo bài kiểm tra:</label>
                            <select
                                className="select-input"
                                value={filterAssignment}
                                onChange={e => setFilterAssignment(e.target.value)}
                            >
                                <option value="">Tất cả (Bảng điểm tổng)</option>
                                {assignments.map(a => (
                                    <option key={a.id} value={a.id}>{a.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="control-group">
                            <label>Lọc theo học lực:</label>
                            <select
                                className="select-input"
                                value={filterGradeRange}
                                onChange={e => setFilterGradeRange(e.target.value)}
                            >
                                <option value="ALL">Tất cả sinh viên</option>
                                <option value="GOOD">Giỏi (≥ 8.5)</option>
                                <option value="FAIR">Khá (7.0 - 8.4)</option>
                                <option value="AVG">Trung bình (5.0 - 6.9)</option>
                                <option value="BAD">Yếu / Chưa đạt (&lt; 5.0)</option>
                            </select>
                        </div>
                    </>
                )}
            </div>
        </>
    );

    // 1. If an assignment is selected, show list view
    if (filterAssignment) {
        const targetAssignment = assignments.find(a => a.id === parseInt(filterAssignment));

        return (
            <div className="teacher-grades-page">
                {renderHeader()}

                <div className="filter-active">
                    <span>Đang xem: <strong>{targetAssignment?.title}</strong></span>
                    <button className="btn btn-sm" onClick={() => setFilterAssignment('')}>
                        Quay lại bảng điểm tổng
                    </button>
                </div>

                <div className="submission-list-view">
                    {filteredStudents.length === 0 ? <p className="text-center">Không tìm thấy sinh viên nào theo tiêu chí lọc.</p> : null}
                    {filteredStudents.map(student => {
                        const sub = getSubmission(student.studentId || student.id, targetAssignment?.id);
                        const isOverdue = targetAssignment && new Date(targetAssignment.deadline) < new Date();

                        let displayVal = 'Chưa chấm';
                        let displayClass = '';
                        let dateText = '';

                        if (sub && sub.score !== null) {
                            displayVal = sub.score;
                            displayClass = getTypeColor(sub.score);
                            dateText = new Date(sub.submittedAt).toLocaleDateString('vi-VN');
                        } else if (isOverdue) {
                            displayVal = '0';
                            displayClass = 'grade-bad';
                            dateText = 'Quá hạn';
                        } else if (sub) {
                            dateText = new Date(sub.submittedAt).toLocaleDateString('vi-VN');
                        } else {
                            displayVal = 'Chưa nộp';
                            displayClass = 'badge-danger';
                        }

                        return (
                            <div key={student.id} className="student-submission-item">
                                <div className="student-info">
                                    <h4>{student.studentName || student.fullName || student.username}</h4>
                                    <p>{student.studentCode || student.email}</p>
                                </div>
                                <div className="submission-status">
                                    {sub || isOverdue ? (
                                        <div style={{ textAlign: 'right' }}>
                                            <div className={`grade-value ${displayClass}`}>
                                                {displayVal}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                {dateText}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="badge-danger">Chưa nộp</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // 2. Default: Matrix View
    return (
        <div className="teacher-grades-page">
            {renderHeader()}

            {loading ? (
                <div className="loading-spinner">Đang tải bảng điểm...</div>
            ) : !selectedSubject ? (
                <div className="empty-state">
                    <h3>Vui lòng chọn môn học để xem điểm</h3>
                </div>
            ) : (
                <div className="grade-table-container">
                    <table className="grade-table">
                        <thead>
                            <tr>
                                <th className="col-student">Sinh viên ({filteredStudents.length})</th>
                                {assignments.map(a => (
                                    <th key={a.id} title={a.title}>
                                        {a.title.length > 20 ? a.title.substring(0, 20) + '...' : a.title}
                                        <br />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#64748b' }}>
                                            {a.type}
                                        </span>
                                    </th>
                                ))}
                                <th>TB Chung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={assignments.length + 2} style={{ textAlign: 'center', padding: '2rem' }}>
                                        Không tìm thấy kết quả phù hợp
                                    </td>
                                </tr>
                            )}
                            {filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td className="col-student">
                                        {student.studentName || student.fullName || student.username}
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {student.studentCode || student.email}
                                        </div>
                                    </td>
                                    {assignments.map(a => {
                                        const sub = getSubmission(student.studentId || student.id, a.id);
                                        const isOverdue = new Date(a.deadline) < new Date();

                                        // Determine display value and style
                                        let displayVal = '-';
                                        let displayClass = 'grade-none';

                                        if (sub && sub.score !== null) {
                                            displayVal = sub.score;
                                            displayClass = getTypeColor(sub.score);
                                        } else if (isOverdue) {
                                            displayVal = 0;
                                            displayClass = 'grade-bad';
                                        }

                                        return (
                                            <td key={a.id} className="grade-cell">
                                                <span className={`grade-value ${displayClass}`}>
                                                    {displayVal}
                                                </span>
                                            </td>
                                        );
                                    })}
                                    <td className="grade-cell" style={{ fontWeight: 'bold' }}>
                                        {calculateAverage(student.studentId || student.id)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherGrades;
