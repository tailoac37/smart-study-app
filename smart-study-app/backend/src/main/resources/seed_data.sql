-- =====================================================
-- SEED DATA FOR SMART STUDY APP
-- Mật khẩu mặc định cho tất cả user: 123456
-- (đã được mã hóa BCrypt)
-- =====================================================

-- Sử dụng database railway (cho Railway) hoặc smart_study_db (cho local)
-- USE smart_study_db;
USE smart_study_db;

-- =====================================================
-- XÓA DỮ LIỆU CŨ (theo thứ tự để tránh lỗi foreign key)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa dữ liệu từ các bảng phụ thuộc trước
DELETE FROM document_comments;
DELETE FROM document_likes;
DELETE FROM assignment_submissions;
DELETE FROM grades;
DELETE FROM notes;
DELETE FROM assignments;
DELETE FROM schedules;
DELETE FROM documents;
DELETE FROM subject_enrollments;
DELETE FROM notifications;
DELETE FROM subjects;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. TẠO GIẢNG VIÊN (TEACHER)
-- =====================================================
-- Mật khẩu: 123456 (BCrypt encoded)
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6

INSERT INTO users (username, password, full_name, email, phone, role, active, student_year, created_at, updated_at) VALUES
('teacher1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'ThS. Nguyễn Văn An', 'nguyen.an@university.edu.vn', '0901234567', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', '0902345678', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', '0903456789', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher4', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', '0904567890', 'TEACHER', 1, NULL, NOW(), NOW());

-- =====================================================
-- 2. TẠO SINH VIÊN (STUDENT)
-- =====================================================

INSERT INTO users (username, password, full_name, email, phone, student_id, major, class_name, role, active, student_year, created_at, updated_at) VALUES
('student1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Hoàng Văn Minh', 'hoang.minh@student.edu.vn', '0911111111', 'SV001', 'Công nghệ thông tin', 'CNTT-K20A', 'STUDENT', 1, 3, NOW(), NOW()),
('student2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Ngô Thị Lan', 'ngo.lan@student.edu.vn', '0922222222', 'SV002', 'Công nghệ thông tin', 'CNTT-K20A', 'STUDENT', 1, 3, NOW(), NOW()),
('student3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đặng Văn Hùng', 'dang.hung@student.edu.vn', '0933333333', 'SV003', 'Công nghệ thông tin', 'CNTT-K20B', 'STUDENT', 1, 3, NOW(), NOW()),
('student4', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Vũ Thị Hoa', 'vu.hoa@student.edu.vn', '0944444444', 'SV004', 'Kỹ thuật phần mềm', 'KTPM-K21A', 'STUDENT', 1, 2, NOW(), NOW()),
('student5', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Bùi Văn Nam', 'bui.nam@student.edu.vn', '0955555555', 'SV005', 'Kỹ thuật phần mềm', 'KTPM-K21A', 'STUDENT', 1, 2, NOW(), NOW()),
('student6', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lý Thị Mai', 'ly.mai@student.edu.vn', '0966666666', 'SV006', 'Hệ thống thông tin', 'HTTT-K22A', 'STUDENT', 1, 1, NOW(), NOW()),
('student7', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Trịnh Văn Tùng', 'trinh.tung@student.edu.vn', '0977777777', 'SV007', 'Hệ thống thông tin', 'HTTT-K22A', 'STUDENT', 1, 1, NOW(), NOW()),
('student8', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đinh Thị Thảo', 'dinh.thao@student.edu.vn', '0988888888', 'SV008', 'An toàn thông tin', 'ATTT-K21B', 'STUDENT', 1, 2, NOW(), NOW());

-- =====================================================
-- 3. TẠO MÔN HỌC (SUBJECTS) - Có thời gian đăng ký
-- =====================================================

-- Môn học của teacher1 (ThS. Nguyễn Văn An)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT001', 'Lập trình Web', 'Học cách xây dựng ứng dụng web với HTML, CSS, JavaScript và các framework hiện đại', 4, 2, (SELECT id FROM users WHERE username='teacher1'), 'ThS. Nguyễn Văn An', 'nguyen.an@university.edu.vn', 'A101', 'HK1 2025-2026', '#2563eb', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT002', 'Cơ sở dữ liệu', 'Thiết kế và quản lý cơ sở dữ liệu quan hệ với MySQL, PostgreSQL', 3, 2, (SELECT id FROM users WHERE username='teacher1'), 'ThS. Nguyễn Văn An', 'nguyen.an@university.edu.vn', 'A102', 'HK1 2025-2026', '#16a34a', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- Môn học của teacher2 (TS. Trần Thị Bình)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT003', 'Trí tuệ nhân tạo', 'Giới thiệu về Machine Learning, Deep Learning và các ứng dụng AI', 4, 3, (SELECT id FROM users WHERE username='teacher2'), 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', 'B201', 'HK1 2025-2026', '#dc2626', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT004', 'Xử lý ngôn ngữ tự nhiên', 'NLP cơ bản đến nâng cao với Python và các thư viện hiện đại', 3, 3, (SELECT id FROM users WHERE username='teacher2'), 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', 'B202', 'HK1 2025-2026', '#7c3aed', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- Môn học của teacher3 (PGS.TS. Lê Văn Cường)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT005', 'Mạng máy tính', 'Kiến thức về mạng, giao thức TCP/IP, bảo mật mạng', 3, 2, (SELECT id FROM users WHERE username='teacher3'), 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', 'C301', 'HK1 2025-2026', '#0891b2', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT006', 'An toàn thông tin', 'Mã hóa, bảo mật hệ thống, phòng chống tấn công mạng', 4, 3, (SELECT id FROM users WHERE username='teacher3'), 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', 'C302', 'HK1 2025-2026', '#ea580c', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- Môn học của teacher4 (ThS. Phạm Thị Dung)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT007', 'Phát triển ứng dụng di động', 'Xây dựng ứng dụng Android và iOS với React Native', 4, 3, (SELECT id FROM users WHERE username='teacher4'), 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', 'D401', 'HK1 2025-2026', '#db2777', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT008', 'Kiểm thử phần mềm', 'Unit Testing, Integration Testing, Automation Testing', 3, 2, (SELECT id FROM users WHERE username='teacher4'), 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', 'D402', 'HK1 2025-2026', '#65a30d', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- =====================================================
-- 4. ĐĂNG KÝ MÔN HỌC CHO SINH VIÊN (ENROLLMENTS)
-- =====================================================

-- Student1, Student2, Student3 đăng ký môn IT001, IT002, IT003
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT001')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT002')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT003')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student2'), (SELECT id FROM subjects WHERE code='IT001')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student2'), (SELECT id FROM subjects WHERE code='IT002')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student2'), (SELECT id FROM subjects WHERE code='IT005')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student3'), (SELECT id FROM subjects WHERE code='IT001')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student3'), (SELECT id FROM subjects WHERE code='IT003')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student3'), (SELECT id FROM subjects WHERE code='IT004'));

-- Student4, Student5 đăng ký môn IT004, IT005, IT007
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student4'), (SELECT id FROM subjects WHERE code='IT004')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student4'), (SELECT id FROM subjects WHERE code='IT005')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student4'), (SELECT id FROM subjects WHERE code='IT007')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student5'), (SELECT id FROM subjects WHERE code='IT005')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student5'), (SELECT id FROM subjects WHERE code='IT006')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student5'), (SELECT id FROM subjects WHERE code='IT007'));

-- Student6, Student7, Student8 đăng ký các môn khác
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student6'), (SELECT id FROM subjects WHERE code='IT001')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student6'), (SELECT id FROM subjects WHERE code='IT006')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student6'), (SELECT id FROM subjects WHERE code='IT008')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student7'), (SELECT id FROM subjects WHERE code='IT002')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student7'), (SELECT id FROM subjects WHERE code='IT007')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student7'), (SELECT id FROM subjects WHERE code='IT008')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student8'), (SELECT id FROM subjects WHERE code='IT003')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student8'), (SELECT id FROM subjects WHERE code='IT006')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student8'), (SELECT id FROM subjects WHERE code='IT008'));

-- =====================================================
-- 5. TẠO LỊCH HỌC (SCHEDULES)
-- =====================================================

