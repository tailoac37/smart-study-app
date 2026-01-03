package com.studyapp.service;

import com.studyapp.model.*;
import com.studyapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class DemoDataService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    @Autowired
    private SubjectEnrollmentRepository enrollmentRepository;
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void generateDemoDataForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.TEACHER) {
            generateDemoDataForTeacher(user);
        } else {
            generateDemoDataForStudent(user);
        }
    }

    private void generateDemoDataForTeacher(User teacher) {
        // Create Subjects taught by this teacher
        List<String> subjectNames = Arrays.asList("Lập trình Web", "Cơ sở dữ liệu", "Mạng máy tính", "Trí tuệ nhân tạo",
                "Phát triển ứng dụng di động");
        List<String> subjectCodes = Arrays.asList("IT001", "IT002", "IT003", "IT004", "IT005");
        String[] colors = { "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6" };

        // Create a dummy student for these subjects
        User student = userRepository.findByUsername("student_demo")
                .orElseGet(() -> {
                    User s = new User();
                    s.setUsername("student_demo");
                    s.setPassword(passwordEncoder.encode("123456"));
                    s.setFullName("Sinh viên Văn Mẫu");
                    s.setEmail("student.demo@example.com");
                    s.setRole(User.Role.STUDENT);
                    return userRepository.save(s);
                });

        for (int i = 0; i < subjectNames.size(); i++) {
            String subName = subjectNames.get(i);
            String subCode = subjectCodes.get(i);

            // Create/Get Subject
            Subject subject = subjectRepository.findByCode(subCode).orElseGet(() -> {
                Subject s = new Subject();
                s.setName(subName);
                s.setCode(subCode);
                s.setCredits(3 + new Random().nextInt(2));
                s.setTeacher(teacher);
                s.setTeacherName(teacher.getFullName());
                s.setTeacherEmail(teacher.getEmail());
                s.setRoom("P." + (100 + new Random().nextInt(50)));
                s.setSemester("HK1 2025-2026");
                s.setColor(colors[new Random().nextInt(5)]);
                return subjectRepository.save(s);
            });
            // Ensure this user is the teacher
            if (!subject.getTeacher().getId().equals(teacher.getId())) {
                subject.setTeacher(teacher);
                subject.setTeacherName(teacher.getFullName());
                subjectRepository.save(subject);
            }
            subject.setColor(colors[i % colors.length]);
            subjectRepository.save(subject);

            // Enroll Dummy Student
            if (!enrollmentRepository.existsByStudent_IdAndSubject_Id(student.getId(), subject.getId())) {
                SubjectEnrollment enrollment = new SubjectEnrollment();
                enrollment.setStudent(student);
                enrollment.setSubject(subject);
                enrollment.setStatus(SubjectEnrollment.EnrollmentStatus.ACTIVE);
                enrollment.setEnrolledAt(LocalDateTime.now());
                enrollmentRepository.save(enrollment);
            }

            // Create Schedule
            if (scheduleRepository.findBySubjectId(subject.getId()).isEmpty()) {
                createScheduleForSubject(subject, i);
            }

            // Create Assignments
            if (assignmentRepository.findBySubject_Id(subject.getId()).isEmpty()) {
                createAssignmentsForSubject(subject, teacher, student, i);
            }
        }

        // Welcome Note
        Note note = new Note();
        note.setTitle("Chào mừng thầy/cô!");
        note.setContent("Hệ thống đã tạo dữ liệu mẫu cho khóa học của thầy/cô.");
        note.setType(Note.NoteType.GENERAL);
        note.setSender(student); // Message from student
        note.setUser(teacher); // To teacher
        // note.setReplies(null); // Field does not exist
        note.setIsRead(false);
        noteRepository.save(note);
    }

    private void generateDemoDataForStudent(User student) {
        // Create a Teacher if not exists
        User teacher = userRepository.findByUsername("teacher_demo")
                .orElseGet(() -> {
                    User t = new User();
                    t.setUsername("teacher_demo");
                    t.setPassword(passwordEncoder.encode("123456"));
                    t.setFullName("ThS. Nguyễn Văn A");
                    t.setEmail("teacher.demo@example.com");
                    t.setRole(User.Role.TEACHER);
                    return userRepository.save(t);
                });

        // Create Subjects
        List<String> subjectNames = Arrays.asList("Lập trình Web", "Cơ sở dữ liệu", "Mạng máy tính", "Trí tuệ nhân tạo",
                "Phát triển ứng dụng di động");
        List<String> subjectCodes = Arrays.asList("IT001", "IT002", "IT003", "IT004", "IT005");
        String[] colors = { "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6" };

        for (int i = 0; i < subjectNames.size(); i++) {
            String subName = subjectNames.get(i);
            String subCode = subjectCodes.get(i);

            Subject subject = subjectRepository.findByCode(subCode).orElseGet(() -> {
                Subject s = new Subject();
                s.setName(subName);
                s.setCode(subCode);
                s.setCredits(3 + new Random().nextInt(2)); // 3 or 4 credits
                s.setTeacher(teacher);
                s.setTeacherName(teacher.getFullName());
                s.setTeacherEmail(teacher.getEmail());
                s.setRoom("P." + (100 + new Random().nextInt(50)));
                s.setSemester("HK1 2025-2026");
                s.setColor("#2563eb");
                return subjectRepository.save(s);
            });
            // Update color
            subject.setColor(colors[i % colors.length]);
            subjectRepository.save(subject);

            // Enroll Student (Handle duplicate enrollment)
            if (!enrollmentRepository.existsByStudent_IdAndSubject_Id(student.getId(), subject.getId())) {
                SubjectEnrollment enrollment = new SubjectEnrollment();
                enrollment.setStudent(student);
                enrollment.setSubject(subject);
                enrollment.setStatus(SubjectEnrollment.EnrollmentStatus.ACTIVE);
                enrollment.setEnrolledAt(LocalDateTime.now());
                enrollmentRepository.save(enrollment);
            }

            // Create Schedule
            if (scheduleRepository.findBySubjectId(subject.getId()).isEmpty()) {
                createScheduleForSubject(subject, i);
            }

            // Create Assignments
            if (assignmentRepository.findBySubject_Id(subject.getId()).isEmpty()) {
                createAssignmentsForSubject(subject, teacher, student, i);
            }
        }

        // Create a Welcome Note
        Note note = new Note();
        note.setTitle("Chào mừng bạn!");
        note.setContent("Hệ thống đã tự động tạo dữ liệu mẫu để bạn trải nghiệm.");
        note.setType(Note.NoteType.GENERAL);
        note.setUser(student);
        noteRepository.save(note);
    }

    private void createScheduleForSubject(Subject subject, int i) {
        Schedule schedule = new Schedule();
        schedule.setSubject(subject);
        Schedule.DayOfWeek[] days = { Schedule.DayOfWeek.MONDAY, Schedule.DayOfWeek.TUESDAY,
                Schedule.DayOfWeek.WEDNESDAY, Schedule.DayOfWeek.THURSDAY, Schedule.DayOfWeek.FRIDAY };
        schedule.setDayOfWeek(days[i % 5]);
        schedule.setStartTime(LocalTime.of(8 + (i % 2) * 2, 0)); // 08:00 or 10:00
        schedule.setEndTime(LocalTime.of(10 + (i % 2) * 2, 0));
        schedule.setRoom(subject.getRoom());
        schedule.setType(Schedule.ScheduleType.THEORY);
        scheduleRepository.save(schedule);

        // Add a second session for some subjects
        if (i % 2 == 0) {
            Schedule schedule2 = new Schedule();
            schedule2.setSubject(subject);
            schedule2.setDayOfWeek(days[(i + 2) % 5]);
            schedule2.setStartTime(LocalTime.of(13, 0));
            schedule2.setEndTime(LocalTime.of(15, 0));
            schedule2.setRoom(subject.getRoom());
            schedule2.setType(Schedule.ScheduleType.PRACTICE);
            scheduleRepository.save(schedule2);
        }
    }

    private void createAssignmentsForSubject(Subject subject, User teacher, User student, int i) {
        // 1. Midterm (Graded)
        createAssignment(subject, teacher, student, "Kiểm tra giữa kì", Assignment.AssignmentType.EXAM, 2, true,
                8.5);

        // 2. Final (Pending or Graded)
        createAssignment(subject, teacher, student, "Thi cuối kì", Assignment.AssignmentType.EXAM, 3,
                i % 2 == 0, 7.5); // 50% chance graded

        // 3. Homework (Pending)
        if (i % 2 != 0) {
            createAssignment(subject, teacher, student, "Bài tập về nhà tuần " + (i + 1),
                    Assignment.AssignmentType.HOMEWORK, 1, false, null);
        }
    }

    private void createAssignment(Subject subject, User creator, User student, String title,
            Assignment.AssignmentType type, int multiplier, boolean isGraded, Double score) {
        Assignment assignment = new Assignment();
        assignment.setTitle(title);
        assignment.setDescription("Bài tập mẫu cho môn " + subject.getName());
        assignment.setSubject(subject);
        assignment.setCreatedBy(creator);
        assignment.setType(type);
        assignment.setPriority(Assignment.Priority.HIGH);
        assignment.setDeadline(LocalDateTime.now().plusDays(7));
        assignment.setStatus(Assignment.Status.TODO);
        assignment = assignmentRepository.save(assignment);

        // If isGraded -> Create a SUBMISSION for the student which is GRADED
        if (isGraded) {
            AssignmentSubmission submission = new AssignmentSubmission();
            submission.setAssignment(assignment);
            submission.setUser(student);
            submission.setStatus(AssignmentSubmission.SubmissionStatus.GRADED);
            submission.setSubmittedAt(LocalDateTime.now().minusDays(1));
            submission.setGradedAt(LocalDateTime.now());
            submission.setScore(score);
            submission.setFeedback("Làm tốt lắm!");
            submissionRepository.save(submission);
        } else {
            // Create an pending submission/assignment record if the Logic requires it,
            // but usually assignments are global and students just see them.
            // But for the Dashboard "Upcoming Assignments" to work, the query is:
            // getAssignmentsByStatus -> which finds assignments user must do.
            // If User is not assigned explicitly (many-to-many), how does the system know?
            // Assignment model has `user` field (Student).
            // If assignment.user is NULL, is it for everyone?
            // Looking at AssignmentRepository: findStudentAssignments searches for
            // assignments where user.id = :userId OR (subject.id IN enrolledSubjects AND
            // user IS NULL)

            // So creating a global assignment (user=null) is enough if student is enrolled
            // in subject.
            // My createAssignment method above saves assignment with user=null (default).
        }
    }
}
