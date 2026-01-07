INSERT INTO notes (title, content, type, color, is_pinned, is_favorite, is_read, user_id, subject_id, created_at, updated_at, reminder_time) 
VALUES 
('Backend Test Note', 'Note created via SQL to test scheduler', 'IMPORTANT', '#3b82f6', 0, 0, 1, 13, NULL, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 2 MINUTE));

SELECT LAST_INSERT_ID() as new_note_id;
SELECT NOW() as db_time, DATE_ADD(NOW(), INTERVAL 2 MINUTE) as reminder_time;
