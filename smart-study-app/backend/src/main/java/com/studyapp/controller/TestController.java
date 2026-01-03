package com.studyapp.controller;

import com.studyapp.model.Subject;
import com.studyapp.model.User;
import com.studyapp.repository.SubjectRepository;
import com.studyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/seed-data")
    public ResponseEntity<String> seedData() {
        StringBuilder result = new StringBuilder();

        // 1. Create Teacher
        User teacher = userRepository.findByUsername("teacher").orElse(null);
        if (teacher == null) {
            teacher = new User();
            teacher.setUsername("teacher");
            teacher.setEmail("teacher@test.com");
            teacher.setPassword(passwordEncoder.encode("123456"));
            teacher.setFullName("Nguyễn Văn Giảng Viên");
            teacher.setRole(User.Role.TEACHER);
            userRepository.save(teacher);
            result.append("Created Teacher: teacher / 123456\n");
        } else {
            // Ensure role is TEACHER
            teacher.setRole(User.Role.TEACHER);
            userRepository.save(teacher);
            result.append("Updated Teacher role: teacher\n");
        }

        // 2. Create Student
        User student = userRepository.findByUsername("student").orElse(null);
        if (student == null) {
            student = new User();
            student.setUsername("student");
            student.setEmail("student@test.com");
            student.setPassword(passwordEncoder.encode("123456"));
            student.setFullName("Trần Văn Sinh Viên");
            student.setRole(User.Role.STUDENT);
            userRepository.save(student);
            result.append("Created Student: student / 123456\n");
        } else {
            student.setRole(User.Role.STUDENT);
            userRepository.save(student);
            result.append("Updated Student role: student\n");
        }

        // 3. Create Subjects for Teacher
        if (subjectRepository.findByTeacherId(teacher.getId()).isEmpty()) {
            createSubject(teacher, "Lập trình Web", "IT001", 3, "A101", "HK1 2024", "#2563eb");
            createSubject(teacher, "Cơ sở dữ liệu", "IT002", 4, "B202", "HK1 2024", "#16a34a");
            createSubject(teacher, "Trí tuệ nhân tạo", "IT003", 3, "C303", "HK1 2024", "#dc2626");
            result.append("Created 3 Subjects for teacher\n");
        } else {
            result.append("Subjects already exist for teacher\n");
        }

        return ResponseEntity.ok(result.toString());
    }

    private void createSubject(User teacher, String name, String code, int credits, String room, String semester,
            String color) {
        Subject subject = new Subject();
        subject.setName(name);
        subject.setCode(code);
        subject.setCredits(credits);
        subject.setRoom(room);
        subject.setSemester(semester);
        subject.setColor(color);
        subject.setTeacher(teacher);
        subject.setTeacherName(teacher.getFullName());
        subject.setTeacherEmail(teacher.getEmail());
        subjectRepository.save(subject);
    }
}
