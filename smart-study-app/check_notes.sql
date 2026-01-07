SELECT '--- Notes with Reminder ---';
SELECT id, title, reminder_time, user_id, sender_id 
FROM notes 
WHERE reminder_time IS NOT NULL 
ORDER BY id DESC 
LIMIT 5;

SELECT '--- All Notes Count ---';
SELECT COUNT(*) as total_notes, COUNT(reminder_time) as with_reminder FROM notes;

SELECT '--- Recent Notes ---';
SELECT id, title, LEFT(content, 30) as content_preview, reminder_time 
FROM notes 
ORDER BY id DESC 
LIMIT 5;
