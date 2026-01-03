import React, { useState, useEffect } from 'react';
import { assignmentAPI, subjectAPI } from '../services/api';
import './Grades.css';

const Grades = () => {
    const [loading, setLoading] = useState(true);
    const [gradedAssignments, setGradedAssignments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [stats, setStats] = useState({
        gpa: 0,
        totalGraded: 0
    });
    const [filter, setFilter] = useState({
        search: '',
        subject: '',
        scoreRange: 'ALL' // ALL, EXCELLENT (>=3.6), GOOD (3.2-3.59), AVERAGE (2.5-3.19), WEAK (<2.5) for sorting? Or keep 10 scale filter?
        // Let's keep 10 scale filter for individual assignments as they are graded in 10 scale.
        // User asked to convert "Grades interface" to 4 scale.
        // Assignments are likely still graded 1-10. The aggregation is 4.0.
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [assignRes, subjectRes] = await Promise.all([
                assignmentAPI.getAll(),
                subjectAPI.getAll()
            ]);

            const allAssignments = assignRes.data || [];
            const allSubjects = subjectRes.data || [];

            // Filter only assignments that have a score
            const graded = allAssignments.filter(a =>
                a.latestSubmission && a.latestSubmission.score !== null
            );

            setGradedAssignments(graded);
            setSubjects(allSubjects);

            calculateStats(graded, allSubjects);

        } catch (error) {
            console.error('Error fetching grades:', error);
        } finally {
            setLoading(false);
        }
    };

    const convertTo4Scale = (score10) => {
        if (score10 >= 8.5) return 4.0;
        if (score10 >= 7.0) return 3.0;
        if (score10 >= 5.5) return 2.0;
        if (score10 >= 4.0) return 1.0;
        return 0.0;
    };

    const calculateStats = (assignments, subjectList) => {
        // 1. Group by Subject
        const subjectGroups = {};
        assignments.forEach(a => {
            if (!subjectGroups[a.subjectId]) subjectGroups[a.subjectId] = [];
            subjectGroups[a.subjectId].push(a);
        });

        // 2. Calculate Avg per Subject (10 scale, weighted) then convert to 4
        let totalWeightedScore4 = 0;
        let totalCredits = 0;

        Object.keys(subjectGroups).forEach(subId => {
            const subject = subjectList.find(s => s.id === parseInt(subId));
            const credits = subject?.credits || 0; // Default to 0 if not found

            if (credits > 0) {
                // Calculate Weighted Avg (10)
                const group = subjectGroups[subId];
                let totalScore = 0;
                let totalWeight = 0;

                group.forEach(a => {
                    const score = a.latestSubmission.score;
                    let weight = 1;
                    const title = a.title.toLowerCase();
                    const type = a.type?.toLowerCase();
                    // Assuming 'type' from backend might be 'EXAM' or 'HOMEWORK'
                    // Relying on Title for "Midterm/Final" as requested, or type check

                    if (title.includes('giữa kì') || title.includes('midterm')) {
                        weight = 2;
                    } else if (title.includes('cuối kì') || title.includes('final')) {
                        weight = 3;
                    }

                    totalScore += score * weight;
                    totalWeight += weight;
                });

                const avg10 = totalWeight === 0 ? 0 : totalScore / totalWeight;
                const avg4 = convertTo4Scale(avg10);

                totalWeightedScore4 += avg4 * credits;
                totalCredits += credits;
            }
        });

        const gpa = totalCredits === 0 ? 0 : (totalWeightedScore4 / totalCredits).toFixed(2);

        setStats({
            gpa: gpa,
            totalGraded: assignments.length
        });
    };

    const getSubjectAverage4 = (subjectId) => {
        const subjectAssignments = gradedAssignments.filter(a => a.subjectId === subjectId);
        if (subjectAssignments.length === 0) return 0;

        let totalScore = 0;
        let totalWeight = 0;

        subjectAssignments.forEach(a => {
            const score = a.latestSubmission.score;
            let weight = 1;
            const title = a.title.toLowerCase();

            if (title.includes('giữa kì') || title.includes('midterm')) {
                weight = 2;
            } else if (title.includes('cuối kì') || title.includes('final')) {
                weight = 3;
            }

            totalScore += score * weight;
            totalWeight += weight;
        });

        const avg10 = totalWeight === 0 ? 0 : totalScore / totalWeight;
        return convertTo4Scale(avg10).toFixed(2); // Return 4-scale avg
    };

    // Extract unique subjects for filter
    const subjectOptions = [...new Set(gradedAssignments.map(a => a.subjectName || 'Khác'))];

    // Filter Logic
    const filteredGrades = gradedAssignments.filter(a => {
        const matchSearch = !filter.search ||
            a.title.toLowerCase().includes(filter.search.toLowerCase()) ||
            (a.subjectName && a.subjectName.toLowerCase().includes(filter.search.toLowerCase()));

        const matchSubject = !filter.subject || a.subjectName === filter.subject;

        let matchScore = true;
        const score = a.latestSubmission.score;
        // Keep filter on 10-scale raw score for finding specific bad assignments
        switch (filter.scoreRange) {
            case 'EXCELLENT': matchScore = score >= 8.5; break;
            case 'GOOD': matchScore = score >= 7.0 && score < 8.5; break;
            case 'AVERAGE': matchScore = score >= 5.0 && score < 7.0; break;
            case 'WEAK': matchScore = score < 5.0; break;
            default: matchScore = true;
        }

        return matchSearch && matchSubject && matchScore;
    });

    // Group filtered grades
    const groupedGrades = filteredGrades.reduce((acc, curr) => {
        const subject = curr.subjectName || 'Khác';
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(curr);
        return acc;
    }, {});

    const getScoreColor = (score) => {
        if (score >= 8.5) return 'high';
        if (score >= 7.0) return 'medium';
        return 'low';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu điểm số...</p>
            </div>
        );
    }

    return (
        <div className="grades-page">
            <div className="grades-header">
                <h1>📈 Bảng Điểm Cá Nhân</h1>
                <p>Theo dõi kết quả học tập (Hệ 4.0)</p>
            </div>

            {/* Stats Overview */}
            <div className="grades-overview">
                <div className="grade-stat-card">
                    <div className="stat-icon gpa">🏆</div>
                    <div className="stat-content">
                        <h3>{stats.gpa} <span>/ 4.00</span></h3>
                        <p>Điểm trung bình (GPA)</p>
                    </div>
                </div>
                <div className="grade-stat-card">
                    <div className="grade-circle">
                        <svg viewBox="0 0 36 36" className="circular-chart blue">
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#e2e8f0" strokeWidth="3"
                            />
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#3b82f6" strokeWidth="3"
                                strokeDasharray={`${(stats.gpa / 4) * 100}, 100`}
                            />
                        </svg>
                        <div className="percentage">
                            {(stats.gpa / 4 * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div className="stat-content">
                        <h3>Tiến độ</h3>
                        <p>Hiệu suất học tập</p>
                    </div>
                </div>
                <div className="grade-stat-card">
                    <div className="stat-icon total">📝</div>
                    <div className="stat-content">
                        <h3>{stats.totalGraded}</h3>
                        <p>Bài tập đã chấm</p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="grade-filters">
                <div className="filter-group">
                    <label>🔍 Tìm kiếm</label>
                    <input
                        type="text"
                        placeholder="Tên bài tập..."
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <label>📚 Môn học</label>
                    <select
                        value={filter.subject}
                        onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                    >
                        <option value="">Tất cả môn</option>
                        {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>📊 Mức điểm bài tập</label>
                    <select
                        value={filter.scoreRange}
                        onChange={(e) => setFilter({ ...filter, scoreRange: e.target.value })}
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="EXCELLENT">Giỏi (≥ 8.5)</option>
                        <option value="GOOD">Khá (7.0 - 8.4)</option>
                        <option value="AVERAGE">Trung bình (5.0 - 6.9)</option>
                        <option value="WEAK">Yếu (&lt; 5.0)</option>
                    </select>
                </div>
            </div>

            {/* Grades List */}
            {Object.keys(groupedGrades).length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>Không tìm thấy kết quả</h3>
                    <p>Thử thay đổi bộ lọc tìm kiếm của bạn</p>
                </div>
            ) : (
                Object.entries(groupedGrades).map(([subjectName, assignments]) => {
                    // Find actual subject ID from one of the assignments to get global Average logic
                    const subjectID = assignments[0]?.subjectId;
                    const subjectAvg4 = getSubjectAverage4(subjectID);

                    return (
                        <div key={subjectName} className="subject-grades">
                            <div className="subject-title">
                                <span>📚 {subjectName}</span>
                                <span className="subject-average">TB (Hệ 4): <span className="highlight-score">{subjectAvg4}</span></span>
                            </div>
                            <div className="grade-cards">
                                {assignments.map(assignment => (
                                    <div key={assignment.id} className="grade-card">
                                        <div className="grade-header">
                                            <h4 title={assignment.title}>{assignment.title}</h4>
                                            <div className={`grade-score ${getScoreColor(assignment.latestSubmission.score)}`}>
                                                {assignment.latestSubmission.score}
                                            </div>
                                        </div>

                                        <div className="grade-type-badge">
                                            {assignment.title.toLowerCase().includes('midterm') || assignment.title.toLowerCase().includes('giữa kì') ? 'Giữa kì (x2)' :
                                                assignment.title.toLowerCase().includes('final') || assignment.title.toLowerCase().includes('cuối kì') ? 'Cuối kì (x3)' : 'Thường (x1)'}
                                        </div>

                                        <div className="grade-info">
                                            <div className="info-row">
                                                <span>📅 Ngày chấm:</span>
                                                <span>{new Date(assignment.latestSubmission.gradedAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="info-row">
                                                <span>👨‍🏫 Giảng viên:</span>
                                                <strong>{assignment.userName}</strong>
                                            </div>
                                        </div>

                                        {(assignment.latestSubmission.feedback) && (
                                            <div className="feedback-box">
                                                <h5>💬 Nhận xét:</h5>
                                                <div className="feedback-content">
                                                    "{assignment.latestSubmission.feedback}"
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Grades;
