import React, { useState, useEffect } from 'react';
import { sharedDocumentAPI, subjectAPI } from '../services/api';
import './Documents.css';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [myDocuments, setMyDocuments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed'); // feed, hot, my-docs
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Upload form
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        type: 'LECTURE_SLIDES',
        subjectId: '',
        tags: '',
        file: null
    });

    const documentTypes = {
        'LECTURE_SLIDES': 'Slide bài giảng',
        'TEXTBOOK': 'Giáo trình',
        'EXERCISE': 'Bài tập',
        'SOLUTION': 'Đáp án',
        'REFERENCE': 'Tài liệu tham khảo',
        'EXAM': 'Đề thi',
        'OTHER': 'Khác'
    };

    const typeIcons = {
        'LECTURE_SLIDES': '📊',
        'TEXTBOOK': '📖',
        'EXERCISE': '📝',
        'SOLUTION': '✅',
        'REFERENCE': '📚',
        'EXAM': '📋',
        'OTHER': '📄'
    };

    useEffect(() => {
        loadData();
    }, [activeTab, filterType]);

    const loadData = async () => {
        try {
            setLoading(true);
            let data;

            if (activeTab === 'feed') {
                if (filterType) {
                    const res = await sharedDocumentAPI.getByType(filterType);
                    data = res.data;
                } else {
                    const res = await sharedDocumentAPI.getFeed();
                    data = res.data;
                }
                setDocuments(data);
            } else if (activeTab === 'hot') {
                const res = await sharedDocumentAPI.getHot();
                setDocuments(res.data);
            } else if (activeTab === 'my-docs') {
                const res = await sharedDocumentAPI.getMyDocuments();
                setMyDocuments(res.data);
            }

            // Load subjects for upload form
            // Try multiple methods to get subjects
            try {
                // First try to get all subjects (for teachers)
                const subjectsRes = await subjectAPI.getAll();
                if (subjectsRes.data && subjectsRes.data.length > 0) {
                    setSubjects(subjectsRes.data);
                } else {
                    // Fallback: try to get enrolled subjects (for students)
                    const { enrollmentAPI } = await import('../services/api');
                    const enrolledRes = await enrollmentAPI.getMySubjects();
                    setSubjects(enrolledRes.data || []);
                }
            } catch (e) {
                console.log('Could not load subjects from getAll, trying enrolled subjects...');
                try {
                    const { enrollmentAPI } = await import('../services/api');
                    const enrolledRes = await enrollmentAPI.getMySubjects();
                    setSubjects(enrolledRes.data || []);
                } catch (err) {
                    console.log('No subjects available');
                    setSubjects([]);
                }
            }
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadData();
            return;
        }
        try {
            setLoading(true);
            const res = await sharedDocumentAPI.search(searchQuery);
            setDocuments(res.data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (docId) => {
        try {
            await sharedDocumentAPI.toggleLike(docId);
            // Reload to update like count
            loadData();
        } catch (error) {
            console.error('Error liking:', error);
        }
    };

    const handleDownload = async (doc) => {
        try {
            await sharedDocumentAPI.trackDownload(doc.id);
            // Open file in new tab
            window.open(doc.fileUrl, '_blank');
        } catch (error) {
            console.error('Error downloading:', error);
        }
    };

    const handleShare = (doc) => {
        const url = window.location.origin + '/documents/' + doc.id;
        navigator.clipboard.writeText(url);
        alert('Đã sao chép link tài liệu!');
    };

    const openComments = async (doc) => {
        setSelectedDocument(doc);
        try {
            const res = await sharedDocumentAPI.getComments(doc.id);
            setComments(res.data);
            setShowCommentModal(true);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await sharedDocumentAPI.addComment(selectedDocument.id, { content: newComment });
            const res = await sharedDocumentAPI.getComments(selectedDocument.id);
            setComments(res.data);
            setNewComment('');
            loadData(); // Update comment count
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.file) {
            alert('Vui lòng chọn file!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', uploadForm.file);
            formData.append('title', uploadForm.title);
            formData.append('description', uploadForm.description);
            formData.append('type', uploadForm.type);
            if (uploadForm.subjectId) {
                formData.append('subjectId', uploadForm.subjectId);
            }
            formData.append('tags', uploadForm.tags);
            formData.append('isShared', 'true');

            await sharedDocumentAPI.upload(formData);
            setShowUploadModal(false);
            setUploadForm({ title: '', description: '', type: 'LECTURE_SLIDES', subjectId: '', tags: '', file: null });
            loadData();
            alert('Đã chia sẻ tài liệu thành công!');
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Lỗi khi tải lên: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!window.confirm('Bạn có chắc muốn xóa tài liệu này?')) return;
        try {
            await sharedDocumentAPI.delete(docId);
            loadData();
        } catch (error) {
            alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const currentDocs = activeTab === 'my-docs' ? myDocuments : documents;

    if (loading) {
        return (
            <div className="documents-page">
                <div className="loading-spinner">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="documents-page">
            {/* Header */}
            <div className="documents-header">
                <div>
                    <h1><span className="page-icon">📚</span> Chia Sẻ Tài Liệu</h1>
                    <p className="subtitle">Cộng đồng chia sẻ tài liệu học tập</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                    + Chia Sẻ Tài Liệu
                </button>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-bar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>🔍</button>
                </div>
                <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">Tất cả loại</option>
                    {Object.entries(documentTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    🆕 Mới nhất
                </button>
                <button
                    className={`tab ${activeTab === 'hot' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hot')}
                >
                    🔥 Phổ biến
                </button>
                <button
                    className={`tab ${activeTab === 'my-docs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-docs')}
                >
                    📁 Tài liệu của tôi
                </button>
            </div>

            {/* Document Feed */}
            <div className="documents-feed">
                {currentDocs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📂</div>
                        <h3>Chưa có tài liệu nào</h3>
                        <p>Hãy là người đầu tiên chia sẻ tài liệu!</p>
                    </div>
                ) : (
                    currentDocs.map(doc => (
                        <div key={doc.id} className="document-card">
                            <div className="document-header">
                                <div className="document-type-icon">
                                    {typeIcons[doc.type] || '📄'}
                                </div>
                                <div className="document-info">
                                    <h3>{doc.title}</h3>
                                    <div className="document-meta">
                                        <span className="author">👤 {doc.userName}</span>
                                        <span className="date">📅 {formatDate(doc.createdAt)}</span>
                                        {doc.subjectName && (
                                            <span className="subject">📖 {doc.subjectName}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="document-type-badge">
                                    {documentTypes[doc.type]}
                                </div>
                            </div>

                            {doc.description && (
                                <p className="document-description">{doc.description}</p>
                            )}

                            <div className="document-file-info">
                                <span>📎 {doc.fileName}</span>
                                <span>💾 {formatFileSize(doc.fileSize)}</span>
                                <span>👁️ {doc.viewCount} lượt xem</span>
                                <span>⬇️ {doc.downloadCount} lượt tải</span>
                            </div>

                            {doc.tags && (
                                <div className="document-tags">
                                    {doc.tags.split(',').map((tag, i) => (
                                        <span key={i} className="tag">#{tag.trim()}</span>
                                    ))}
                                </div>
                            )}

                            <div className="document-actions">
                                <button
                                    className={`action-btn like-btn ${doc.isLikedByCurrentUser ? 'liked' : ''}`}
                                    onClick={() => handleLike(doc.id)}
                                >
                                    {doc.isLikedByCurrentUser ? '❤️' : '🤍'} {doc.likeCount}
                                </button>
                                <button
                                    className="action-btn comment-btn"
                                    onClick={() => openComments(doc)}
                                >
                                    💬 {doc.commentCount}
                                </button>
                                <button
                                    className="action-btn download-btn"
                                    onClick={() => handleDownload(doc)}
                                >
                                    ⬇️ Tải về
                                </button>
                                <button
                                    className="action-btn share-btn"
                                    onClick={() => handleShare(doc)}
                                >
                                    🔗 Chia sẻ
                                </button>
                                {activeTab === 'my-docs' && (
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => handleDeleteDocument(doc.id)}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📤 Chia Sẻ Tài Liệu</h2>
                            <button className="close-btn" onClick={() => setShowUploadModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label>Tiêu đề *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={uploadForm.title}
                                    onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={uploadForm.description}
                                    onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Loại tài liệu</label>
                                    <select
                                        className="form-control"
                                        value={uploadForm.type}
                                        onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
                                    >
                                        {Object.entries(documentTypes).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Môn học (tùy chọn)</label>
                                    <select
                                        className="form-control"
                                        value={uploadForm.subjectId}
                                        onChange={e => setUploadForm({ ...uploadForm, subjectId: e.target.value })}
                                    >
                                        <option value="">-- Chọn môn học --</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Tags (phân cách bởi dấu phẩy)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="VD: java, lập trình, OOP"
                                    value={uploadForm.tags}
                                    onChange={e => setUploadForm({ ...uploadForm, tags: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>File tài liệu *</label>
                                <input
                                    type="file"
                                    className="form-control file-input"
                                    onChange={e => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Chia sẻ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Comment Modal */}
            {showCommentModal && selectedDocument && (
                <div className="modal-overlay" onClick={() => setShowCommentModal(false)}>
                    <div className="modal-content comment-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>💬 Bình luận - {selectedDocument.title}</h2>
                            <button className="close-btn" onClick={() => setShowCommentModal(false)}>&times;</button>
                        </div>
                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <span className="comment-author">{comment.userName}</span>
                                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="comment-replies">
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} className="reply-item">
                                                        <span className="reply-author">{reply.userName}</span>
                                                        <p>{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="comment-input">
                            <input
                                type="text"
                                placeholder="Viết bình luận..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleAddComment()}
                            />
                            <button onClick={handleAddComment}>Gửi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
