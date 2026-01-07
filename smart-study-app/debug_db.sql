SELECT '--- Latest 5 Notes with Reminder ---';
SELECT id, title, reminder_time 
FROM notes 
ORDER BY id DESC 
LIMIT 5;

SELECT '--- Latest 5 Notifications ---';
SELECT id, title, type, user_id, created_at 
FROM notifications 
ORDER BY id DESC 
LIMIT 5;

SELECT '--- Notification Table Structure ---';
DESCRIBE notifications;
