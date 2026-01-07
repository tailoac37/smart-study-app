package com.studyapp.repository;

import com.studyapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser_Id(Long userId);

    List<Note> findByUser_IdAndSubject_Id(Long userId, Long subjectId);

    List<Note> findByUser_IdAndIsPinnedTrue(Long userId);

    List<Note> findByUser_IdOrderByUpdatedAtDesc(Long userId);

    List<Note> findByReplyTo_Id(Long replyToId);

    List<Note> findByUser_IdOrSender_IdOrderByUpdatedAtDesc(Long userId, Long senderId);

    // Find notes with reminder time that needs to be sent
    @Query(value = "SELECT * FROM notes n WHERE n.reminder_time IS NOT NULL AND n.reminder_time BETWEEN :start AND :end AND n.sender_id IS NULL", nativeQuery = true)
    List<Note> findNotesWithReminderBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
