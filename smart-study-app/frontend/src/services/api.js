import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
};

// Subject API
export const subjectAPI = {
    getAll: () => api.get('/subjects'),
    getTeacherSubjects: () => api.get('/subjects'), // Teacher sees their subjects
    getById: (id) => api.get(`/subjects/${id}`),
    create: (data) => api.post('/subjects', data),
    update: (id, data) => api.put(`/subjects/${id}`, data),
    delete: (id) => api.delete(`/subjects/${id}`),
    getSubjectStudents: (subjectId) => api.get(`/enrollments/subject/${subjectId}/students`),
};


// Assignment API
export const assignmentAPI = {
    getAll: () => api.get('/assignments'),
    getUpcoming: () => api.get('/assignments/upcoming'),
    getOverdue: () => api.get('/assignments/overdue'),
    getBySubject: (subjectId) => api.get(`/assignments/subject/${subjectId}`),
    getAssignmentsBySubject: (subjectId) => api.get(`/assignments/subject/${subjectId}`),
    getByStatus: (status) => api.get(`/assignments/status/${status}`),
    getById: (id) => api.get(`/assignments/${id}`),
    create: (data) => {
        if (data instanceof FormData) {
            return api.post('/assignments', data, {
                headers: { 'Content-Type': undefined }
            });
        }
        return api.post('/assignments', data);
    },
    update: (id, data) => api.put(`/assignments/${id}`, data),
    updateStatus: (id, status) => api.put(`/assignments/${id}/status`, { status }),
    delete: (id) => api.delete(`/assignments/${id}`),

    // Submission methods
    submit: (id, formData) => api.post(`/assignments/${id}/submit`, formData, {
        headers: { 'Content-Type': undefined }
    }),
    getSubmissions: (id) => api.get(`/assignments/${id}/submissions`),
    getSubmissionsBySubject: (subjectId) => api.get(`/assignments/subject/${subjectId}/submissions`),
    getAllSubmissions: (id) => api.get(`/assignments/${id}/all-submissions`),
    gradeSubmission: (id, data) => api.post(`/assignments/submissions/${id}/grade`, data),
    getLatestSubmission: (id) => api.get(`/assignments/${id}/submissions/latest`),

    // Statistics
    getStatistics: () => api.get('/assignments/statistics'),
};

// Grade API
export const gradeAPI = {
    getAll: () => api.get('/grades'),
    getBySubject: (subjectId) => api.get(`/grades/subject/${subjectId}`),
    getGPA: () => api.get('/grades/gpa'),
    getSubjectAverage: (subjectId) => api.get(`/grades/subject/${subjectId}/average`),
    create: (data) => api.post('/grades', data),
    update: (id, data) => api.put(`/grades/${id}`, data),
    delete: (id) => api.delete(`/grades/${id}`),

    // Teacher methods
    getSubjectGrades: (subjectId) => api.get(`/grades/subject/${subjectId}/students`),
};

// Document API
export const documentAPI = {
    getAll: () => api.get('/documents'),
    getPublic: () => api.get('/documents/public'),
    getBySubject: (subjectId) => api.get(`/documents/subject/${subjectId}`),
    upload: (formData) => api.post('/documents', formData, {
        headers: { 'Content-Type': undefined },
    }),
    update: (id, data) => api.put(`/documents/${id}`, data),
    delete: (id) => api.delete(`/documents/${id}`),
    download: (id) => api.get(`/documents/${id}/download`, {
        responseType: 'blob',
    }),
};

// Note API
export const noteAPI = {
    getAll: () => api.get('/notes'),
    getPinned: () => api.get('/notes/pinned'),
    getBySubject: (subjectId) => api.get(`/notes/subject/${subjectId}`),
    create: (data) => api.post('/notes', data),
    update: (id, data) => api.put(`/notes/${id}`, data),
    togglePin: (id) => api.put(`/notes/${id}/pin`),
    delete: (id) => api.delete(`/notes/${id}`),

    // Messaging
    sendToStudent: (studentId, data) => api.post(`/notes/send/student/${studentId}`, data),
    sendToSubject: (subjectId, data) => api.post(`/notes/send/subject/${subjectId}`, data),
    reply: (noteId, content) => api.post(`/notes/reply/${noteId}`, { content }),
    markAsRead: (id) => api.put(`/notes/${id}/read`),
};

export const demoAPI = {
    generate: () => api.post('/demo/generate'),
};

export const dashboardAPI = {
    getTeacherStats: () => api.get('/dashboard/teacher/stats'),
};



// Notification API
export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    getUnread: () => api.get('/notifications/unread'),
    getCount: () => api.get('/notifications/count'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
};

// Enrollment API
export const enrollmentAPI = {
    enroll: (subjectId) => api.post(`/enrollments/enroll/${subjectId}`),
    drop: (subjectId) => api.post(`/enrollments/drop/${subjectId}`),
    getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
    getMySubjects: () => api.get('/enrollments/my-subjects'),
    getAvailableSubjects: () => api.get('/enrollments/available-subjects'),
    getSubjectStudents: (subjectId) => api.get(`/enrollments/subject/${subjectId}/students`),
};

// Schedule API (Updated)
export const scheduleAPI = {
    getMyTimetable: () => api.get('/schedules/my-timetable'),
    getMyTimetableByDay: (day) => api.get(`/schedules/my-timetable/day/${day}`),
    getMyTimetableByRange: (startDate, endDate) => api.get(`/schedules/my-timetable/range`, {
        params: { startDate, endDate }
    }),
    getBySubject: (subjectId) => api.get(`/schedules/subject/${subjectId}`),
    create: (data) => api.post('/schedules', data),
    update: (id, data) => api.put(`/schedules/${id}`, data),
    delete: (id) => api.delete(`/schedules/${id}`),
};

// Statistics API
export const statsAPI = {
    getOverview: () => api.get('/stats/overview'),
    getAssignments: () => api.get('/stats/assignments'),
    getGrades: () => api.get('/stats/grades'),
    getStudyTime: () => api.get('/stats/study-time'),
};

// Shared Document API (Mạng xã hội tài liệu)
export const sharedDocumentAPI = {
    // Feed
    getFeed: () => api.get('/shared-documents/feed'),
    getHot: () => api.get('/shared-documents/hot'),
    search: (keyword) => api.get('/shared-documents/search', { params: { keyword } }),
    getByType: (type) => api.get(`/shared-documents/type/${type}`),

    // Document CRUD
    getById: (id) => api.get(`/shared-documents/${id}`),
    upload: (formData) => api.post('/shared-documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/shared-documents/${id}`, data),
    delete: (id) => api.delete(`/shared-documents/${id}`),

    // Interactions
    toggleLike: (id) => api.post(`/shared-documents/${id}/like`),
    getComments: (id) => api.get(`/shared-documents/${id}/comments`),
    addComment: (id, data) => api.post(`/shared-documents/${id}/comments`, data),
    deleteComment: (commentId) => api.delete(`/shared-documents/comments/${commentId}`),
    trackDownload: (id) => api.post(`/shared-documents/${id}/download`),

    // My documents
    getMyDocuments: () => api.get('/shared-documents/my-documents'),
};

export default api;

