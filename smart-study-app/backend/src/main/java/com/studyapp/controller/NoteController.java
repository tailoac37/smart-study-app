package com.studyapp.controller;

import com.studyapp.dto.NoteDTO;
import com.studyapp.model.User;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String usernameOrEmail = authentication.getName();
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail)));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<NoteDTO>> getMyNotes() {
        return ResponseEntity.ok(noteService.getMyNotes(getCurrentUserId()));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<NoteDTO>> getNotesBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(noteService.getNotesBySubject(getCurrentUserId(), subjectId));
    }

    @PostMapping
    public ResponseEntity<NoteDTO> createNote(@RequestBody NoteDTO noteDTO) {
        return new ResponseEntity<>(noteService.createNote(noteDTO, getCurrentUserId()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> updateNote(@PathVariable Long id, @RequestBody NoteDTO noteDTO) {
        return ResponseEntity.ok(noteService.updateNote(id, noteDTO, getCurrentUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/pin")
    public ResponseEntity<Void> togglePin(@PathVariable Long id) {
        noteService.togglePin(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    // --- Messaging Generic Endpoints ---

    @PostMapping("/send/student/{studentId}")
    public ResponseEntity<Void> sendNoteToStudent(@PathVariable Long studentId, @RequestBody NoteDTO noteDTO) {
        noteService.sendNoteToStudent(getCurrentUserId(), studentId, noteDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send/subject/{subjectId}")
    public ResponseEntity<Void> sendNoteToSubject(@PathVariable Long subjectId, @RequestBody NoteDTO noteDTO) {
        noteService.sendNoteToSubject(getCurrentUserId(), subjectId, noteDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reply/{noteId}")
    public ResponseEntity<NoteDTO> replyToNote(@PathVariable Long noteId, @RequestBody Map<String, String> body) {
        String content = body.get("content");
        return ResponseEntity.ok(noteService.replyToNote(getCurrentUserId(), noteId, content));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        noteService.markAsRead(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }
}
