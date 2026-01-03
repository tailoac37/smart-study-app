package com.studyapp.dto;

import com.studyapp.model.Note;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoteDTO {
    private Long id;
    private Long userId;
    private Long subjectId;
    private String subjectName;
    private String title;
    private String content;
    private Note.NoteType type;
    private String color;
    private Boolean isPinned;
    private Boolean isFavorite;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // New fields for messaging
    private Long senderId;
    private String senderName;
    private Long replyToId;
    private Boolean isRead;
    private LocalDateTime reminderTime;
}
