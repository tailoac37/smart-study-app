package com.studyapp.service.impl;

import com.studyapp.dto.SubjectDTO;
import com.studyapp.dto.SubjectEnrollmentDTO;
import com.studyapp.model.Schedule;
import com.studyapp.model.Subject;
import com.studyapp.model.SubjectEnrollment;
import com.studyapp.model.User;
import com.studyapp.repository.ScheduleRepository;
import com.studyapp.repository.SubjectEnrollmentRepository;
import com.studyapp.repository.SubjectRepository;
import com.studyapp.repository.UserRepository;
import com.studyapp.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private SubjectEnrollmentRepository enrollmentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Override
    public SubjectEnrollmentDTO enrollSubject(Long studentId, Long subjectId) {
        // Check if already enrolled
        if (enrollmentRepository.existsByStudent_IdAndSubject_Id(studentId, subjectId)) {
            throw new RuntimeException("Already enrolled in this subject");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        // Check for schedule conflicts with student's enrolled subjects
        checkStudentScheduleConflict(studentId, subjectId);

        SubjectEnrollment enrollment = new SubjectEnrollment();
        enrollment.setStudent(student);
        enrollment.setSubject(subject);
        enrollment.setStatus(SubjectEnrollment.EnrollmentStatus.ACTIVE);

        SubjectEnrollment saved = enrollmentRepository.save(enrollment);
        return convertToDTO(saved);
    }

    @Override
    public void dropSubject(Long studentId, Long subjectId) {
        SubjectEnrollment enrollment = enrollmentRepository
                .findByStudent_IdAndSubject_Id(studentId, subjectId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setStatus(SubjectEnrollment.EnrollmentStatus.DROPPED);
        enrollmentRepository.save(enrollment);
    }

    @Override
    public List<SubjectEnrollmentDTO> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudent_Id(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubjectDTO> getEnrolledSubjects(Long studentId) {
        return enrollmentRepository.findByStudent_IdAndStatus(
                studentId, SubjectEnrollment.EnrollmentStatus.ACTIVE)
                .stream()
                .map(enrollment -> convertSubjectToDTO(enrollment.getSubject()))
                .collect(Collectors.toList());
    }

    @Override
    public List<SubjectDTO> getAvailableSubjects(Long studentId) {
        // Get all enrolled subject IDs
        List<Long> enrolledSubjectIds = enrollmentRepository.findByStudent_Id(studentId)
                .stream()
                .map(e -> e.getSubject().getId())
                .collect(Collectors.toList());

        Integer studentYear = userRepository.findById(studentId)
                .map(User::getStudentYear)
                .orElse(1);

        // Get all subjects and filter out enrolled ones AND match student year
        return subjectRepository.findAll().stream()
                .filter(subject -> !enrolledSubjectIds.contains(subject.getId()))
                .filter(subject -> subject.getTargetYear() != null && subject.getTargetYear().equals(studentYear))
                .map(this::convertSubjectToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubjectEnrollmentDTO> getSubjectEnrollments(Long subjectId, Long teacherId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        // Verify teacher owns this subject
        if (!subject.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You are not authorized to view enrollments for this subject");
        }

        return enrollmentRepository.findBySubject_Id(subjectId).stream()
                .filter(enrollment -> enrollment.getStudent().getRole() == User.Role.STUDENT)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SubjectEnrollmentDTO convertToDTO(SubjectEnrollment enrollment) {
        SubjectEnrollmentDTO dto = new SubjectEnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setStudentName(enrollment.getStudent().getFullName());
        dto.setStudentEmail(enrollment.getStudent().getEmail());
        dto.setSubjectId(enrollment.getSubject().getId());
        dto.setSubjectName(enrollment.getSubject().getName());
        dto.setSubjectCode(enrollment.getSubject().getCode());
        dto.setStatus(enrollment.getStatus());
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        return dto;
    }

    private SubjectDTO convertSubjectToDTO(Subject subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setCode(subject.getCode());
        dto.setTeacherName(subject.getTeacherName());
        dto.setTeacherEmail(subject.getTeacherEmail());
        dto.setCredits(subject.getCredits());
        dto.setRoom(subject.getRoom());
        dto.setSemester(subject.getSemester());
        dto.setColor(subject.getColor());
        dto.setDescription(subject.getDescription());
        return dto;
    }

    /**
     * Check if enrolling in this subject would cause schedule conflicts
     * 
     * @param studentId    Student ID
     * @param newSubjectId Subject being enrolled
     */
    private void checkStudentScheduleConflict(Long studentId, Long newSubjectId) {
        // Get schedules of the new subject
        List<Schedule> newSchedules = scheduleRepository.findBySubjectId(newSubjectId);

        if (newSchedules.isEmpty()) {
            return; // No schedules yet, no conflict
        }

        // Get all currently enrolled subject IDs
        List<Long> enrolledSubjectIds = enrollmentRepository.findByStudent_IdAndStatus(
                studentId, SubjectEnrollment.EnrollmentStatus.ACTIVE)
                .stream()
                .map(e -> e.getSubject().getId())
                .collect(Collectors.toList());

        if (enrolledSubjectIds.isEmpty()) {
            return; // No existing enrollments
        }

        // Get all schedules of enrolled subjects
        List<Schedule> enrolledSchedules = scheduleRepository.findBySubjectIdIn(enrolledSubjectIds);

        // Check for conflicts
        for (Schedule newSchedule : newSchedules) {
            for (Schedule enrolled : enrolledSchedules) {
                // Check same day and time overlap
                if (newSchedule.getDayOfWeek() == enrolled.getDayOfWeek() &&
                        isTimeOverlap(newSchedule.getStartTime(), newSchedule.getEndTime(),
                                enrolled.getStartTime(), enrolled.getEndTime())) {
                    throw new RuntimeException(
                            String.format("Trùng lịch! Môn '%s' trùng giờ với môn '%s' vào %s, %s - %s",
                                    newSchedule.getSubject().getName(),
                                    enrolled.getSubject().getName(),
                                    getDayOfWeekVietnamese(enrolled.getDayOfWeek()),
                                    enrolled.getStartTime(),
                                    enrolled.getEndTime()));
                }
            }
        }
    }

    /**
     * Check if two time ranges overlap
     */
    private boolean isTimeOverlap(java.time.LocalTime start1, java.time.LocalTime end1,
            java.time.LocalTime start2, java.time.LocalTime end2) {
        return !start1.isAfter(end2.minusMinutes(1)) && !end1.isBefore(start2.plusMinutes(1));
    }

    /**
     * Convert DayOfWeek to Vietnamese
     */
    private String getDayOfWeekVietnamese(Schedule.DayOfWeek day) {
        switch (day) {
            case MONDAY:
                return "Thứ 2";
            case TUESDAY:
                return "Thứ 3";
            case WEDNESDAY:
                return "Thứ 4";
            case THURSDAY:
                return "Thứ 5";
            case FRIDAY:
                return "Thứ 6";
            case SATURDAY:
                return "Thứ 7";
            case SUNDAY:
                return "Chủ nhật";
            default:
                return "";
        }
    }
}
