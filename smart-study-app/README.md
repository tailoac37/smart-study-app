# Smart Study App - Ứng Dụng Quản Lý Học Tập Thông Minh

## 📚 Tổng Quan

Ứng dụng Desktop quản lý học tập với đầy đủ tính năng:
- ✅ Quản lý thời khóa biểu
- ✅ Quản lý deadline bài tập/đồ án
- ✅ Nhắc nhở học tập tự động
- ✅ Tính điểm trung bình (GPA)
- ✅ Chia sẻ tài liệu theo môn học
- ✅ Ghi chú theo môn học
- ✅ Đăng nhập/Đăng ký
- ✅ Thông báo real-time
- ✅ Báo cáo thống kê

## 🏗️ Kiến Trúc

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL
- **Security**: Spring Security + JWT
- **ORM**: JPA/Hibernate

### Frontend (Electron + React)
- **Desktop Framework**: Electron
- **UI Framework**: React
- **Styling**: CSS với theme màu xanh dương
- **State Management**: React Hooks

## 📦 Cấu Trúc Dự Án

```
smart-study-app/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/studyapp/
│   │   ├── model/             # Entity models
│   │   │   ├── User.java
│   │   │   ├── Subject.java
│   │   │   ├── Schedule.java
│   │   │   ├── Assignment.java
│   │   │   ├── Grade.java
│   │   │   ├── Document.java
│   │   │   ├── Note.java
│   │   │   └── Notification.java
│   │   ├── repository/        # JPA Repositories
│   │   ├── service/           # Business Logic
│   │   ├── controller/        # REST Controllers
│   │   ├── security/          # JWT & Security Config
│   │   ├── dto/              # Data Transfer Objects
│   │   └── SmartStudyApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/                   # Electron + React Frontend
    ├── public/
    ├── src/
    │   ├── components/        # React Components
    │   ├── pages/            # Page Components
    │   ├── services/         # API Services
    │   ├── utils/            # Utilities
    │   ├── styles/           # CSS Styles
    │   ├── App.jsx
    │   └── main.js           # Electron Main Process
    └── package.json
```

## 🗄️ Database Schema

### Users Table
- id, username, password, fullName, email, phone
- studentId, major, className, role, active
- createdAt, updatedAt

### Subjects Table
- id, code, name, description, credits
- teacher, semester, color
- createdAt, updatedAt

### Schedules Table
- id, user_id, subject_id
- dayOfWeek, startTime, endTime
- room, building, type
- startDate, endDate, notes
- createdAt, updatedAt

### Assignments Table
- id, user_id, subject_id
- title, description, type
- deadline, priority, status
- completedAt, attachmentUrl, notes
- reminderEnabled, reminderMinutes
- createdAt, updatedAt

### Grades Table
- id, user_id, subject_id
- examName, type, score, weight, maxScore
- notes, examDate
- createdAt, updatedAt

### Documents Table
- id, user_id, subject_id
- title, description, type
- fileUrl, fileName, fileSize, fileExtension
- isPublic, downloadCount, viewCount, tags
- createdAt, updatedAt

### Notes Table
- id, user_id, subject_id
- title, content, type, color
- isPinned, isFavorite, tags
- createdAt, updatedAt

### Notifications Table
- id, user_id
- title, message, type
- isRead, actionUrl, relatedId
- createdAt, readAt

## 🚀 Hướng Dẫn Cài Đặt

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+
- npm hoặc yarn

### Backend Setup

1. **Tạo Database MySQL**:
```sql
CREATE DATABASE smart_study_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Cấu hình Database** (đã có trong `application.properties`):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_study_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

3. **Build và Run Backend**:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### Frontend Setup

1. **Cài đặt dependencies**:
```bash
cd frontend
npm install
```

2. **Run Development Mode**:
```bash
npm run dev
```

3. **Build Desktop App**:
```bash
npm run build
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin user

### Subjects
- `GET /api/subjects` - Lấy danh sách môn học
- `POST /api/subjects` - Tạo môn học mới
- `PUT /api/subjects/{id}` - Cập nhật môn học
- `DELETE /api/subjects/{id}` - Xóa môn học

### Schedules
- `GET /api/schedules` - Lấy thời khóa biểu
- `GET /api/schedules/today` - Lịch học hôm nay
- `POST /api/schedules` - Thêm lịch học
- `PUT /api/schedules/{id}` - Cập nhật lịch học
- `DELETE /api/schedules/{id}` - Xóa lịch học

### Assignments
- `GET /api/assignments` - Lấy danh sách bài tập
- `GET /api/assignments/upcoming` - Bài tập sắp đến hạn
- `GET /api/assignments/overdue` - Bài tập quá hạn
- `POST /api/assignments` - Tạo bài tập mới
- `PUT /api/assignments/{id}` - Cập nhật bài tập
- `PUT /api/assignments/{id}/status` - Cập nhật trạng thái
- `DELETE /api/assignments/{id}` - Xóa bài tập

