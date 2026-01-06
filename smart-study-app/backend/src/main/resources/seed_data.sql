-- =====================================================
-- SEED DATA FOR SMART STUDY APP
-- Mật khẩu mặc định cho tất cả user: 123456
-- (đã được mã hóa BCrypt)
-- =====================================================

USE smart_study_db;

-- =====================================================
-- XÓA DỮ LIỆU CŨ (theo thứ tự để tránh lỗi foreign key)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa dữ liệu từ các bảng phụ thuộc trước
DELETE FROM assignment_submissions;
DELETE FROM grades;
DELETE FROM notes;
DELETE FROM assignments;
DELETE FROM schedules;
DELETE FROM documents;
DELETE FROM subject_enrollments;
DELETE FROM subjects;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. TẠO GIẢNG VIÊN (TEACHER)
-- =====================================================
-- Mật khẩu: 123456 (BCrypt encoded)
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6

INSERT INTO users (username, password, full_name, email, phone, role, active, student_year) VALUES
('teacher1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'ThS. Nguyễn Văn An', 'nguyen.an@university.edu.vn', '0901234567', 'TEACHER', 1, NULL),
('teacher2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', '0902345678', 'TEACHER', 1, NULL),
('teacher3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', '0903456789', 'TEACHER', 1, NULL),
('teacher4', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', '0904567890', 'TEACHER', 1, NULL);

-- =====================================================
-- 2. TẠO SINH VIÊN (STUDENT)
-- =====================================================

INSERT INTO users (username, password, full_name, email, phone, student_id, major, class_name, role, active, student_year) VALUES
('student1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Hoàng Văn Minh', 'hoang.minh@student.edu.vn', '0911111111', 'SV001', 'Công nghệ thông tin', 'CNTT-K20A', 'STUDENT', 1, 3),
('student2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Ngô Thị Lan', 'ngo.lan@student.edu.vn', '0922222222', 'SV002', 'Công nghệ thông tin', 'CNTT-K20A', 'STUDENT', 1, 3),
('student3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đặng Văn Hùng', 'dang.hung@student.edu.vn', '0933333333', 'SV003', 'Công nghệ thông tin', 'CNTT-K20B', 'STUDENT', 1, 3),
('student4', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Vũ Thị Hoa', 'vu.hoa@student.edu.vn', '0944444444', 'SV004', 'Kỹ thuật phần mềm', 'KTPM-K21A', 'STUDENT', 1, 2),
('student5', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Bùi Văn Nam', 'bui.nam@student.edu.vn', '0955555555', 'SV005', 'Kỹ thuật phần mềm', 'KTPM-K21A', 'STUDENT', 1, 2),
('student6', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Lý Thị Mai', 'ly.mai@student.edu.vn', '0966666666', 'SV006', 'Hệ thống thông tin', 'HTTT-K22A', 'STUDENT', 1, 1),
('student7', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Trịnh Văn Tùng', 'trinh.tung@student.edu.vn', '0977777777', 'SV007', 'Hệ thống thông tin', 'HTTT-K22A', 'STUDENT', 1, 1),
('student8', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n5dOkTqkHzEIJoAOgvEz6', 'Đinh Thị Thảo', 'dinh.thao@student.edu.vn', '0988888888', 'SV008', 'An toàn thông tin', 'ATTT-K21B', 'STUDENT', 1, 2);

-- =====================================================
-- 3. TẠO MÔN HỌC (SUBJECTS)
-- =====================================================

-- Môn học của teacher1 (ThS. Nguyễn Văn An)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color) VALUES
('IT001', 'Lập trình Web', 'Học cách xây dựng ứng dụng web với HTML, CSS, JavaScript và các framework hiện đại', 4, 2, (SELECT id FROM users WHERE username='teacher1'), 'ThS. Nguyễn Văn An', 'nguyen.an@university.edu.vn', 'A101', 'HK1 2025-2026', '#2563eb'),
('IT002', 'Cơ sở dữ liệu', 'Thiết kế và quản lý cơ sở dữ liệu quan hệ với MySQL, PostgreSQL', 3, 2, (SELECT id FROM users WHERE username='teacher1'), 'ThS. Nguyễn Văn An', 'nguyen.an@university.edu.vn', 'A102', 'HK1 2025-2026', '#16a34a');

-- Môn học của teacher2 (TS. Trần Thị Bình)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color) VALUES
('IT003', 'Trí tuệ nhân tạo', 'Giới thiệu về Machine Learning, Deep Learning và các ứng dụng AI', 4, 3, (SELECT id FROM users WHERE username='teacher2'), 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', 'B201', 'HK1 2025-2026', '#dc2626'),
('IT004', 'Xử lý ngôn ngữ tự nhiên', 'NLP cơ bản đến nâng cao với Python và các thư viện hiện đại', 3, 3, (SELECT id FROM users WHERE username='teacher2'), 'TS. Trần Thị Bình', 'tran.binh@university.edu.vn', 'B202', 'HK1 2025-2026', '#7c3aed');

-- Môn học của teacher3 (PGS.TS. Lê Văn Cường)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color) VALUES
('IT005', 'Mạng máy tính', 'Kiến thức về mạng, giao thức TCP/IP, bảo mật mạng', 3, 2, (SELECT id FROM users WHERE username='teacher3'), 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', 'C301', 'HK1 2025-2026', '#0891b2'),
('IT006', 'An toàn thông tin', 'Mã hóa, bảo mật hệ thống, phòng chống tấn công mạng', 4, 3, (SELECT id FROM users WHERE username='teacher3'), 'PGS.TS. Lê Văn Cường', 'le.cuong@university.edu.vn', 'C302', 'HK1 2025-2026', '#ea580c');

-- Môn học của teacher4 (ThS. Phạm Thị Dung)
INSERT INTO subjects (code, name, description, credits, target_year, teacher_id, teacher_name, teacher_email, room, semester, color) VALUES
('IT007', 'Phát triển ứng dụng di động', 'Xây dựng ứng dụng Android và iOS với React Native', 4, 3, (SELECT id FROM users WHERE username='teacher4'), 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', 'D401', 'HK1 2025-2026', '#db2777'),
('IT008', 'Kiểm thử phần mềm', 'Unit Testing, Integration Testing, Automation Testing', 3, 2, (SELECT id FROM users WHERE username='teacher4'), 'ThS. Phạm Thị Dung', 'pham.dung@university.edu.vn', 'D402', 'HK1 2025-2026', '#65a30d');

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

INSERT INTO schedules (day_of_week, start_time, end_time, room, type, subject_id) VALUES
-- IT001 - Lập trình Web
('MONDAY', '08:00:00', '10:00:00', 'A101', 'THEORY', (SELECT id FROM subjects WHERE code='IT001')),
('WEDNESDAY', '13:00:00', '15:00:00', 'Lab A1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT001')),
-- IT002 - Cơ sở dữ liệu
('TUESDAY', '10:00:00', '12:00:00', 'A102', 'THEORY', (SELECT id FROM subjects WHERE code='IT002')),
('FRIDAY', '08:00:00', '10:00:00', 'Lab A2', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT002')),
-- IT003 - Trí tuệ nhân tạo
('WEDNESDAY', '08:00:00', '10:00:00', 'B201', 'THEORY', (SELECT id FROM subjects WHERE code='IT003')),
('THURSDAY', '13:00:00', '15:00:00', 'Lab B1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT003')),
-- IT004 - Xử lý ngôn ngữ tự nhiên
('THURSDAY', '08:00:00', '10:00:00', 'B202', 'THEORY', (SELECT id FROM subjects WHERE code='IT004')),
-- IT005 - Mạng máy tính
('MONDAY', '13:00:00', '15:00:00', 'C301', 'THEORY', (SELECT id FROM subjects WHERE code='IT005')),
('FRIDAY', '13:00:00', '15:00:00', 'Lab C1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT005')),
-- IT006 - An toàn thông tin
('TUESDAY', '08:00:00', '10:00:00', 'C302', 'THEORY', (SELECT id FROM subjects WHERE code='IT006')),
('THURSDAY', '10:00:00', '12:00:00', 'Lab C2', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT006')),
-- IT007 - Phát triển ứng dụng di động
('FRIDAY', '10:00:00', '12:00:00', 'D401', 'THEORY', (SELECT id FROM subjects WHERE code='IT007')),
('SATURDAY', '08:00:00', '11:00:00', 'Lab D1', 'PRACTICE', (SELECT id FROM subjects WHERE code='IT007')),
-- IT008 - Kiểm thử phần mềm
('TUESDAY', '13:00:00', '15:00:00', 'D402', 'THEORY', (SELECT id FROM subjects WHERE code='IT008'));

-- =====================================================
-- 6. TẠO BÀI TẬP (ASSIGNMENTS)
-- =====================================================

INSERT INTO assignments (title, description, type, deadline, priority, status, created_by, subject_id) VALUES
-- Bài tập môn IT001
('Thiết kế giao diện trang web', 'Sử dụng HTML, CSS để thiết kế trang web giới thiệu bản thân', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 7 DAY), 'MEDIUM', 'TODO', (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001')),
('Kiểm tra giữa kỳ - Lập trình Web', 'Kiểm tra kiến thức HTML, CSS, JavaScript cơ bản', 'EXAM', DATE_ADD(NOW(), INTERVAL 14 DAY), 'HIGH', 'TODO', (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001')),
('Xây dựng ứng dụng Todo List', 'Tạo ứng dụng Todo List với React.js', 'PROJECT', DATE_ADD(NOW(), INTERVAL 21 DAY), 'HIGH', 'TODO', (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT001')),

-- Bài tập môn IT002
('Thiết kế ERD cho hệ thống quản lý', 'Vẽ sơ đồ ERD cho hệ thống quản lý thư viện', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 5 DAY), 'MEDIUM', 'TODO', (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT002')),
('Truy vấn SQL nâng cao', 'Bài tập về JOIN, Subquery, Stored Procedure', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 10 DAY), 'MEDIUM', 'TODO', (SELECT id FROM users WHERE username='teacher1'), (SELECT id FROM subjects WHERE code='IT002')),

-- Bài tập môn IT003
('Bài tập Machine Learning cơ bản', 'Xây dựng mô hình phân loại với Scikit-learn', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 8 DAY), 'MEDIUM', 'TODO', (SELECT id FROM users WHERE username='teacher2'), (SELECT id FROM subjects WHERE code='IT003')),
('Kiểm tra cuối kỳ - AI', 'Thi cuối kỳ môn Trí tuệ nhân tạo', 'EXAM', DATE_ADD(NOW(), INTERVAL 30 DAY), 'HIGH', 'TODO', (SELECT id FROM users WHERE username='teacher2'), (SELECT id FROM subjects WHERE code='IT003')),

-- Bài tập môn IT005
('Cấu hình mạng LAN', 'Thực hành cấu hình mạng LAN với Packet Tracer', 'HOMEWORK', DATE_ADD(NOW(), INTERVAL 6 DAY), 'MEDIUM', 'TODO', (SELECT id FROM users WHERE username='teacher3'), (SELECT id FROM subjects WHERE code='IT005')),

-- Bài tập môn IT007
('Xây dựng ứng dụng React Native', 'Tạo ứng dụng quản lý công việc đơn giản', 'PROJECT', DATE_ADD(NOW(), INTERVAL 25 DAY), 'HIGH', 'TODO', (SELECT id FROM users WHERE username='teacher4'), (SELECT id FROM subjects WHERE code='IT007'));

-- =====================================================
-- 7. TẠO GHI CHÚ MẪU (NOTES)
-- =====================================================

INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, user_id, subject_id) VALUES
('Ghi chú HTML cơ bản', 'Các thẻ HTML quan trọng:\n- <div>: container\n- <span>: inline element\n- <a>: hyperlink\n- <img>: hình ảnh', 'STUDY', '#2563eb', 1, 1, (SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT001')),
('Câu lệnh SQL thường dùng', 'SELECT, INSERT, UPDATE, DELETE\nJOIN: INNER, LEFT, RIGHT, FULL\nGROUP BY, HAVING, ORDER BY', 'STUDY', '#16a34a', 0, 1, (SELECT id FROM users WHERE username='student1'), (SELECT id FROM subjects WHERE code='IT002')),
('Công thức Machine Learning', 'MSE = 1/n * Σ(y_pred - y_actual)²\nAccuracy = TP+TN / Total', 'STUDY', '#dc2626', 1, 0, (SELECT id FROM users WHERE username='student2'), (SELECT id FROM subjects WHERE code='IT003'));

-- =====================================================
-- HOÀN TẤT
-- =====================================================
SELECT 'Seed data inserted successfully!' AS Status;
SELECT 'Tất cả user có mật khẩu là: 123456' AS Note;
SELECT COUNT(*) AS 'Số lượng giảng viên' FROM users WHERE role = 'TEACHER';
SELECT COUNT(*) AS 'Số lượng sinh viên' FROM users WHERE role = 'STUDENT';
SELECT COUNT(*) AS 'Số lượng môn học' FROM subjects;
SELECT COUNT(*) AS 'Số lượng bài tập' FROM assignments;
