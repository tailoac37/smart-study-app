package com.studyapp.repository;

import com.studyapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser_Id(Long userId);

    List<Note> findByUser_IdAndSubject_Id(Long userId, Long subjectId);

    List<Note> findByUser_IdAndIsPinnedTrue(Long userId);

    List<Note> findByUser_IdOrderByUpdatedAtDesc(Long userId);

    List<Note> findByReplyTo_Id(Long replyToId);

    List<Note> findByUser_IdOrSender_IdOrderByUpdatedAtDesc(Long userId, Long senderId);
}
