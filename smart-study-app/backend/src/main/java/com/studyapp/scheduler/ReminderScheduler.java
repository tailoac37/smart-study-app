package com.studyapp.scheduler;

import com.studyapp.model.Note;
import com.studyapp.model.Notification;
import com.studyapp.repository.NoteRepository;
import com.studyapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Scheduled task to check for note reminders and send notifications
 */
@Component
public class ReminderScheduler {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private NotificationService notificationService;

    // Keep track of already sent reminders to avoid duplicates
    private Set<Long> sentReminders = new HashSet<>();

    /**
     * Check for notes with reminders every minute
     * This runs at the start of every minute (e.g., 10:00:00, 10:01:00, etc.)
     */
    @Scheduled(cron = "0 * * * * *")
    public void checkAndSendReminders() {
        LocalDateTime now = LocalDateTime.now();
        // Check for reminders in the past minute (in case of slight delays)
        LocalDateTime oneMinuteAgo = now.minusMinutes(1);
        LocalDateTime oneMinuteAhead = now.plusMinutes(1);

        System.out.println("=== Reminder Scheduler Running at " + now + " ===");
        System.out.println("Checking range: " + oneMinuteAgo + " to " + oneMinuteAhead);

        try {
            List<Note> notesToRemind = noteRepository.findNotesWithReminderBetween(oneMinuteAgo, oneMinuteAhead);

            System.out.println("Found " + notesToRemind.size() + " notes with reminders in range");

            for (Note note : notesToRemind) {
                // Avoid sending duplicate reminders
                if (!sentReminders.contains(note.getId())) {
                    sendReminderNotification(note);
                    sentReminders.add(note.getId());

                    // Clear the reminder after sending (optional - comment out if you want to keep
                    // it)
                    // note.setReminderTime(null);
                    // noteRepository.save(note);
                }
            }

            // Clean up old sent reminders to prevent memory leak (keep only last 1000)
            if (sentReminders.size() > 1000) {
                sentReminders.clear();
            }

        } catch (Exception e) {
            System.err.println("Error in reminder scheduler: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void sendReminderNotification(Note note) {
        try {
            System.out.println(
                    "Sending reminder for note: " + note.getTitle() + " to user: " + note.getUser().getUsername());

            notificationService.createNotification(
                    note.getUser(),
                    "⏰ Nhắc nhở: " + note.getTitle(),
                    "Đây là lời nhắc cho ghi chú của bạn: " +
                            (note.getContent().length() > 100 ? note.getContent().substring(0, 100) + "..."
                                    : note.getContent()),
                    Notification.NotificationType.SCHEDULE_REMINDER,
                    "/notes");

            System.out.println("SUCCESS: Reminder sent for note ID: " + note.getId());

        } catch (Exception e) {
            System.err.println("Error sending reminder for note " + note.getId() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
