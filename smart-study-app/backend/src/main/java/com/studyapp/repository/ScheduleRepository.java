package com.studyapp.repository;

import com.studyapp.model.Schedule;
import com.studyapp.model.Schedule.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Tìm lịch học theo Subject
    List<Schedule> findBySubjectId(Long subjectId);

    // Tìm lịch học theo Subject và ngày trong tuần
    List<Schedule> findBySubjectIdAndDayOfWeek(Long subjectId, DayOfWeek dayOfWeek);

    // Tìm lịch học theo Subject trong khoảng thời gian
    List<Schedule> findBySubjectIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long subjectId, LocalDate date1, LocalDate date2);

    // Tìm lịch học theo danh sách Subject IDs (để lấy thời khóa biểu sinh viên)
    @Query("SELECT s FROM Schedule s WHERE s.subject.id IN :subjectIds")
    List<Schedule> findBySubjectIdIn(List<Long> subjectIds);

    // Tìm lịch học theo danh sách Subject IDs và ngày trong tuần
    @Query("SELECT s FROM Schedule s WHERE s.subject.id IN :subjectIds AND s.dayOfWeek = :dayOfWeek")
    List<Schedule> findBySubjectIdInAndDayOfWeek(List<Long> subjectIds, DayOfWeek dayOfWeek);

    // Tìm lịch của giảng viên theo teacherId và ngày trong tuần (để check trùng
    // lịch)
    @Query("SELECT s FROM Schedule s WHERE s.subject.teacher.id = :teacherId AND s.dayOfWeek = :dayOfWeek")
    List<Schedule> findByTeacherIdAndDayOfWeek(Long teacherId, DayOfWeek dayOfWeek);

    // Tìm lịch của sinh viên theo danh sách subjectIds đã đăng ký và ngày (để check
    // trùng lịch)
    @Query("SELECT s FROM Schedule s WHERE s.subject.id IN :subjectIds AND s.dayOfWeek = :dayOfWeek")
    List<Schedule> findByEnrolledSubjectsAndDayOfWeek(List<Long> subjectIds, DayOfWeek dayOfWeek);
}