### Grades
- `GET /api/grades` - Lấy danh sách điểm
- `GET /api/grades/subject/{subjectId}` - Điểm theo môn
- `GET /api/grades/gpa` - Tính GPA tổng
- `GET /api/grades/subject/{subjectId}/average` - Điểm TB môn học
- `POST /api/grades` - Thêm điểm
- `PUT /api/grades/{id}` - Cập nhật điểm
- `DELETE /api/grades/{id}` - Xóa điểm

### Documents
- `GET /api/documents` - Lấy danh sách tài liệu
- `GET /api/documents/public` - Tài liệu công khai
- `GET /api/documents/subject/{subjectId}` - Tài liệu theo môn
- `POST /api/documents` - Upload tài liệu
- `PUT /api/documents/{id}` - Cập nhật tài liệu
- `DELETE /api/documents/{id}` - Xóa tài liệu
- `GET /api/documents/{id}/download` - Tải tài liệu

### Notes
- `GET /api/notes` - Lấy danh sách ghi chú
- `GET /api/notes/pinned` - Ghi chú đã ghim
- `GET /api/notes/subject/{subjectId}` - Ghi chú theo môn
- `POST /api/notes` - Tạo ghi chú mới
- `PUT /api/notes/{id}` - Cập nhật ghi chú
- `PUT /api/notes/{id}/pin` - Ghim/bỏ ghim
- `DELETE /api/notes/{id}` - Xóa ghi chú

### Notifications
- `GET /api/notifications` - Lấy danh sách thông báo
- `GET /api/notifications/unread` - Thông báo chưa đọc
- `GET /api/notifications/count` - Số thông báo chưa đọc
- `PUT /api/notifications/{id}/read` - Đánh dấu đã đọc
- `PUT /api/notifications/read-all` - Đánh dấu tất cả đã đọc

### Statistics
- `GET /api/stats/overview` - Tổng quan
- `GET /api/stats/assignments` - Thống kê bài tập
- `GET /api/stats/grades` - Thống kê điểm số
- `GET /api/stats/study-time` - Thống kê thời gian học

## 🎨 Giao Diện

### Màu Chủ Đạo: Xanh Dương
- Primary: `#2563eb` (Blue 600)
- Secondary: `#3b82f6` (Blue 500)
- Accent: `#60a5fa` (Blue 400)
- Dark: `#1e40af` (Blue 800)
- Light: `#dbeafe` (Blue 100)

### Các Trang Chính
1. **Dashboard** - Tổng quan, thống kê
2. **Thời Khóa Biểu** - Lịch học theo tuần
3. **Bài Tập** - Quản lý deadline
4. **Điểm Số** - Quản lý và tính GPA
5. **Tài Liệu** - Chia sẻ file
6. **Ghi Chú** - Note-taking
7. **Thông Báo** - Notification center
8. **Cài Đặt** - Settings

## 🔔 Tính Năng Nhắc Nhở

Backend sẽ tự động kiểm tra và gửi thông báo:
- Nhắc deadline bài tập (trước 1 giờ, 1 ngày, 1 tuần)
- Nhắc lịch học (trước 30 phút)
- Thông báo điểm mới
- Thông báo tài liệu mới được chia sẻ

## 📊 Báo Cáo Thống Kê

- Biểu đồ điểm số theo thời gian
- Tỷ lệ hoàn thành bài tập
- Thống kê thời gian học theo môn
- GPA theo học kỳ
- Top môn học có điểm cao/thấp

## 🔐 Bảo Mật

- JWT Authentication
- Password encryption (BCrypt)
- Role-based access control
- Secure file upload

## 📝 Ghi Chú Phát Triển

### Các Service Cần Tạo Thêm
Tất cả các service sẽ follow pattern:
```java
@Service
public class XxxService {
    @Autowired
    private XxxRepository repository;
    
    // CRUD methods
    public List<Xxx> getAll() { }
    public Xxx getById(Long id) { }
    public Xxx create(Xxx entity) { }
    public Xxx update(Long id, Xxx entity) { }
    public void delete(Long id) { }
}
```

### Các Controller Cần Tạo Thêm
```java
@RestController
@RequestMapping("/api/xxx")
@CrossOrigin(origins = "*")
public class XxxController {
    @Autowired
    private XxxService service;
    
    // REST endpoints
}
```

## 🐛 Troubleshooting

### Backend không start
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra username/password trong `application.properties`
- Kiểm tra port 8080 có bị chiếm không

### Frontend không kết nối được Backend
- Kiểm tra backend đã chạy chưa
- Kiểm tra CORS configuration
- Kiểm tra API URL trong frontend config

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Log của backend trong console
2. Network tab trong DevTools
3. Database có tạo đúng chưa

## 🎯 Roadmap

### Phase 1 (Hiện tại)
- [x] Setup project structure
- [x] Database models
- [x] Repositories
- [ ] Services & Controllers
- [ ] JWT Authentication

### Phase 2
- [ ] Frontend UI
- [ ] API Integration
- [ ] File upload
- [ ] Notifications

### Phase 3
- [ ] Statistics & Reports
- [ ] Desktop notifications
- [ ] Auto reminders
- [ ] Polish & Testing

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-03