INSERT INTO schedules (day_of_week, start_time, end_time, room, type, subject_id, created_at, updated_at) VALUES
-- IT001 - Lập trình Web
('MONDAY', '08:00:00', '10:00:00', 'A101', 'THEORY', (SELECT id FROM subjects WHERE code='IT001'), NOW(), NOW()),
('WEDNESDAY', '13:00:00', '15:00:00', 'Lab A1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT001'), NOW(), NOW()),
-- IT002 - Cơ sở dữ liệu
('TUESDAY', '10:00:00', '12:00:00', 'A102', 'THEORY', (SELECT id FROM subjects WHERE code='IT002'), NOW(), NOW()),
('FRIDAY', '08:00:00', '10:00:00', 'Lab A2', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT002'), NOW(), NOW()),
-- IT003 - Trí tuệ nhân tạo
('WEDNESDAY', '08:00:00', '10:00:00', 'B201', 'THEORY', (SELECT id FROM subjects WHERE code='IT003'), NOW(), NOW()),
('THURSDAY', '13:00:00', '15:00:00', 'Lab B1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT003'), NOW(), NOW()),
-- IT004 - Xử lý ngôn ngữ tự nhiên
('THURSDAY', '08:00:00', '10:00:00', 'B202', 'THEORY', (SELECT id FROM subjects WHERE code='IT004'), NOW(), NOW()),
-- IT005 - Mạng máy tính
('MONDAY', '13:00:00', '15:00:00', 'C301', 'THEORY', (SELECT id FROM subjects WHERE code='IT005'), NOW(), NOW()),
('FRIDAY', '13:00:00', '15:00:00', 'Lab C1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT005'), NOW(), NOW()),
-- IT006 - An toàn thông tin
('TUESDAY', '08:00:00', '10:00:00', 'C302', 'THEORY', (SELECT id FROM subjects WHERE code='IT006'), NOW(), NOW()),
('THURSDAY', '10:00:00', '12:00:00', 'Lab C2', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT006'), NOW(), NOW()),
-- IT007 - Phát triển ứng dụng di động
('FRIDAY', '10:00:00', '12:00:00', 'D401', 'THEORY', (SELECT id FROM subjects WHERE code='IT007'), NOW(), NOW()),
('SATURDAY', '08:00:00', '11:00:00', 'Lab D1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT007'), NOW(), NOW()),
-- IT008 - Kiểm thử phần mềm
('TUESDAY', '13:00:00', '15:00:00', 'D402', 'THEORY', (SELECT id FROM subjects WHERE code='IT008'), NOW(), NOW());

-- =====================================================
-- 6. TẠO BÀI TẬP (ASSIGNMENTS)
-- =====================================================

INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
-- Bài tập môn IT001
('Thiết kế giao diện trang web', 'Sử dụng HTML, CSS để thiết kế trang web giới thiệu bản thân', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 7 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001'), NOW(), NOW()),
('Kiểm tra giữa kỳ - Lập trình Web', 'Kiểm tra kiến thức HTML, CSS, JavaScript cơ bản', 'EXAM', DATE_ADD(NOW(), INTERVAL 14 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001'), NOW(), NOW()),
('Xây dựng ứng dụng Todo List', 'Tạo ứng dụng Todo List với React.js', 'PROJECT', DATE_ADD(NOW(), INTERVAL 21 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001'), NOW(), NOW()),

-- Bài tập môn IT002
('Thiết kế ERD cho hệ thống quản lý', 'Vẽ sơ đồ ERD cho hệ thống quản lý thư viện', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 5 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT002'), NOW(), NOW()),
('Truy vấn SQL nâng cao', 'Bài tập về JOIN, Subquery, Stored Procedure', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 10 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT002'), NOW(), NOW()),

-- Bài tập môn IT003
('Bài tập Machine Learning cơ bản', 'Xây dựng mô hình phân loại với Scikit-learn', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 8 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher2'), (SELECT id FROM subjects WHERE code='IT003'), NOW(), NOW()),
('Kiểm tra cuối kỳ - AI', 'Thi cuối kỳ môn Trí tuệ nhân tạo', 'EXAM', DATE_ADD(NOW(), INTERVAL 30 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher2'), (SELECT id FROM subjects WHERE code='IT003'), NOW(), NOW()),

-- Bài tập môn IT005
('Cấu hình mạng LAN', 'Thực hành cấu hình mạng LAN với Packet Tracer', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 6 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher3'), (SELECT id FROM subjects WHERE code='IT005'), NOW(), NOW()),

-- Bài tập môn IT007
('Xây dựng ứng dụng React Native', 'Tạo ứng dụng quản lý công việc đơn giản', 'PROJECT', DATE_ADD(NOW(), INTERVAL 25 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher4'), (SELECT id FROM subjects WHERE code='IT007'), NOW(), NOW());

-- =====================================================
-- 7. TẠO GHI CHÚ MẪU (NOTES)
-- =====================================================

INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, is_read, user_id, subject_id, created_at, updated_at) VALUES
('Ghi chú HTML cơ bản', 'Các thẻ HTML quan trọng:\n- <div>: container\n- <span>: inline element\n- <a>: hyperlink\n- <img>: hình ảnh', 'STUDY', '#2563eb', 1, 1, 0, (SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT001'), NOW(), NOW()),
('Câu lệnh SQL thường dùng', 'SELECT, INSERT, UPDATE, DELETE\nJOIN: INNER, LEFT, RIGHT, FULL\nGROUP BY, HAVING, ORDER BY', 'STUDY', '#16a34a', 0, 1, 0, (SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT002'), NOW(), NOW()),
('Công thức Machine Learning', 'MSE = 1/n * Σ(y_pred - y_actual)²\nAccuracy = TP+TN / Total', 'STUDY', '#dc2626', 1, 0, 0, (SELECT id FROM users WHERE username='student2'), (SELECT id FROM subjects WHERE code='IT003'), NOW(), NOW());

-- =====================================================
-- 8. TẠO TÀI LIỆU CHIA SẺ MẪU (DOCUMENTS - Social Features)
-- =====================================================

INSERT INTO documents (user_id, subject_id, title, description, type, file_url, file_name, file_size, file_extension, is_public, download_count, view_count, tags, like_count, comment_count, is_shared, created_at, updated_at) VALUES
-- Tài liệu chia sẻ bởi teacher1
((SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001'), 'Slide Bài 1: HTML Cơ bản', 'Slide giới thiệu về HTML, các thẻ cơ bản và cấu trúc trang web', 'LECTURE_SLIDES', '/uploads/documents/html_basics.pdf', 'html_basics.pdf', 2048000, '.pdf', 1, 45, 120, 'html,web,frontend', 15, 3, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001'), 'Slide Bài 2: CSS Styling', 'Hướng dẫn sử dụng CSS để tạo style cho trang web', 'LECTURE_SLIDES', '/uploads/documents/css_styling.pdf', 'css_styling.pdf', 3072000, '.pdf', 1, 38, 95, 'css,web,styling', 12, 2, 1, NOW(), NOW()),

-- Tài liệu chia sẻ bởi teacher2
((SELECT id FROM users WHERE username='teacher2'), (SELECT id FROM subjects WHERE code='IT003'), 'Giáo trình Machine Learning', 'Tài liệu học máy cơ bản đến nâng cao', 'TEXTBOOK', '/uploads/documents/ml_textbook.pdf', 'ml_textbook.pdf', 15000000, '.pdf', 1, 89, 230, 'machine learning,ai,python', 42, 8, 1, NOW(), NOW()),

-- Tài liệu chia sẻ bởi student1
((SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT002'), 'Tổng hợp bài tập SQL', 'Các bài tập SQL từ cơ bản đến nâng cao với đáp án', 'EXERCISE', '/uploads/documents/sql_exercises.pdf', 'sql_exercises.pdf', 1024000, '.pdf', 1, 67, 180, 'sql,database,exercise', 28, 5, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='student1'), NULL, 'Tips học lập trình hiệu quả', 'Chia sẻ kinh nghiệm tự học lập trình cho sinh viên', 'OTHER', '/uploads/documents/programming_tips.pdf', 'programming_tips.pdf', 512000, '.pdf', 1, 156, 420, 'programming,tips,learning', 75, 12, 1, NOW(), NOW()),

-- Tài liệu chia sẻ bởi student2
((SELECT id FROM users WHERE username='student2'), (SELECT id FROM subjects WHERE code='IT003'), 'Đề thi AI các năm', 'Tổng hợp đề thi môn Trí tuệ nhân tạo từ 2020-2024', 'EXAM', '/uploads/documents/ai_exams.pdf', 'ai_exams.pdf', 4096000, '.pdf', 1, 234, 567, 'ai,exam,đề thi', 98, 15, 1, NOW(), NOW());

-- =====================================================
-- 9. TẠO LIKE CHO TÀI LIỆU (DOCUMENT_LIKES)
-- =====================================================

-- Một số like mẫu
INSERT INTO document_likes (user_id, document_id, created_at) 
SELECT u.id, d.id, NOW()
FROM users u, documents d
WHERE u.username IN ('student1', 'student2', 'student3') 
AND d.title = 'Giáo trình Machine Learning'
LIMIT 3;

INSERT INTO document_likes (user_id, document_id, created_at) 
SELECT u.id, d.id, NOW()
FROM users u, documents d
WHERE u.username IN ('student4', 'student5', 'teacher1') 
AND d.title = 'Tips học lập trình hiệu quả'
LIMIT 3;

-- =====================================================
-- 10. TẠO COMMENT CHO TÀI LIỆU (DOCUMENT_COMMENTS)
-- =====================================================

INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student1'),
    (SELECT id FROM documents WHERE title='Giáo trình Machine Learning'),
    'Tài liệu rất hay và chi tiết! Cảm ơn thầy đã chia sẻ.',
    NULL,
    NOW(),
    NOW();

INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student2'),
    (SELECT id FROM documents WHERE title='Tổng hợp bài tập SQL'),
    'Bài tập rất hữu ích, đặc biệt là phần JOIN.',
    NULL,
    NOW(),
    NOW();

INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student3'),
    (SELECT id FROM documents WHERE title='Tips học lập trình hiệu quả'),
    'Mình áp dụng các tips này và thấy hiệu quả hơn rất nhiều!',
    NULL,
    NOW(),
    NOW();
    
    
    
    
    
    
    -- chat gpt moi 
INSERT INTO users (username, password, full_name, email, phone, role, active, student_year, created_at, updated_at) VALUES
-- Giảng viên bộ môn Lập trình
('teacher5', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'TS. Đỗ Văn Hải', 'do.hai@university.edu.vn', '0905678901', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher6', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'ThS. Bùi Thị Lan', 'bui.lan@university.edu.vn', '0906789012', 'TEACHER', 1, NULL, NOW(), NOW()),

-- Giảng viên bộ môn Toán & Thuật toán
('teacher7', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'PGS.TS. Võ Văn Nam', 'vo.nam@university.edu.vn', '0907890123', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher8', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'TS. Lương Thị Mai', 'luong.mai@university.edu.vn', '0908901234', 'TEACHER', 1, NULL, NOW(), NOW()),

-- Giảng viên bộ môn Hệ thống thông tin
('teacher9', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'ThS. Đặng Văn Phúc', 'dang.phuc@university.edu.vn', '0909012345', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher10', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'TS. Ngô Thị Hương', 'ngo.huong@university.edu.vn', '0910123456', 'TEACHER', 1, NULL, NOW(), NOW()),

-- Giảng viên bộ môn Khoa học dữ liệu
('teacher11', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'PGS.TS. Trương Văn Khoa', 'truong.khoa@university.edu.vn', '0911234567', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher12', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'TS. Phan Thị Yến', 'phan.yen@university.edu.vn', '0912345678', 'TEACHER', 1, NULL, NOW(), NOW()),

-- Giảng viên bộ môn Đồ họa & Trò chơi
('teacher13', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'ThS. Lê Văn Tuấn', 'le.tuan@university.edu.vn', '0913456789', 'TEACHER', 1, NULL, NOW(), NOW()),
('teacher14', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'TS. Hoàng Thị Nga', 'hoang.nga@university.edu.vn', '0914567890', 'TEACHER', 1, NULL, NOW(), NOW()),

-- Giảng viên bộ môn IoT & Nhúng
('teacher15', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'PGS.TS. Nguyễn Văn Đức', 'nguyen.duc@university.edu.vn', '0915678901', 'TEACHER', 1, NULL, NOW(), NOW());

-- =====================================================
-- 2. THÊM SINH VIÊN (40 sinh viên - 8 sinh viên mỗi năm)
-- =====================================================

-- NĂM 1 (8 sinh viên)
INSERT INTO users (username, password, full_name, email, phone, student_id, major, class_name, role, active, student_year, created_at, updated_at) VALUES
('student9', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Nguyễn Văn Quân', 'nguyen.quan@student.edu.vn', '0919191919', 'SV009', 'Công nghệ thông tin', 'CNTT-K24A', 'STUDENT', 1, 1, NOW(), NOW()),
('student10', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Trần Thị Phương', 'tran.phuong@student.edu.vn', '0920202020', 'SV010', 'Công nghệ thông tin', 'CNTT-K24A', 'STUDENT', 1, 1, NOW(), NOW()),
('student11', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lê Văn Sơn', 'le.son@student.edu.vn', '0921212121', 'SV011', 'Kỹ thuật phần mềm', 'KTPM-K24A', 'STUDENT', 1, 1, NOW(), NOW()),
('student12', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Phạm Thị Thu', 'pham.thu@student.edu.vn', '0922222222', 'SV012', 'Kỹ thuật phần mềm', 'KTPM-K24A', 'STUDENT', 1, 1, NOW(), NOW()),
('student13', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Vũ Văn Tài', 'vu.tai@student.edu.vn', '0923232323', 'SV013', 'Hệ thống thông tin', 'HTTT-K24A', 'STUDENT', 1, 1, NOW(), NOW()),
('student14', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đỗ Thị Uyên', 'do.uyen@student.edu.vn', '0924242424', 'SV014', 'Hệ thống thông tin', 'HTTT-K24A', 'STUDENT', 1, 1, NOW(), NOW()),
('student15', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Bùi Văn Vinh', 'bui.vinh@student.edu.vn', '0925252525', 'SV015', 'Khoa học dữ liệu', 'KHMT-K24A', 'STUDENT', 1, 1, NOW(), NOW()),
('student16', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lý Thị Xuân', 'ly.xuan@student.edu.vn', '0926262626', 'SV016', 'Khoa học dữ liệu', 'KHMT-K24A', 'STUDENT', 1, 1, NOW(), NOW());

-- NĂM 2 (8 sinh viên)
INSERT INTO users (username, password, full_name, email, phone, student_id, major, class_name, role, active, student_year, created_at, updated_at) VALUES
('student17', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Trịnh Văn Yên', 'trinh.yen@student.edu.vn', '0927272727', 'SV017', 'Công nghệ thông tin', 'CNTT-K23A', 'STUDENT', 1, 2, NOW(), NOW()),
('student18', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đinh Thị Ánh', 'dinh.anh@student.edu.vn', '0928282828', 'SV018', 'Công nghệ thông tin', 'CNTT-K23A', 'STUDENT', 1, 2, NOW(), NOW()),
('student19', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Hoàng Văn Bảo', 'hoang.bao@student.edu.vn', '0929292929', 'SV019', 'Kỹ thuật phần mềm', 'KTPM-K23A', 'STUDENT', 1, 2, NOW(), NOW()),
('student20', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Ngô Thị Chi', 'ngo.chi@student.edu.vn', '0930303030', 'SV020', 'Kỹ thuật phần mềm', 'KTPM-K23B', 'STUDENT', 1, 2, NOW(), NOW()),
('student21', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lương Văn Dũng', 'luong.dung@student.edu.vn', '0931313131', 'SV021', 'An toàn thông tin', 'ATTT-K23A', 'STUDENT', 1, 2, NOW(), NOW()),
('student22', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Võ Thị Diệu', 'vo.dieu@student.edu.vn', '0932323232', 'SV022', 'An toàn thông tin', 'ATTT-K23A', 'STUDENT', 1, 2, NOW(), NOW()),
('student23', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đặng Văn Em', 'dang.em@student.edu.vn', '0933333333', 'SV023', 'Hệ thống thông tin', 'HTTT-K23A', 'STUDENT', 1, 2, NOW(), NOW()),
('student24', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Phan Thị Phượng', 'phan.phuong@student.edu.vn', '0934343434', 'SV024', 'Khoa học dữ liệu', 'KHMT-K23A', 'STUDENT', 1, 2, NOW(), NOW());

-- NĂM 3 (8 sinh viên - đã có trong file gốc, thêm nữa)
INSERT INTO users (username, password, full_name, email, phone, student_id, major, class_name, role, active, student_year, created_at, updated_at) VALUES
('student25', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Trương Văn Giang', 'truong.giang@student.edu.vn', '0935353535', 'SV025', 'Công nghệ thông tin', 'CNTT-K22A', 'STUDENT', 1, 3, NOW(), NOW()),
('student26', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Nguyễn Thị Hằng', 'nguyen.hang@student.edu.vn', '0936363636', 'SV026', 'Công nghệ thông tin', 'CNTT-K22B', 'STUDENT', 1, 3, NOW(), NOW()),
('student27', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lê Văn Khánh', 'le.khanh@student.edu.vn', '0937373737', 'SV027', 'Kỹ thuật phần mềm', 'KTPM-K22A', 'STUDENT', 1, 3, NOW(), NOW()),
('student28', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Phạm Thị Linh', 'pham.linh@student.edu.vn', '0938383838', 'SV028', 'An toàn thông tin', 'ATTT-K22A', 'STUDENT', 1, 3, NOW(), NOW());

-- NĂM 4 (8 sinh viên)
INSERT INTO users (username, password, full_name, email, phone, student_id, major, class_name, role, active, student_year, created_at, updated_at) VALUES
('student29', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Vũ Văn Minh', 'vu.minh@student.edu.vn', '0939393939', 'SV029', 'Công nghệ thông tin', 'CNTT-K21A', 'STUDENT', 1, 4, NOW(), NOW()),
('student30', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đỗ Thị Ngọc', 'do.ngoc@student.edu.vn', '0940404040', 'SV030', 'Công nghệ thông tin', 'CNTT-K21A', 'STUDENT', 1, 4, NOW(), NOW()),
('student31', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Bùi Văn Phong', 'bui.phong@student.edu.vn', '0941414141', 'SV031', 'Kỹ thuật phần mềm', 'KTPM-K21A', 'STUDENT', 1, 4, NOW(), NOW()),
('student32', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lý Thị Quỳnh', 'ly.quynh@student.edu.vn', '0942424242', 'SV032', 'Kỹ thuật phần mềm', 'KTPM-K21B', 'STUDENT', 1, 4, NOW(), NOW()),
('student33', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Trịnh Văn Sáng', 'trinh.sang@student.edu.vn', '0943434343', 'SV033', 'An toàn thông tin', 'ATTT-K21A', 'STUDENT', 1, 4, NOW(), NOW()),
('student34', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đinh Thị Trang', 'dinh.trang@student.edu.vn', '0944444444', 'SV034', 'An toàn thông tin', 'ATTT-K21B', 'STUDENT', 1, 4, NOW(), NOW()),
('student35', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Hoàng Văn Tuấn', 'hoang.tuan@student.edu.vn', '0945454545', 'SV035', 'Hệ thống thông tin', 'HTTT-K21A', 'STUDENT', 1, 4, NOW(), NOW()),
('student36', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Ngô Thị Uyên', 'ngo.uyen@student.edu.vn', '0946464646', 'SV036', 'Khoa học dữ liệu', 'KHMT-K21A', 'STUDENT', 1, 4, NOW(), NOW());

-- NĂM 5 (8 sinh viên)
INSERT INTO users (username, password, full_name, email, phone, student_id, major, class_name, role, active, student_year, created_at, updated_at) VALUES
('student37', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lương Văn Vinh', 'luong.vinh@student.edu.vn', '0947474747', 'SV037', 'Công nghệ thông tin', 'CNTT-K20A', 'STUDENT', 1, 5, NOW(), NOW()),
('student38', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Võ Thị Xuân', 'vo.xuan@student.edu.vn', '0948484848', 'SV038', 'Công nghệ thông tin', 'CNTT-K20B', 'STUDENT', 1, 5, NOW(), NOW()),
('student39', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đặng Văn Yên', 'dang.yen@student.edu.vn', '0949494949', 'SV039', 'Kỹ thuật phần mềm', 'KTPM-K20A', 'STUDENT', 1, 5, NOW(), NOW()),
('student40', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Phan Thị Ánh', 'phan.anh@student.edu.vn', '0950505050', 'SV040', 'Kỹ thuật phần mềm', 'KTPM-K20A', 'STUDENT', 1, 5, NOW(), NOW()),
('student41', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Trương Văn Bình', 'truong.binh@student.edu.vn', '0951515151', 'SV041', 'An toàn thông tin', 'ATTT-K20A', 'STUDENT', 1, 5, NOW(), NOW()),
('student42', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Nguyễn Thị Chi', 'nguyen.chi@student.edu.vn', '0952525252', 'SV042', 'Hệ thống thông tin', 'HTTT-K20A', 'STUDENT', 1, 5, NOW(), NOW()),
('student43', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lê Văn Dũng', 'le.dung@student.edu.vn', '0953535353', 'SV043', 'Khoa học dữ liệu', 'KHMT-K20A', 'STUDENT', 1, 5, NOW(), NOW()),
('student44', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Phạm Thị Diệu', 'pham.dieu@student.edu.vn', '0954545454', 'SV044', 'Khoa học dữ liệu', 'KHMT-K20A', 'STUDENT', 1, 5, NOW(), NOW());

-- =====================================================
-- 3. THÊM MÔN HỌC (Mở rộng cho tất cả các năm)
-- =====================================================

-- MÔN HỌC NĂM 1
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('MATH101', 'Toán rời rạc', 'Lý thuyết tập hợp, quan hệ, đại số Bool, đồ thị', 3, 1, (SELECT id FROM users WHERE username='teacher7'), 'PGS.TS. Võ Văn Nam', 'vo.nam@university.edu.vn', 'E101', 'HK1 2025-2026', '#f59e0b', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('MATH102', 'Giải tích', 'Vi phân, tích phân, chuỗi, hàm nhiều biến', 4, 1, (SELECT id FROM users WHERE username='teacher7'), 'PGS.TS. Võ Văn Nam', 'vo.nam@university.edu.vn', 'E102', 'HK1 2025-2026', '#f97316', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT101', 'Nhập môn lập trình', 'Lập trình C cơ bản, thuật toán, cấu trúc dữ liệu đơn giản', 4, 1, (SELECT id FROM users WHERE username='teacher5'), 'TS. Đỗ Văn Hải', 'do.hai@university.edu.vn', 'E103', 'HK1 2025-2026', '#3b82f6', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT102', 'Nhập môn CNTT', 'Tổng quan về ngành CNTT, nghề nghiệp, công nghệ hiện đại', 2, 1, (SELECT id FROM users WHERE username='teacher6'), 'ThS. Bùi Thị Lan', 'bui.lan@university.edu.vn', 'E104', 'HK1 2025-2026', '#6366f1', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('ENG101', 'Tiếng Anh chuyên ngành IT 1', 'Thuật ngữ IT, đọc hiểu tài liệu kỹ thuật', 2, 1, (SELECT id FROM users WHERE username='teacher6'), 'ThS. Bùi Thị Lan', 'bui.lan@university.edu.vn', 'E105', 'HK1 2025-2026', '#8b5cf6', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());
-- =====================================================
-- MÔN HỌC NĂM 2 (tiếp tục từ IT008)
-- =====================================================

INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT201', 'Cấu trúc dữ liệu và giải thuật', 'Stack, Queue, Tree, Graph, thuật toán sắp xếp, tìm kiếm', 4, 2, (SELECT id FROM users WHERE username='teacher5'), 'TS. Đỗ Văn Hải', 'do.hai@university.edu.vn', 'F201', 'HK1 2025-2026', '#10b981', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT202', 'Lập trình hướng đối tượng', 'OOP với Java: Class, Object, Inheritance, Polymorphism, Interface', 4, 2, (SELECT id FROM users WHERE username='teacher5'), 'TS. Đỗ Văn Hải', 'do.hai@university.edu.vn', 'F202', 'HK1 2025-2026', '#14b8a6', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT203', 'Hệ điều hành', 'Process, Thread, Memory Management, File System', 3, 2, (SELECT id FROM users WHERE username='teacher9'), 'ThS. Đặng Văn Phúc', 'dang.phuc@university.edu.vn', 'F203', 'HK1 2025-2026', '#06b6d4', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT204', 'Phân tích thiết kế hệ thống', 'UML, Use Case, Sequence Diagram, thiết kế hệ thống thông tin', 3, 2, (SELECT id FROM users WHERE username='teacher9'), 'ThS. Đặng Văn Phúc', 'dang.phuc@university.edu.vn', 'F204', 'HK1 2025-2026', '#0ea5e9', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('MATH201', 'Xác suất thống kê', 'Xác suất, biến ngẫu nhiên, phân phối, kiểm định giả thuyết', 3, 2, (SELECT id FROM users WHERE username='teacher8'), 'TS. Lương Thị Mai', 'luong.mai@university.edu.vn', 'F205', 'HK1 2025-2026', '#8b5cf6', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('MATH202', 'Đại số tuyến tính', 'Ma trận, không gian vector, ánh xạ tuyến tính', 3, 2, (SELECT id FROM users WHERE username='teacher8'), 'TS. Lương Thị Mai', 'luong.mai@university.edu.vn', 'F206', 'HK1 2025-2026', '#a855f7', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- =====================================================
-- MÔN HỌC NĂM 3 (nâng cao)
-- =====================================================

INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT301', 'Công nghệ phần mềm', 'Quy trình phát triển phần mềm, Agile, Scrum, DevOps', 4, 3, (SELECT id FROM users WHERE username='teacher4'), 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', 'G301', 'HK1 2025-2026', '#f43f5e', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT302', 'Thiết kế giao diện người dùng', 'UI/UX Design, Figma, thiết kế responsive, accessibility', 3, 3, (SELECT id FROM users WHERE username='teacher13'), 'ThS. Lê Văn Tuấn', 'le.tuan@university.edu.vn', 'G302', 'HK1 2025-2026', '#ec4899', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT303', 'Cloud Computing', 'AWS, Azure, GCP, Container, Kubernetes, Microservices', 4, 3, (SELECT id FROM users WHERE username='teacher10'), 'TS. Ngô Thị Hương', 'ngo.huong@university.edu.vn', 'G303', 'HK1 2025-2026', '#3b82f6', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT304', 'Blockchain và ứng dụng', 'Cơ chế blockchain, Smart Contract, Ethereum, Web3', 3, 3, (SELECT id FROM users WHERE username='teacher3'), 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', 'G304', 'HK1 2025-2026', '#f59e0b', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT305', 'Big Data', 'Hadoop, Spark, xử lý dữ liệu lớn, data pipeline', 4, 3, (SELECT id FROM users WHERE username='teacher11'), 'PGS.TS. Trương Văn Khoa', 'truong.khoa@university.edu.vn', 'G305', 'HK1 2025-2026', '#eab308', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT306', 'Computer Vision', 'Xử lý ảnh, nhận dạng đối tượng, OpenCV, YOLO', 4, 3, (SELECT id FROM users WHERE username='teacher2'), 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', 'G306', 'HK1 2025-2026', '#84cc16', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- =====================================================
-- MÔN HỌC NĂM 4 (chuyên sâu)
-- =====================================================

INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT401', 'DevOps và CI/CD', 'Jenkins, GitLab CI, Docker, deployment automation', 3, 4, (SELECT id FROM users WHERE username='teacher10'), 'TS. Ngô Thị Hương', 'ngo.huong@university.edu.vn', 'H401', 'HK1 2025-2026', '#22c55e', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT402', 'IoT và hệ thống nhúng', 'Arduino, Raspberry Pi, cảm biến, kết nối thiết bị', 4, 4, (SELECT id FROM users WHERE username='teacher15'), 'PGS.TS. Nguyễn Văn Đức', 'nguyen.duc@university.edu.vn', 'H402', 'HK1 2025-2026', '#10b981', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT403', 'Phát triển game', 'Unity, Unreal Engine, game design, physics engine', 4, 4, (SELECT id FROM users WHERE username='teacher14'), 'TS. Hoàng Thị Nga', 'hoang.nga@university.edu.vn', 'H403', 'HK1 2025-2026', '#14b8a6', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT404', 'Đồ họa máy tính', 'OpenGL, WebGL, Three.js, rendering, animation', 4, 4, (SELECT id FROM users WHERE username='teacher13'), 'ThS. Lê Văn Tuấn', 'le.tuan@university.edu.vn', 'H404', 'HK1 2025-2026', '#06b6d4', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT405', 'Machine Learning nâng cao', 'Deep Learning, Neural Networks, CNN, RNN, Transfer Learning', 4, 4, (SELECT id FROM users WHERE username='teacher2'), 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', 'H405', 'HK1 2025-2026', '#0ea5e9', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT406', 'Quản trị dự án CNTT', 'Project management, Agile, Scrum Master, quản lý rủi ro', 3, 4, (SELECT id FROM users WHERE username='teacher9'), 'ThS. Đặng Văn Phúc', 'dang.phuc@university.edu.vn', 'H406', 'HK1 2025-2026', '#3b82f6', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- =====================================================
-- MÔN HỌC NĂM 5 (chuyên ngành & đồ án)
-- =====================================================

INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color, registration_start_date, registration_end_date, created_at, updated_at) VALUES
('IT501', 'Đồ án chuyên ngành', 'Thực hiện đồ án tốt nghiệp, nghiên cứu giải pháp thực tế', 8, 5, (SELECT id FROM users WHERE username='teacher1'), 'ThS. Nguyễn Văn An', 'nguyen.an@university.edu.vn', 'I501', 'HK1 2025-2026', '#dc2626', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT502', 'Thực tập doanh nghiệp', 'Thực tập tại công ty, áp dụng kiến thức vào thực tế', 6, 5, (SELECT id FROM users WHERE username='teacher4'), 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', 'I502', 'HK1 2025-2026', '#ea580c', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT503', 'Công nghệ AI tiên tiến', 'GPT, LLM, Generative AI, prompt engineering', 4, 5, (SELECT id FROM users WHERE username='teacher11'), 'PGS.TS. Trương Văn Khoa', 'truong.khoa@university.edu.vn', 'I503', 'HK1 2025-2026', '#f97316', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT504', 'Blockchain nâng cao', 'DeFi, NFT, DAO, Layer 2 solutions, security', 3, 5, (SELECT id FROM users WHERE username='teacher3'), 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', 'I504', 'HK1 2025-2026', '#f59e0b', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT505', 'Kinh tế số và khởi nghiệp', 'Business model, startup, fundraising, pitch deck', 3, 5, (SELECT id FROM users WHERE username='teacher10'), 'TS. Ngô Thị Hương', 'ngo.huong@university.edu.vn', 'I505', 'HK1 2025-2026', '#eab308', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
('IT506', 'Seminar chuyên đề', 'Nghiên cứu khoa học, viết báo, thuyết trình', 2, 5, (SELECT id FROM users WHERE username='teacher12'), 'TS. Phan Thị Yến', 'phan.yen@university.edu.vn', 'I506', 'HK1 2025-2026', '#84cc16', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW());

-- =====================================================
-- ĐĂNG KÝ MÔN HỌC CHO SINH VIÊN MỚI
-- =====================================================

-- Năm 1 đăng ký môn năm 1
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student9'), (SELECT id FROM subjects WHERE code='MATH101')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student9'), (SELECT id FROM subjects WHERE code='IT101')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student9'), (SELECT id FROM subjects WHERE code='IT102')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student10'), (SELECT id FROM subjects WHERE code='MATH101')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student10'), (SELECT id FROM subjects WHERE code='MATH102')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student10'), (SELECT id FROM subjects WHERE code='IT101')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student11'), (SELECT id FROM subjects WHERE code='IT101')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student11'), (SELECT id FROM subjects WHERE code='IT102')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student11'), (SELECT id FROM subjects WHERE code='ENG101'));

-- Năm 2 đăng ký môn năm 2
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student17'), (SELECT id FROM subjects WHERE code='IT201')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student17'), (SELECT id FROM subjects WHERE code='IT202')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student17'), (SELECT id FROM subjects WHERE code='IT001')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student18'), (SELECT id FROM subjects WHERE code='IT201')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student18'), (SELECT id FROM subjects WHERE code='IT203')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student18'), (SELECT id FROM subjects WHERE code='MATH201')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student19'), (SELECT id FROM subjects WHERE code='IT002')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student19'), (SELECT id FROM subjects WHERE code='IT204')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student19'), (SELECT id FROM subjects WHERE code='IT008'));

-- Năm 3 đăng ký môn năm 3
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student25'), (SELECT id FROM subjects WHERE code='IT301')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student25'), (SELECT id FROM subjects WHERE code='IT303')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student25'), (SELECT id FROM subjects WHERE code='IT305')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student26'), (SELECT id FROM subjects WHERE code='IT302')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student26'), (SELECT id FROM subjects WHERE code='IT304')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student26'), (SELECT id FROM subjects WHERE code='IT306')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student27'), (SELECT id FROM subjects WHERE code='IT003')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student27'), (SELECT id FROM subjects WHERE code='IT301')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student27'), (SELECT id FROM subjects WHERE code='IT007'));

-- Năm 4 đăng ký môn năm 4
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student29'), (SELECT id FROM subjects WHERE code='IT401')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student29'), (SELECT id FROM subjects WHERE code='IT403')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student29'), (SELECT id FROM subjects WHERE code='IT405')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student30'), (SELECT id FROM subjects WHERE code='IT402')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student30'), (SELECT id FROM subjects WHERE code='IT404')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student30'), (SELECT id FROM subjects WHERE code='IT406')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student31'), (SELECT id FROM subjects WHERE code='IT401')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student31'), (SELECT id FROM subjects WHERE code='IT405')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student31'), (SELECT id FROM subjects WHERE code='IT006'));

-- Năm 5 đăng ký môn năm 5
INSERT INTO subject_enrollments (status, enrolled_at, student_id, subject_id) VALUES
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student37'), (SELECT id FROM subjects WHERE code='IT501')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student37'), (SELECT id FROM subjects WHERE code='IT502')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student37'), (SELECT id FROM subjects WHERE code='IT503')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student38'), (SELECT id FROM subjects WHERE code='IT501')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student38'), (SELECT id FROM subjects WHERE code='IT504')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student38'), (SELECT id FROM subjects WHERE code='IT505')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student39'), (SELECT id FROM subjects WHERE code='IT501')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student39'), (SELECT id FROM subjects WHERE code='IT502')),
('ACTIVE', NOW(), (SELECT id FROM users WHERE username='student39'), (SELECT id FROM subjects WHERE code='IT506'));

-- =====================================================
-- BÀI TẬP CHO CÁC MÔN MỚI
-- =====================================================

-- Bài tập môn IT201 - Cấu trúc dữ liệu
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Cài đặt Stack và Queue', 'Viết chương trình cài đặt Stack và Queue bằng linked list', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 5 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher5'), (SELECT id FROM subjects WHERE code='IT201'), NOW(), NOW()),
('Thuật toán tìm kiếm trên cây', 'Cài đặt BFS và DFS trên cây nhị phân', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 10 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher5'), (SELECT id FROM subjects WHERE code='IT201'), NOW(), NOW()),
('Kiểm tra giữa kỳ - CTDL', 'Kiểm tra lý thuyết và thực hành về cấu trúc dữ liệu', 'EXAM', DATE_ADD(NOW(), INTERVAL 20 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher5'), (SELECT id FROM subjects WHERE code='IT201'), NOW(), NOW());

-- Bài tập môn IT202 - OOP
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Xây dựng lớp sinh viên', 'Thiết kế class Student với các thuộc tính và phương thức cơ bản', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 7 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher5'), (SELECT id FROM subjects WHERE code='IT202'), NOW(), NOW()),
('Hệ thống quản lý thư viện OOP', 'Xây dựng hệ thống quản lý thư viện áp dụng đầy đủ tính chất OOP', 'PROJECT', DATE_ADD(NOW(), INTERVAL 28 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher5'), (SELECT id FROM subjects WHERE code='IT202'), NOW(), NOW());

-- Bài tập môn IT301 - Công nghệ phần mềm
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Phân tích yêu cầu hệ thống', 'Viết tài liệu phân tích yêu cầu cho một hệ thống quản lý', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 8 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher4'), (SELECT id FROM subjects WHERE code='IT301'), NOW(), NOW()),
('Dự án nhóm - Phát triển phần mềm', 'Làm việc nhóm theo quy trình Agile/Scrum', 'PROJECT', DATE_ADD(NOW(), INTERVAL 40 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher4'), (SELECT id FROM subjects WHERE code='IT301'), NOW(), NOW());

-- Bài tập môn IT303 - Cloud Computing
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Deploy ứng dụng lên AWS', 'Triển khai ứng dụng web lên AWS EC2 với RDS', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 12 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher10'), (SELECT id FROM subjects WHERE code='IT303'), NOW(), NOW()),
('Xây dựng kiến trúc microservices', 'Thiết kế và triển khai hệ thống microservices với Docker', 'PROJECT', DATE_ADD(NOW(), INTERVAL 35 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher10'), (SELECT id FROM subjects WHERE code='IT303'), NOW(), NOW());

-- Bài tập môn IT305 - Big Data
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Xử lý dữ liệu với Hadoop', 'Viết MapReduce job để xử lý dataset lớn', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 9 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher11'), (SELECT id FROM subjects WHERE code='IT305'), NOW(), NOW()),
('Phân tích dữ liệu với Spark', 'Sử dụng PySpark để phân tích và trực quan hóa dữ liệu', 'PROJECT', DATE_ADD(NOW(), INTERVAL 30 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher11'), (SELECT id FROM subjects WHERE code='IT305'), NOW(), NOW());

-- Bài tập môn IT401 - DevOps
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Cấu hình CI/CD pipeline', 'Thiết lập pipeline tự động với Jenkins hoặc GitLab CI', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 10 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher10'), (SELECT id FROM subjects WHERE code='IT401'), NOW(), NOW()),
('Docker và Kubernetes', 'Containerize ứng dụng và deploy lên Kubernetes cluster', 'PROJECT', DATE_ADD(NOW(), INTERVAL 25 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher10'), (SELECT id FROM subjects WHERE code='IT401'), NOW(), NOW());

-- Bài tập môn IT403 - Phát triển game
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Xây dựng game 2D đơn giản', 'Tạo game platformer 2D với Unity', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 15 DAY), 'MEDIUM', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher14'), (SELECT id FROM subjects WHERE code='IT403'), NOW(), NOW()),
('Dự án game 3D hoàn chỉnh', 'Phát triển game 3D với gameplay, UI, sound', 'PROJECT', DATE_ADD(NOW(), INTERVAL 50 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher14'), (SELECT id FROM subjects WHERE code='IT403'), NOW(), NOW());

-- Bài tập môn IT501 - Đồ án chuyên ngành
INSERT INTO assignments (title, description, type, deadline, priority, status, reminder_enabled, reminder_minutes, created_by, subject_id, created_at, updated_at) VALUES
('Đề cương đồ án', 'Nộp đề cương chi tiết cho đồ án tốt nghiệp', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 14 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT501'), NOW(), NOW()),
('Báo cáo tiến độ giữa kỳ', 'Trình bày kết quả đã thực hiện được', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 45 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT501'), NOW(), NOW()),
('Đồ án tốt nghiệp hoàn chỉnh', 'Nộp sản phẩm cuối cùng và thuyết trình', 'PROJECT', DATE_ADD(NOW(), INTERVAL 90 DAY), 'HIGH', 'TODO', 1, 60, (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT501'), NOW(), NOW());
-- =====================================================
-- LỊCH HỌC CHO CÁC MÔN MỚI
-- =====================================================
INSERT INTO schedules (day_of_week, start_time, end_time, room, type, subject_id, created_at, updated_at) VALUES
-- IT201 - Cấu trúc dữ liệu
('MONDAY', '10:00:00', '12:00:00', 'F201', 'THEORY', (SELECT id FROM subjects WHERE code='IT201'), NOW(), NOW()),
('THURSDAY', '08:00:00', '10:00:00', 'Lab F1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT201'), NOW(), NOW()),

-- IT202 - OOP
('TUESDAY', '08:00:00', '10:00:00', 'F202', 'THEORY', (SELECT id FROM subjects WHERE code='IT202'), NOW(), NOW()),
('WEDNESDAY', '10:00:00', '12:00:00', 'Lab F2', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT202'), NOW(), NOW()),

-- IT203 - Hệ điều hành
('MONDAY', '13:00:00', '15:00:00', 'F203', 'THEORY', (SELECT id FROM subjects WHERE code='IT203'), NOW(), NOW()),
('FRIDAY', '10:00:00', '12:00:00', 'Lab F3', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT203'), NOW(), NOW()),

-- IT204 - Phân tích thiết kế
('THURSDAY', '13:00:00', '15:00:00', 'F204', 'THEORY', (SELECT id FROM subjects WHERE code='IT204'), NOW(), NOW()),

-- MATH101 - Toán rời rạc
('TUESDAY', '13:00:00', '15:00:00', 'E101', 'THEORY', (SELECT id FROM subjects WHERE code='MATH101'), NOW(), NOW()),
('FRIDAY', '08:00:00', '10:00:00', 'E101', 'PRACTICE', (SELECT id FROM subjects WHERE code='MATH101'), NOW(), NOW()),

-- MATH102 - Giải tích
('MONDAY', '08:00:00', '10:00:00', 'E102', 'THEORY', (SELECT id FROM subjects WHERE code='MATH102'), NOW(), NOW()),
('WEDNESDAY', '08:00:00', '10:00:00', 'E102', 'PRACTICE', (SELECT id FROM subjects WHERE code='MATH102'), NOW(), NOW()),

-- IT101 - Nhập môn lập trình
('WEDNESDAY', '13:00:00', '15:00:00', 'E103', 'THEORY', (SELECT id FROM subjects WHERE code='IT101'), NOW(), NOW()),
('SATURDAY', '08:00:00', '11:00:00', 'Lab E1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT101'), NOW(), NOW()),

-- IT301 - Công nghệ phần mềm
('MONDAY', '08:00:00', '10:00:00', 'G301', 'THEORY', (SELECT id FROM subjects WHERE code='IT301'), NOW(), NOW()),
('THURSDAY', '10:00:00', '12:00:00', 'Lab G1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT301'), NOW(), NOW()),

-- IT302 - UI/UX
('TUESDAY', '10:00:00', '12:00:00', 'G302', 'THEORY', (SELECT id FROM subjects WHERE code='IT302'), NOW(), NOW()),
('FRIDAY', '13:00:00', '15:00:00', 'Lab G2', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT302'), NOW(), NOW()),

-- IT303 - Cloud Computing
('WEDNESDAY', '08:00:00', '10:00:00', 'G303', 'THEORY', (SELECT id FROM subjects WHERE code='IT303'), NOW(), NOW()),
('FRIDAY', '08:00:00', '10:00:00', 'Lab G3', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT303'), NOW(), NOW()),

-- IT304 - Blockchain
('THURSDAY', '08:00:00', '10:00:00', 'G304', 'THEORY', (SELECT id FROM subjects WHERE code='IT304'), NOW(), NOW()),

-- IT305 - Big Data
('MONDAY', '13:00:00', '15:00:00', 'G305', 'THEORY', (SELECT id FROM subjects WHERE code='IT305'), NOW(), NOW()),
('THURSDAY', '13:00:00', '15:00:00', 'Lab G5', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT305'), NOW(), NOW()),

-- IT306 - Computer Vision
('TUESDAY', '08:00:00', '10:00:00', 'G306', 'THEORY', (SELECT id FROM subjects WHERE code='IT306'), NOW(), NOW()),
('WEDNESDAY', '13:00:00', '15:00:00', 'Lab G6', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT306'), NOW(), NOW()),

-- IT401 - DevOps
('MONDAY', '10:00:00', '12:00:00', 'H401', 'THEORY', (SELECT id FROM subjects WHERE code='IT401'), NOW(), NOW()),
('THURSDAY', '08:00:00', '10:00:00', 'Lab H1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT401'), NOW(), NOW()),

-- IT402 - IoT
('TUESDAY', '13:00:00', '15:00:00', 'H402', 'THEORY', (SELECT id FROM subjects WHERE code='IT402'), NOW(), NOW()),
('FRIDAY', '10:00:00', '12:00:00', 'Lab H2', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT402'), NOW(), NOW()),

-- IT403 - Phát triển game
('WEDNESDAY', '10:00:00', '12:00:00', 'H403', 'THEORY', (SELECT id FROM subjects WHERE code='IT403'), NOW(), NOW()),
('SATURDAY', '08:00:00', '11:00:00', 'Lab H3', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT403'), NOW(), NOW()),

-- IT404 - Đồ họa máy tính
('MONDAY', '08:00:00', '10:00:00', 'H404', 'THEORY', (SELECT id FROM subjects WHERE code='IT404'), NOW(), NOW()),
('THURSDAY', '13:00:00', '15:00:00', 'Lab H4', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT404'), NOW(), NOW()),

-- IT405 - ML nâng cao
('TUESDAY', '08:00:00', '10:00:00', 'H405', 'THEORY', (SELECT id FROM subjects WHERE code='IT405'), NOW(), NOW()),
('FRIDAY', '08:00:00', '10:00:00', 'Lab H5', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT405'), NOW(), NOW()),

-- IT501 - Đồ án chuyên ngành
('MONDAY', '13:00:00', '16:00:00', 'I501', 'PROJECT', (SELECT id FROM subjects WHERE code='IT501'), NOW(), NOW()),

-- IT502 - Thực tập
('TUESDAY', '08:00:00', '12:00:00', 'I502', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT502'), NOW(), NOW()),

-- IT503 - AI tiên tiến
('WEDNESDAY', '08:00:00', '10:00:00', 'I503', 'THEORY', (SELECT id FROM subjects WHERE code='IT503'), NOW(), NOW()),
('FRIDAY', '13:00:00', '15:00:00', 'Lab I3', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT503'), NOW(), NOW());

-- =====================================================
-- GHI CHÚ MẪU CHO SINH VIÊN MỚI
-- =====================================================

-- Ghi chú cho sinh viên năm 1
INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, is_read, user_id, subject_id, created_at, updated_at) VALUES
('Công thức toán rời rạc', 'Tổ hợp: C(n,k) = n! / (k!(n-k)!)\nChỉnh hợp: A(n,k) = n! / (n-k)!\nNguyên lý bù trừ: |A∪B| = |A| + |B| - |A∩B|', 'STUDY', '#f59e0b', 1, 1, 0, (SELECT id FROM users WHERE username='student9'), (SELECT id FROM subjects WHERE code='MATH101'), NOW(), NOW()),
('Cú pháp C cơ bản', 'Khai báo biến: int x = 10;\nVòng lặp for: for(int i=0; i<n; i++){}\nHàm: int sum(int a, int b) { return a+b; }', 'STUDY', '#3b82f6', 1, 1, 0, (SELECT id FROM users WHERE username='student10'), (SELECT id FROM subjects WHERE code='IT101'), NOW(), NOW()),
('Lịch học tuần này', 'Thứ 2: Toán rời rạc 8h\nThứ 4: Nhập môn lập trình 13h\nThứ 6: Giải tích 8h', 'PERSONAL', '#10b981', 0, 0, 0, (SELECT id FROM users WHERE username='student11'), NULL, NOW(), NOW());

-- Ghi chú cho sinh viên năm 2
INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, is_read, user_id, subject_id, created_at, updated_at) VALUES
('Độ phức tạp thuật toán', 'O(1): Hằng số\nO(log n): Logarit\nO(n): Tuyến tính\nO(n log n): Linearithmic\nO(n²): Bậc 2\nO(2ⁿ): Mũ', 'STUDY', '#10b981', 1, 1, 0, (SELECT id FROM users WHERE username='student17'), (SELECT id FROM subjects WHERE code='IT201'), NOW(), NOW()),
('4 tính chất OOP', '1. Encapsulation - Đóng gói\n2. Inheritance - Kế thừa\n3. Polymorphism - Đa hình\n4. Abstraction - Trừu tượng', 'STUDY', '#14b8a6', 1, 1, 0, (SELECT id FROM users WHERE username='student18'), (SELECT id FROM subjects WHERE code='IT202'), NOW(), NOW()),
('Lệnh Git thường dùng', 'git init\ngit add .\ngit commit -m "message"\ngit push origin main\ngit pull\ngit branch\ngit checkout', 'STUDY', '#06b6d4', 0, 1, 0, (SELECT id FROM users WHERE username='student19'), NULL, NOW(), NOW());

-- Ghi chú cho sinh viên năm 3
INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, is_read, user_id, subject_id, created_at, updated_at) VALUES
('Quy trình Scrum', '1. Sprint Planning\n2. Daily Standup\n3. Sprint Review\n4. Sprint Retrospective\nCác vai trò: Product Owner, Scrum Master, Dev Team', 'STUDY', '#f43f5e', 1, 1, 0, (SELECT id FROM users WHERE username='student25'), (SELECT id FROM subjects WHERE code='IT301'), NOW(), NOW()),
('AWS Services cần biết', 'EC2: Virtual servers\nS3: Object storage\nRDS: Managed database\nLambda: Serverless functions\nCloudFront: CDN', 'STUDY', '#3b82f6', 1, 1, 0, (SELECT id FROM users WHERE username='student26'), (SELECT id FROM subjects WHERE code='IT303'), NOW(), NOW()),
('Công thức Big Data', 'MapReduce: Map → Shuffle → Reduce\nCAP Theorem: Consistency, Availability, Partition tolerance\nPick any 2 out of 3', 'STUDY', '#eab308', 0, 1, 0, (SELECT id FROM users WHERE username='student27'), (SELECT id FROM subjects WHERE code='IT305'), NOW(), NOW());

-- Ghi chú cho sinh viên năm 4
INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, is_read, user_id, subject_id, created_at, updated_at) VALUES
('Docker commands', 'docker build -t myapp .\ndocker run -p 8080:80 myapp\ndocker ps\ndocker stop <id>\ndocker-compose up -d', 'STUDY', '#22c55e', 1, 1, 0, (SELECT id FROM users WHERE username='student29'), (SELECT id FROM subjects WHERE code='IT401'), NOW(), NOW()),
('Unity basics', 'GameObject: Đối tượng cơ bản\nComponent: Thành phần của GameObject\nTransform: Vị trí, xoay, scale\nRigidbody: Vật lý\nCollider: Va chạm', 'STUDY', '#14b8a6', 1, 1, 0, (SELECT id FROM users WHERE username='student30'), (SELECT id FROM subjects WHERE code='IT403'), NOW(), NOW()),
('CNN Architecture', 'Input Layer → Conv Layer → ReLU → Pooling → Fully Connected → Output\nCác kiến trúc nổi tiếng: LeNet, AlexNet, VGG, ResNet', 'STUDY', '#0ea5e9', 1, 1, 0, (SELECT id FROM users WHERE username='student31'), (SELECT id FROM subjects WHERE code='IT405'), NOW(), NOW());

-- Ghi chú cho sinh viên năm 5
INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, is_read, user_id, subject_id, created_at, updated_at) VALUES
('Timeline đồ án', 'Tháng 1-2: Nghiên cứu tài liệu\nTháng 3-4: Xây dựng prototype\nTháng 5-6: Hoàn thiện sản phẩm\nTháng 7: Viết báo cáo, thuyết trình', 'PERSONAL', '#dc2626', 1, 1, 0, (SELECT id FROM users WHERE username='student37'), (SELECT id FROM subjects WHERE code='IT501'), NOW(), NOW()),
('Prompt Engineering Tips', '1. Be specific and clear\n2. Provide context\n3. Use examples (few-shot)\n4. Set constraints\n5. Iterate and refine', 'STUDY', '#f97316', 1, 1, 0, (SELECT id FROM users WHERE username='student38'), (SELECT id FROM subjects WHERE code='IT503'), NOW(), NOW()),
('Smart Contract Security', 'Reentrancy Attack\nOverflow/Underflow\nAccess Control\nFront-running\nAlways use OpenZeppelin libraries', 'STUDY', '#f59e0b', 1, 1, 0, (SELECT id FROM users WHERE username='student39'), (SELECT id FROM subjects WHERE code='IT504'), NOW(), NOW());

-- =====================================================
-- TÀI LIỆU CHIA SẺ MỚI
-- =====================================================

-- Tài liệu từ giảng viên mới
INSERT INTO documents (user_id, subject_id, title, description, type, file_url, file_name, file_size, file_extension, is_public, download_count, view_count, tags, like_count, comment_count, is_shared, created_at, updated_at) VALUES
-- Tài liệu teacher5
((SELECT id FROM users WHERE username='teacher5'), (SELECT id FROM subjects WHERE code='IT201'), 'Slide: Cấu trúc dữ liệu cơ bản', 'Stack, Queue, Linked List với code mẫu', 'LECTURE_SLIDES', '/uploads/documents/data_structures_basics.pdf', 'data_structures_basics.pdf', 4096000, '.pdf', 1, 52, 145, 'data structures,stack,queue', 18, 4, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='teacher5'), (SELECT id FROM subjects WHERE code='IT202'), 'Giáo trình Java OOP', 'Lập trình hướng đối tượng với Java từ cơ bản đến nâng cao', 'TEXTBOOK', '/uploads/documents/java_oop_textbook.pdf', 'java_oop_textbook.pdf', 12000000, '.pdf', 1, 78, 210, 'java,oop,programming', 35, 7, 1, NOW(), NOW()),

-- Tài liệu teacher7
((SELECT id FROM users WHERE username='teacher7'), (SELECT id FROM subjects WHERE code='MATH101'), 'Bài tập Toán rời rạc có lời giải', 'Tổng hợp 100 bài tập toán rời rạc kèm đáp án chi tiết', 'EXERCISE', '/uploads/documents/discrete_math_exercises.pdf', 'discrete_math_exercises.pdf', 3500000, '.pdf', 1, 92, 267, 'toán,rời rạc,bài tập', 48, 9, 1, NOW(), NOW()),

-- Tài liệu teacher10
((SELECT id FROM users WHERE username='teacher10'), (SELECT id FROM subjects WHERE code='IT303'), 'Slide: AWS Cloud Services', 'Giới thiệu các dịch vụ AWS phổ biến và cách sử dụng', 'LECTURE_SLIDES', '/uploads/documents/aws_services.pdf', 'aws_services.pdf', 5120000, '.pdf', 1, 64, 178, 'aws,cloud,devops', 29, 6, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='teacher10'), (SELECT id FROM subjects WHERE code='IT401'), 'Docker & Kubernetes Tutorial', 'Hướng dẫn containerization và orchestration', 'TEXTBOOK', '/uploads/documents/docker_k8s_tutorial.pdf', 'docker_k8s_tutorial.pdf', 8000000, '.pdf', 1, 71, 192, 'docker,kubernetes,devops', 33, 8, 1, NOW(), NOW()),

-- Tài liệu teacher11
((SELECT id FROM users WHERE username='teacher11'), (SELECT id FROM subjects WHERE code='IT305'), 'Big Data với Hadoop & Spark', 'Xử lý dữ liệu lớn với các framework hiện đại', 'TEXTBOOK', '/uploads/documents/big_data_hadoop_spark.pdf', 'big_data_hadoop_spark.pdf', 10000000, '.pdf', 1, 58, 165, 'big data,hadoop,spark', 27, 5, 1, NOW(), NOW()),

-- Tài liệu teacher14
((SELECT id FROM users WHERE username='teacher14'), (SELECT id FROM subjects WHERE code='IT403'), 'Unity Game Development Guide', 'Hướng dẫn phát triển game 2D và 3D với Unity', 'TEXTBOOK', '/uploads/documents/unity_game_dev.pdf', 'unity_game_dev.pdf', 15000000, '.pdf', 1, 85, 245, 'unity,game,development', 41, 10, 1, NOW(), NOW());
-- Tài liệu từ sinh viên mới
INSERT INTO documents (user_id, subject_id, title, description, type, file_url, file_name, file_size, file_extension, is_public, download_count, view_count, tags, like_count, comment_count, is_shared, created_at, updated_at) VALUES
-- Từ sinh viên năm 2
((SELECT id FROM users WHERE username='student17'), (SELECT id FROM subjects WHERE code='IT201'), 'Cheat sheet: Độ phức tạp thuật toán', 'Tổng hợp các độ phức tạp thường gặp với ví dụ', 'OTHER', '/uploads/documents/algorithm_complexity_cheatsheet.pdf', 'algorithm_complexity_cheatsheet.pdf', 512000, '.pdf', 1, 123, 356, 'algorithm,complexity,cheatsheet', 56, 8, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='student18'), (SELECT id FROM subjects WHERE code='IT202'), 'Bài tập OOP Java có code', '50 bài tập OOP kèm source code mẫu', 'EXERCISE', '/uploads/documents/oop_java_exercises.pdf', 'oop_java_exercises.pdf', 2048000, '.pdf', 1, 98, 278, 'java,oop,exercise', 45, 7, 1, NOW(), NOW()),

-- Từ sinh viên năm 3
((SELECT id FROM users WHERE username='student25'), (SELECT id FROM subjects WHERE code='IT301'), 'Agile vs Waterfall', 'So sánh chi tiết 2 phương pháp phát triển phần mềm', 'OTHER', '/uploads/documents/agile_vs_waterfall.pdf', 'agile_vs_waterfall.pdf', 1024000, '.pdf', 1, 145, 412, 'agile,waterfall,software', 68, 11, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='student26'), (SELECT id FROM subjects WHERE code='IT303'), 'AWS Certification Notes', 'Ghi chú ôn thi AWS Solutions Architect', 'OTHER', '/uploads/documents/aws_cert_notes.pdf', 'aws_cert_notes.pdf', 3072000, '.pdf', 1, 187, 523, 'aws,certification,cloud', 89, 14, 1, NOW(), NOW()),

-- Từ sinh viên năm 4
((SELECT id FROM users WHERE username='student29'), (SELECT id FROM subjects WHERE code='IT401'), 'CI/CD Pipeline Examples', 'Các ví dụ pipeline với Jenkins, GitLab CI, GitHub Actions', 'OTHER', '/uploads/documents/cicd_examples.pdf', 'cicd_examples.pdf', 2560000, '.pdf', 1, 112, 334, 'cicd,jenkins,devops', 52, 9, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='student30'), (SELECT id FROM subjects WHERE code='IT403'), 'Unity 2D Game Tutorial', 'Hướng dẫn chi tiết làm game 2D platformer', 'OTHER', '/uploads/documents/unity_2d_tutorial.pdf', 'unity_2d_tutorial.pdf', 5120000, '.pdf', 1, 134, 389, 'unity,game,2d,tutorial', 62, 10, 1, NOW(), NOW()),

-- Từ sinh viên năm 5
((SELECT id FROM users WHERE username='student37'), NULL, 'Mẫu báo cáo đồ án tốt nghiệp', 'Template báo cáo ĐATN chuẩn format trường', 'OTHER', '/uploads/documents/thesis_template.pdf', 'thesis_template.pdf', 1024000, '.pdf', 1, 234, 678, 'thesis,template,graduation', 112, 18, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='student38'), (SELECT id FROM subjects WHERE code='IT503'), 'GPT Prompt Engineering Guidebook', 'Hướng dẫn viết prompt hiệu quả cho LLM', 'OTHER', '/uploads/documents/prompt_engineering_guide.pdf', 'prompt_engineering_guide.pdf', 2048000, '.pdf', 1, 198, 567, 'gpt,prompt,llm,ai', 95, 16, 1, NOW(), NOW()),
((SELECT id FROM users WHERE username='student39'), (SELECT id FROM subjects WHERE code='IT504'), 'Smart Contract Best Practices', 'Các nguyên tắc viết smart contract an toàn', 'OTHER', '/uploads/documents/smart_contract_practices.pdf', 'smart_contract_practices.pdf', 1536000, '.pdf', 1, 156, 445, 'blockchain,smart contract,security', 73, 13, 1, NOW(), NOW());

-- =====================================================
-- LIKES CHO TÀI LIỆU MỚI
-- =====================================================

-- Likes cho tài liệu của teacher5
INSERT INTO document_likes (user_id, document_id, created_at) 
SELECT u.id, d.id, NOW()
FROM users u, documents d
WHERE u.username IN ('student17', 'student18', 'student19', 'student20') 
AND d.title = 'Slide: Cấu trúc dữ liệu cơ bản'
LIMIT 4;

INSERT INTO document_likes (user_id, document_id, created_at) 
SELECT u.id, d.id, NOW()
FROM users u, documents d
WHERE u.username IN ('student17', 'student18', 'student21') 
AND d.title = 'Giáo trình Java OOP'
LIMIT 3;

-- Likes cho tài liệu sinh viên chia sẻ
INSERT INTO document_likes (user_id, document_id, created_at) 
SELECT u.id, d.id, NOW()
FROM users u, documents d
WHERE u.username IN ('student1', 'student2', 'student3', 'student4', 'student5') 
AND d.title = 'AWS Certification Notes'
LIMIT 5;

INSERT INTO document_likes (user_id, document_id, created_at) 
SELECT u.id, d.id, NOW()
FROM users u, documents d
WHERE u.username IN ('student25', 'student26', 'student27', 'student28') 
AND d.title = 'Mẫu báo cáo đồ án tốt nghiệp'
LIMIT 4;

INSERT INTO document_likes (user_id, document_id, created_at) 
SELECT u.id, d.id, NOW()
FROM users u, documents d
WHERE u.username IN ('student29', 'student30', 'student31', 'student32') 
AND d.title = 'GPT Prompt Engineering Guidebook'
LIMIT 4;

-- =====================================================
-- COMMENTS CHO TÀI LIỆU MỚI
-- =====================================================

-- Comments cho tài liệu về Data Structures
INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student17'),
    (SELECT id FROM documents WHERE title='Slide: Cấu trúc dữ liệu cơ bản'),
    'Slide rất dễ hiểu, code mẫu rõ ràng. Cảm ơn thầy!',
    NULL,
    NOW(),
    NOW();

INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student18'),
    (SELECT id FROM documents WHERE title='Slide: Cấu trúc dữ liệu cơ bản'),
    'Thầy ơi cho em hỏi phần Graph có thuật toán Dijkstra không ạ?',
    NULL,
    NOW(),
    NOW();

-- Comments cho tài liệu Java OOP
INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student19'),
    (SELECT id FROM documents WHERE title='Giáo trình Java OOP'),
    'Giáo trình rất chi tiết, giải thích 4 tính chất OOP rất hay!',
    NULL,
    NOW(),
    NOW();

-- Comments cho AWS Notes
INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student25'),
    (SELECT id FROM documents WHERE title='AWS Certification Notes'),
    'Tài liệu này giúp mình pass AWS SAA rồi. Cảm ơn bạn nhiều!',
    NULL,
    NOW(),
    NOW();

INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student27'),
    (SELECT id FROM documents WHERE title='AWS Certification Notes'),
    'Bạn có tài liệu về AWS Developer Associate không?',
    NULL,
    NOW(),
    NOW();

-- Comments cho Unity Tutorial
INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student29'),
    (SELECT id FROM documents WHERE title='Unity 2D Game Tutorial'),
    'Tutorial rất hay, làm theo từng bước là có game chạy được ngay!',
    NULL,
    NOW(),
    NOW();

-- Comments cho Smart Contract
INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student37'),
    (SELECT id FROM documents WHERE title='Smart Contract Best Practices'),
    'Phần security rất quan trọng, các bạn học blockchain nên đọc kỹ.',
    NULL,
    NOW(),
    NOW();

INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student38'),
    (SELECT id FROM documents WHERE title='Smart Contract Best Practices'),
    'Có ví dụ về reentrancy attack không bạn?',
    NULL,
    NOW(),
    NOW();

-- Comments cho Thesis Template
INSERT INTO document_comments (user_id, document_id, content, parent_id, created_at, updated_at)
SELECT 
    (SELECT id FROM users WHERE username='student39'),
    (SELECT id FROM documents WHERE title='Mẫu báo cáo đồ án tốt nghiệp'),
    'Template này chuẩn format trường luôn, save lại dùng!',
    NULL,
    NOW(),
    NOW();
-- =====================================================
-- HOÀN TẤT
-- =====================================================
SELECT 'Seed data inserted successfully!' AS Status;
SELECT 'Tất cả user có mật khẩu là: 123456' AS Note;
SELECT COUNT(*) AS 'Số lượng giảng viên' FROM users WHERE role = 'TEACHER';
SELECT COUNT(*) AS 'Số lượng sinh viên' FROM users WHERE role = 'STUDENT';
SELECT COUNT(*) AS 'Số lượng môn học' FROM subjects;
SELECT COUNT(*) AS 'Số lượng bài tập' FROM assignments;
SELECT COUNT(*) AS 'Số lượng tài liệu chia sẻ' FROM documents WHERE is_shared = 1;
