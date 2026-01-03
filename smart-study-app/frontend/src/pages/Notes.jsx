import React, { useState, useEffect } from 'react';
import { noteAPI, subjectAPI } from '../services/api';
import './Notes.css';

const Notes = ({ user }) => {
    const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'personal', 'compose'
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // Compose Form State
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('ALL');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [reminderTime, setReminderTime] = useState('');

    const [loading, setLoading] = useState(false);
    // Compatible check for both formats if uncertain, but Sidebar uses user.role === 'TEACHER'
    const isTeacher = user?.role === 'TEACHER' || user?.roles?.includes('ROLE_TEACHER');

    useEffect(() => {
        if (activeTab === 'compose' || activeTab === 'create-personal') {
            loadSubjects();
        } else {
            loadNotes();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedSubject && activeTab === 'compose') {
            loadSubjects(); // Actually we need students here, logic below is correct but calling wrong fn? loadStudents(selectedSubject)
            loadStudents(selectedSubject);
        }
    }, [selectedSubject]);

    const loadNotes = async () => {
        setLoading(true);
        try {
            const res = await noteAPI.getAll(); // Uses getMyNotes
            let fetchedNotes = res.data || [];

            // Client-side filtering for tabs (or backend could handle it)
            if (activeTab === 'inbox') {
                // Sender exists => It's a message
                fetchedNotes = fetchedNotes.filter(n => n.senderId);
            } else {
                // No sender => Personal note
                fetchedNotes = fetchedNotes.filter(n => !n.senderId);
            }

            // Group notes by thread
            const noteMap = {};
            fetchedNotes.forEach(n => {
                n.replies = [];
                noteMap[n.id] = n;
            });

            const rootNotes = [];
            fetchedNotes.forEach(n => {
                if (n.replyToId && noteMap[n.replyToId]) {
                    // It is a reply to an existing note in this list
                    noteMap[n.replyToId].replies.push(n);
                } else {
                    // It is a root note (or orphan whose parent isn't loaded)
                    rootNotes.push(n);
                }
            });

            // Sort: Unread first for inbox, then by date logic
            const sortNotes = (list) => {
                return list.sort((a, b) => {
                    // Prioritize unread
                    if (activeTab === 'inbox' && a.isRead !== b.isRead) {
                        return a.isRead ? 1 : -1;
                    }
                    // Then by date (newest first)
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            };

            // Recursively sort replies if needed, or just keep them chronological?
            // Usually replies are oldest -> newest.
            fetchedNotes.forEach(n => {
                if (n.replies.length > 0) {
                    n.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }
            });

            setNotes(sortNotes(rootNotes));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadSubjects = async () => {
        try {
            const res = await subjectAPI.getAll(); // Or getTeacherSubjects
            setSubjects(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const loadStudents = async (subId) => {
        try {
            const res = await subjectAPI.getSubjectStudents(subId);
            setStudents(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: noteTitle,
                content: noteContent,
                subjectId: selectedSubject ? parseInt(selectedSubject) : null,
                color: '#3b82f6', // blue
                type: 'IMPORTANT',
                reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null
            };

            if (activeTab === 'create-personal') {
                // Personal Note
                await noteAPI.create(payload);
                alert('Đã lưu ghi chú cá nhân!');
            } else {
                // Message
                if (selectedStudent === 'ALL') {
                    await noteAPI.sendToSubject(selectedSubject, payload);
                } else {
                    await noteAPI.sendToStudent(selectedStudent, payload);
                }
                alert('Gửi thành công!');
            }

            setNoteTitle('');
            setNoteContent('');
            setSelectedSubject('');
            setReminderTime('');

            // Go back
            setActiveTab(activeTab === 'create-personal' ? 'personal' : 'inbox');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu/gửi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleReply = async (noteId) => {
        try {
            await noteAPI.reply(noteId, replyContent);
            setReplyContent('');
            setReplyingTo(null);
            alert('Đã gửi phản hồi!');
            loadNotes(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Lỗi phản hồi');
        }
    };

    const handleMarkRead = async (note) => {
        if (!note.isRead) {
            try {
                await noteAPI.markAsRead(note.id);
                // Update UI locally
                setNotes(notes.map(n => n.id === note.id ? { ...n, isRead: true } : n));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="notes-page">
            <div className="notes-header">
                <h1>{
                    activeTab === 'compose' ? 'Soạn Tin Nhắn' :
                        activeTab === 'create-personal' ? 'Tạo Ghi Chú Mới' :
                            selectedNote ? 'Chi Tiết' :
                                activeTab === 'personal' ? 'Ghi Chú Cá Nhân' : 'Hộp Thư Đến'
                }</h1>

                {activeTab !== 'compose' && activeTab !== 'create-personal' && !selectedNote && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {activeTab === 'personal' && (
                            <button className="btn btn-primary btn-new-note" onClick={() => setActiveTab('create-personal')}>
                                <span className="icon-plus">+</span> Tạo Ghi Chú
                            </button>
                        )}

                        {isTeacher && activeTab === 'inbox' && (
                            <button className="btn btn-primary btn-new-note" onClick={() => setActiveTab('compose')}>
                                <span className="icon-plus">+</span> Soạn Thông Báo
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Hide Tabs when in Detail Mode or Compose Mode */}
            {!selectedNote && activeTab !== 'compose' && (
                <div className="notes-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inbox')}
                    >
                        Hộp thư đến
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        Ghi chú cá nhân
                    </button>
                </div>
            )}

            {activeTab === 'compose' || activeTab === 'create-personal' ? (
                <div className="compose-container">
                    <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>
                        {activeTab === 'compose' ? 'Soạn Tin Nhắn / Thông Báo' : 'Tạo Ghi Chú Cá Nhân'}
                    </h2>
                    <form onSubmit={handleSend}>
                        {activeTab === 'compose' && (
                            <>
                                <div className="form-group">
                                    <label>Chọn môn học:</label>
                                    <select
                                        className="form-control"
                                        value={selectedSubject}
                                        onChange={e => setSelectedSubject(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Chọn môn học --</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedSubject && (
                                    <div className="form-group">
                                        <label>Gửi đến:</label>
                                        <select
                                            className="form-control"
                                            value={selectedStudent}
                                            onChange={e => setSelectedStudent(e.target.value)}
                                        >
                                            <option value="ALL">Gửi cho tất cả sinh viên lớp này</option>
                                            {students.map(s => (
                                                <option key={s.id} value={s.studentId || s.id}>
                                                    {s.studentName || s.fullName || s.username} ({s.studentCode || s.code || 'SV'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="form-group">
                            <label>Tiêu đề:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={noteTitle}
                                onChange={e => setNoteTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Nội dung:</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                value={noteContent}
                                onChange={e => setNoteContent(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {activeTab === 'create-personal' && (
                            <div className="form-group">
                                <label>Lời nhắc (Tùy chọn):</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={reminderTime}
                                    onChange={e => setReminderTime(e.target.value)}
                                />
                                <small style={{ color: '#64748b' }}>Chúng tôi sẽ nhắc bạn vào thời gian này.</small>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setActiveTab(activeTab === 'compose' ? 'inbox' : 'personal')}>
                                Hủy
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {activeTab === 'compose' ? 'Gửi đi' : 'Lưu Ghi Chú'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : selectedNote ? (
                /* DETAIL VIEW */
                <div className="note-detail-view">
                    <button className="btn btn-outline" onClick={() => setSelectedNote(null)} style={{ marginBottom: '1rem' }}>
                        ← Quay lại danh sách
                    </button>

                    <div className="note-card detail-card" style={{ borderLeftColor: selectedNote.color }}>
                        <div className="note-header">
                            <span className="note-sender">
                                {selectedNote.isRead ? '📨' : '📩 (MỚI)'} Từ: {selectedNote.senderName || 'Hệ thống'}
                            </span>
                            <span className="note-date">
                                {new Date(selectedNote.updatedAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <h2 style={{ marginTop: 0 }}>{selectedNote.title}</h2>
                        <div className="note-content-full">
                            {selectedNote.content}
                        </div>
                    </div>

                    <div className="note-replies-section">
                        <h3>Phản hồi</h3>

                        {selectedNote.replies && selectedNote.replies.length > 0 ? (
                            <div className="replies-list">
                                {selectedNote.replies.map(reply => (
                                    <div key={reply.id} className="reply-card">
                                        <div className="reply-header">
                                            <strong>{reply.senderName}</strong>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="reply-content">
                                            {reply.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-replies">
                                <p>Chưa có phản hồi nào từ sinh viên.</p>
                            </div>
                        )}

                        {/* Reply Form for Student (or Teacher if they want to follow up) */}
                        <div className="reply-form-section" style={{ marginTop: '2rem' }}>
                            <h4>Gửi phản hồi</h4>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Nhập nội dung phản hồi..."
                                value={replyContent}
                                onChange={e => setReplyContent(e.target.value)}
                            ></textarea>
                            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={() => handleReply(selectedNote.id)}>Gửi phản hồi</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* LIST VIEW */
                <div className="notes-grid">
                    {notes.length === 0 && <p style={{ color: '#64748b' }}>Không có ghi chú nào.</p>}

                    {notes.map(note => (
                        <div
                            key={note.id}
                            className="note-card hoverable"
                            style={{ borderLeftColor: note.color }}
                            onClick={() => {
                                handleMarkRead(note);
                                setSelectedNote(note);
                            }}
                        >
                            <div className="note-header" style={{ marginBottom: '0.5rem' }}>
                                <span className={`note-sender ${!note.isRead && activeTab === 'inbox' ? 'unread' : ''}`}>
                                    {activeTab === 'inbox' ? (
                                        <>
                                            {note.senderName || 'Hệ thống'}
                                        </>
                                    ) : (
                                        note.title
                                    )}
                                </span>
                                <span className="note-date">
                                    {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            {activeTab === 'inbox' && <h4 className="note-title-preview">{note.title}</h4>}

                            <p className="note-content-preview">
                                {note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content}
                            </p>

                            {note.replies && note.replies.length > 0 && (
                                <div className="reply-badge">
                                    <span>💬 {note.replies.length} phản hồi</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notes;
