import React, { useState, useEffect } from 'react';
import { subjectAPI, enrollmentAPI } from '../services/api';
import './StudentManagement.css';

const StudentManagement = ({ user }) => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const res = await subjectAPI.getAll();
            setSubjects(res.data);
            if (res.data.length > 0) {
                handleSelectSubject(res.data[0]);
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSubject = async (subject) => {
        setSelectedSubject(subject);
        setLoadingStudents(true);
        try {
            const res = await enrollmentAPI.getSubjectStudents(subject.id);
            setStudents(res.data);
        } catch (error) {
            console.error('Error loading students:', error);
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    if (loading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="student-management-page">
            <div className="page-header">
                <div>
                    <h1>👥 Quản Lý Sinh Viên</h1>
                    <p className="subtitle">Danh sách sinh viên đăng ký môn học của bạn</p>
                </div>
            </div>

            <div className="management-container">
                <div className="subjects-sidebar">
                    <h3>Môn học của bạn</h3>
                    <div className="subject-list">
                        {subjects.map(subject => (
                            <div
                                key={subject.id}
                                className={`subject-item ${selectedSubject?.id === subject.id ? 'active' : ''}`}
                                onClick={() => handleSelectSubject(subject)}
                                style={{ borderLeftColor: subject.color }}
                            >
                                <div className="subject-name">{subject.name}</div>
                                <div className="subject-code-small">{subject.code}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="students-content">
                    {selectedSubject ? (
                        <>
                            <div className="content-header">
                                <div>
                                    <h2>{selectedSubject.name}</h2>
                                    <p className="subject-info-text">
                                        {selectedSubject.code} • {selectedSubject.credits} tín chỉ • {students.length} sinh viên
                                    </p>
                                </div>
                            </div>

                            {loadingStudents ? (
                                <div className="loading-spinner">Đang tải danh sách sinh viên...</div>
                            ) : students.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📭</div>
                                    <h3>Chưa có sinh viên nào đăng ký</h3>
                                    <p>Khi có sinh viên đăng ký môn học này, họ sẽ hiển thị ở đây</p>
                                </div>
                            ) : (
                                <div className="students-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Họ tên</th>
                                                <th>Email</th>
                                                <th>Mã SV</th>
                                                <th>Ngày đăng ký</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((enrollment, index) => (
                                                <tr key={enrollment.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="student-name">
                                                        <div className="avatar">{enrollment.studentName?.charAt(0) || 'S'}</div>
                                                        {enrollment.studentName || 'N/A'}
                                                    </td>
                                                    <td>{enrollment.studentEmail || 'N/A'}</td>
                                                    <td>{enrollment.studentId || 'N/A'}</td>
                                                    <td>
                                                        {enrollment.enrolledAt ?
                                                            new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN') :
                                                            'N/A'}
                                                    </td>
                                                    <td>
                                                        <span className="status-badge active">Đang học</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📚</div>
                            <h3>Chọn môn học để xem sinh viên</h3>
                            <p>Chọn một môn học từ danh sách bên trái</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
