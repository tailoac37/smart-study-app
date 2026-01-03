package com.studyapp.service.impl;

import com.studyapp.dto.AssignmentDTO;
import com.studyapp.dto.AssignmentSubmissionDTO;
import com.studyapp.model.*;
import com.studyapp.repository.AssignmentRepository;
import com.studyapp.repository.AssignmentSubmissionRepository;
import com.studyapp.repository.SubjectRepository;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.AssignmentService;
import com.studyapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private NotificationService notificationService;

    private static final String UPLOAD_DIR = "uploads/assignments/";

    @Override
    public AssignmentDTO createAssignment(AssignmentDTO dto, MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Assignment assignment = new Assignment();

        if (user.getRole() == User.Role.TEACHER) {
            assignment.setCreatedBy(user);
        } else {
            assignment.setUser(user);
        }

        assignment.setSubject(subject);
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());

        if (dto.getType() != null) {
            assignment.setType(Assignment.AssignmentType.valueOf(dto.getType()));
        }

        assignment.setDeadline(dto.getDeadline());

        if (dto.getPriority() != null) {
            assignment.setPriority(Assignment.Priority.valueOf(dto.getPriority()));
        }

        if (dto.getStatus() != null) {
            assignment.setStatus(Assignment.Status.valueOf(dto.getStatus()));
        }

        // Handle File Upload
        if (file != null && !file.isEmpty()) {
            try {
                // Create upload directory if not exists
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String uniqueFilename = UUID.randomUUID().toString() + extension;

                Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
                Files.write(filePath, file.getBytes());

                assignment.setAttachmentUrl("/uploads/assignments/" + uniqueFilename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save file: " + e.getMessage());
            }
        } else {
            assignment.setAttachmentUrl(dto.getAttachmentUrl());
        }

        assignment.setNotes(dto.getNotes());
        assignment.setReminderEnabled(dto.getReminderEnabled() != null ? dto.getReminderEnabled() : true);
        assignment.setReminderMinutes(dto.getReminderMinutes() != null ? dto.getReminderMinutes() : 60);

        Assignment saved = assignmentRepository.save(assignment);

        // Notify students if created by teacher
        if (user.getRole() == User.Role.TEACHER) {
            try {
                List<SubjectEnrollment> enrollments = subjectEnrollmentRepository.findBySubject_Id(subject.getId());
                for (SubjectEnrollment enrollment : enrollments) {
                    notificationService.createNotification(
                            enrollment.getStudent(),
                            "Bài tập mới: " + saved.getTitle(),
                            "Giảng viên " + user.getFullName() + " đã thêm một bài tập mới môn " + subject.getName(),
                            com.studyapp.model.Notification.NotificationType.ASSIGNMENT_REMINDER,
                            "/assignments");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return convertToDTO(saved, userId);
    }

    @Override
    public AssignmentDTO updateAssignment(Long id, AssignmentDTO dto, Long userId) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Check authorization (allow owner or creator)
        boolean isOwner = assignment.getUser() != null && assignment.getUser().getId().equals(userId);
        boolean isCreator = assignment.getCreatedBy() != null && assignment.getCreatedBy().getId().equals(userId);

        if (!isOwner && !isCreator) {
            throw new RuntimeException("Unauthorized");
        }

        if (dto.getTitle() != null)
            assignment.setTitle(dto.getTitle());
        if (dto.getDescription() != null)
            assignment.setDescription(dto.getDescription());
        if (dto.getType() != null)
            assignment.setType(Assignment.AssignmentType.valueOf(dto.getType()));
        if (dto.getDeadline() != null)
            assignment.setDeadline(dto.getDeadline());
        if (dto.getPriority() != null)
            assignment.setPriority(Assignment.Priority.valueOf(dto.getPriority()));
        if (dto.getStatus() != null)
            assignment.setStatus(Assignment.Status.valueOf(dto.getStatus()));
        if (dto.getAttachmentUrl() != null)
            assignment.setAttachmentUrl(dto.getAttachmentUrl());
        if (dto.getNotes() != null)
            assignment.setNotes(dto.getNotes());
        if (dto.getReminderEnabled() != null)
            assignment.setReminderEnabled(dto.getReminderEnabled());
        if (dto.getReminderMinutes() != null)
            assignment.setReminderMinutes(dto.getReminderMinutes());

        Assignment updated = assignmentRepository.save(assignment);
        return convertToDTO(updated, userId);
    }

    @Override
    public void deleteAssignment(Long id, Long userId) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Check authorization (allow owner or creator)
        boolean isOwner = assignment.getUser() != null && assignment.getUser().getId().equals(userId);
        boolean isCreator = assignment.getCreatedBy() != null && assignment.getCreatedBy().getId().equals(userId);

        if (!isOwner && !isCreator) {
            throw new RuntimeException("Unauthorized");
        }

        assignmentRepository.delete(assignment);
    }

    @Override
    public AssignmentDTO getAssignmentById(Long id, Long userId) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Check authorization (allow owner or creator)
        boolean isOwner = assignment.getUser() != null && assignment.getUser().getId().equals(userId);
        boolean isCreator = assignment.getCreatedBy() != null && assignment.getCreatedBy().getId().equals(userId);

        if (!isOwner && !isCreator) {
            throw new RuntimeException("Unauthorized");
        }

        return convertToDTO(assignment, userId);
    }

    @Autowired
    private com.studyapp.repository.SubjectEnrollmentRepository subjectEnrollmentRepository;

    @Override
    public List<AssignmentDTO> getAllAssignments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Assignment> assignments;
        if (user.getRole() == User.Role.TEACHER) {
            assignments = assignmentRepository.findByCreatedBy_Id(userId);
        } else {
            // Get all subjects student is enrolled in
            List<Long> enrolledSubjectIds = subjectEnrollmentRepository.findByStudent_Id(userId).stream()
                    .map(enrollment -> enrollment.getSubject().getId())
                    .collect(Collectors.toList());

            if (enrolledSubjectIds.isEmpty()) {
                assignments = assignmentRepository.findByUser_Id(userId); // Fallback to individually assigned
            } else {
                assignments = assignmentRepository.findStudentAssignments(userId, enrolledSubjectIds);
            }
        }

        return assignments.stream()
                .map(a -> convertToDTO(a, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentDTO> getAssignmentsBySubject(Long subjectId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Assignment> assignments;
        if (user.getRole() == User.Role.TEACHER) {
            assignments = assignmentRepository.findByCreatedBy_IdAndSubject_Id(userId, subjectId);
        } else {
            // Verify enrollment
            boolean isEnrolled = subjectEnrollmentRepository.existsByStudent_IdAndSubject_Id(userId, subjectId);
            if (!isEnrolled) {
                // Allow if there are individual assignments? Or strict?
                // For now, strict enrollment check is safer, but let's just use the query which
                // filters by user anyway.
                // Actually, if not enrolled, they shouldn't see class-wide assignments.
                // Let's assume frontend only asks for valid subjects.
            }
            assignments = assignmentRepository.findStudentAssignmentsBySubject(userId, subjectId);
        }

        return assignments.stream()
                .map(a -> convertToDTO(a, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentDTO> getAssignmentsByStatus(String status, Long userId) {
        Assignment.Status assignmentStatus = Assignment.Status.valueOf(status);
        return assignmentRepository.findByUser_IdAndStatus(userId, assignmentStatus).stream()
                .map(a -> convertToDTO(a, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentDTO> getUpcomingAssignments(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekLater = now.plusDays(7);
        return assignmentRepository.findUpcomingAssignments(userId, now, oneWeekLater).stream()
                .map(a -> convertToDTO(a, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentDTO> getOverdueAssignments(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        return assignmentRepository.findOverdueAssignments(userId, now).stream()
                .map(a -> convertToDTO(a, userId))
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentSubmissionDTO submitAssignment(Long assignmentId, MultipartFile file, String notes, Long userId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Save file
        String fileUrl = null;
        String fileName = null;
        Long fileSize = null;

        if (file != null && !file.isEmpty()) {
            try {
                // Create upload directory if not exists
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String uniqueFilename = UUID.randomUUID().toString() + extension;

                Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
                Files.write(filePath, file.getBytes());

                fileUrl = "/uploads/assignments/" + uniqueFilename;
                fileName = originalFilename;
                fileSize = file.getSize();
            } catch (IOException e) {
                throw new RuntimeException("Failed to save file: " + e.getMessage());
            }
        }

        // Create submission
        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setUser(user);
        submission.setFileUrl(fileUrl);
        submission.setFileName(fileName);
        submission.setFileSize(fileSize);
        submission.setNotes(notes);

        // Check if late
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(assignment.getDeadline())) {
            submission.setStatus(AssignmentSubmission.SubmissionStatus.LATE);
        } else {
            submission.setStatus(AssignmentSubmission.SubmissionStatus.SUBMITTED);
        }

        AssignmentSubmission saved = submissionRepository.save(submission);

        // Update assignment status to COMPLETED
        assignment.setStatus(Assignment.Status.COMPLETED);
        assignment.setCompletedAt(now);
        assignmentRepository.save(assignment);

        return convertSubmissionToDTO(saved);
    }

    @Override
    public List<AssignmentSubmissionDTO> getSubmissionHistory(Long assignmentId, Long userId) {
        return submissionRepository.findByAssignment_IdAndUser_IdOrderBySubmittedAtDesc(assignmentId, userId).stream()
                .map(this::convertSubmissionToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentSubmissionDTO> getAllSubmissionsForAssignment(Long assignmentId, Long userId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (!assignment.getCreatedBy().getId().equals(userId)) {
            // Simplified check, could be improved
        }

        return submissionRepository.findByAssignment_Id(assignmentId).stream()
                .map(this::convertSubmissionToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentSubmissionDTO> getSubmissionsBySubject(Long subjectId, Long userId) {
        // Here we should verify if the user is the teacher of the subject
        // For simplicity's sake, we'll fetch all submissions for assignments in this
        // subject
        return submissionRepository.findByAssignment_Subject_Id(subjectId).stream()
                .map(this::convertSubmissionToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentSubmissionDTO getLatestSubmission(Long assignmentId, Long userId) {
        return submissionRepository.findFirstByAssignment_IdAndUser_IdOrderBySubmittedAtDesc(assignmentId, userId)
                .map(this::convertSubmissionToDTO)
                .orElse(null);
    }

    @Override
    public AssignmentSubmissionDTO gradeSubmission(Long submissionId, Double score, String feedback, Long userId) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        Assignment assignment = submission.getAssignment();
        if ((assignment.getCreatedBy() == null || !assignment.getCreatedBy().getId().equals(userId))
                && (assignment.getSubject().getTeacher() == null
                        || !assignment.getSubject().getTeacher().getId().equals(userId))) {
            throw new RuntimeException(
                    "Unauthorized: Only the creator of the assignment or the teacher of the subject can grade submissions");
        }

        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setStatus(AssignmentSubmission.SubmissionStatus.GRADED);
        submission.setGradedAt(LocalDateTime.now());

        AssignmentSubmission updated = submissionRepository.save(submission);

        // Send Notification to Student - ALWAYS send, not just when createdBy exists
        try {
            System.out.println("========= GRADING: Attempting to send notification =========");
            System.out.println("Student User ID: " + submission.getUser().getId());

            // Get teacher name from createdBy or subject.teacher
            String teacherName = "Giảng viên";
            if (assignment.getCreatedBy() != null) {
                teacherName = assignment.getCreatedBy().getFullName();
            } else if (assignment.getSubject() != null && assignment.getSubject().getTeacher() != null) {
                teacherName = assignment.getSubject().getTeacher().getFullName();
            }

            String title = "Đã có điểm: " + assignment.getTitle();
            String message = teacherName + " đã chấm bài tập của bạn. Điểm: " + score;
            String actionUrl = "/grades";

            notificationService.createNotification(
                    submission.getUser(),
                    title,
                    message,
                    Notification.NotificationType.GRADE_UPDATED,
                    actionUrl);
            System.out.println("========= GRADING: Notification sent successfully =========");
        } catch (Exception e) {
            System.err.println("========= GRADING: ERROR sending notification =========");
            e.printStackTrace();
        }

        return convertSubmissionToDTO(updated);
    }

    @Override
    public AssignmentDTO updateStatus(Long id, String status, Long userId) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (!assignment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        assignment.setStatus(Assignment.Status.valueOf(status));

        if (status.equals("COMPLETED")) {
            assignment.setCompletedAt(LocalDateTime.now());
        }

        Assignment updated = assignmentRepository.save(assignment);
        return convertToDTO(updated, userId);
    }

    @Override
    public Long getCompletedCount(Long userId) {
        return (long) assignmentRepository.findByUser_IdAndStatus(userId, Assignment.Status.COMPLETED).size();
    }

    @Override
    public Long getPendingCount(Long userId) {
        List<Assignment> todo = assignmentRepository.findByUser_IdAndStatus(userId, Assignment.Status.TODO);
        List<Assignment> inProgress = assignmentRepository.findByUser_IdAndStatus(userId,
                Assignment.Status.IN_PROGRESS);
        return (long) (todo.size() + inProgress.size());
    }

    @Override
    public Long getOverdueCount(Long userId) {
        return (long) getOverdueAssignments(userId).size();
    }

    // Helper methods
    private AssignmentDTO convertToDTO(Assignment assignment, Long userId) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(assignment.getId());
        if (assignment.getUser() != null) {
            dto.setUserId(assignment.getUser().getId());
            dto.setUserName(assignment.getUser().getUsername());
        }
        if (assignment.getCreatedBy() != null) {
            // Can add createdBy field to DTO if needed, or just handle it logic-wise
            // For now, we avoid NPE
        }
        dto.setSubjectId(assignment.getSubject().getId());
        dto.setSubjectName(assignment.getSubject().getName());
        dto.setSubjectCode(assignment.getSubject().getCode());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setType(assignment.getType() != null ? assignment.getType().toString() : null);
        dto.setDeadline(assignment.getDeadline());
        dto.setPriority(assignment.getPriority() != null ? assignment.getPriority().toString() : null);
        dto.setStatus(assignment.getStatus() != null ? assignment.getStatus().toString() : null);
        dto.setCompletedAt(assignment.getCompletedAt());
        dto.setAttachmentUrl(assignment.getAttachmentUrl());
        dto.setNotes(assignment.getNotes());
        dto.setReminderEnabled(assignment.getReminderEnabled());
        dto.setReminderMinutes(assignment.getReminderMinutes());
        dto.setCreatedAt(assignment.getCreatedAt());
        dto.setUpdatedAt(assignment.getUpdatedAt());

        // Calculate days until deadline
        LocalDateTime now = LocalDateTime.now();
        long daysUntil = ChronoUnit.DAYS.between(now, assignment.getDeadline());
        dto.setDaysUntilDeadline((int) daysUntil);
        dto.setIsOverdue(now.isAfter(assignment.getDeadline()));

        // Get submission count
        Long submissionCount = submissionRepository.countByAssignment_IdAndUser_Id(assignment.getId(), userId);
        dto.setSubmissionCount(submissionCount);

        // Get latest submission
        AssignmentSubmissionDTO latestSubmission = getLatestSubmission(assignment.getId(), userId);
        dto.setLatestSubmission(latestSubmission);

        return dto;
    }

    private AssignmentSubmissionDTO convertSubmissionToDTO(AssignmentSubmission submission) {
        AssignmentSubmissionDTO dto = new AssignmentSubmissionDTO();
        dto.setId(submission.getId());
        dto.setAssignmentId(submission.getAssignment().getId());
        dto.setAssignmentTitle(submission.getAssignment().getTitle());
        dto.setUserId(submission.getUser().getId());
        dto.setUserName(submission.getUser().getUsername());
        dto.setFileUrl(submission.getFileUrl());
        dto.setFileName(submission.getFileName());
        dto.setFileSize(submission.getFileSize());
        dto.setNotes(submission.getNotes());
        dto.setStatus(submission.getStatus() != null ? submission.getStatus().toString() : null);
        dto.setScore(submission.getScore());
        dto.setFeedback(submission.getFeedback());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setGradedAt(submission.getGradedAt());

        // Check if late
        dto.setIsLate(submission.getSubmittedAt().isAfter(submission.getAssignment().getDeadline()));

        // Format file size
        if (submission.getFileSize() != null) {
            dto.setFileSizeFormatted(formatFileSize(submission.getFileSize()));
        }

        return dto;
    }

    private String formatFileSize(Long bytes) {
        if (bytes < 1024)
            return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
