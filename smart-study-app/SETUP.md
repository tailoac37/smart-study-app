# 🚀 Hướng Dẫn Chạy Smart Study App

## 📋 Yêu Cầu Hệ Thống

### Backend
- Java 17 trở lên
- Maven 3.6+
- MySQL 8.0+

### Frontend
- Node.js 18+
- npm hoặc yarn

## 🔧 Cài Đặt và Chạy

### Bước 1: Cài Đặt MySQL Database

1. Mở MySQL Workbench hoặc MySQL Command Line
2. Tạo database mới:

```sql
CREATE DATABASE smart_study_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Cập nhật thông tin kết nối trong file `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Bước 2: Chạy Backend (Spring Boot)

Mở terminal trong thư mục `backend`:

```bash
cd backend

# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

Backend sẽ chạy tại: **http://localhost:8080**

Bạn sẽ thấy thông báo:
```
==============================================
Smart Study App Backend is running!
Server: http://localhost:8080
==============================================
```

### Bước 3: Cài Đặt Frontend Dependencies

Mở terminal MỚI trong thư mục `frontend`:

```bash
cd frontend

# Cài đặt dependencies
npm install
```

**Lưu ý**: Quá trình cài đặt có thể mất 2-5 phút.

### Bước 4: Chạy Frontend (Development Mode)

Sau khi cài đặt xong, chạy lệnh:

```bash
# Chạy Vite dev server
npm run dev
```

Vite sẽ chạy tại: **http://localhost:5173**

### Bước 5: Chạy Electron Desktop App

Mở terminal MỚI (thứ 3) trong thư mục `frontend`:

```bash
# Chạy Electron (đảm bảo Vite đang chạy ở terminal khác)
npm run electron
```

Hoặc chạy cả 2 cùng lúc:

```bash
npm run electron:dev
```

Ứng dụng Desktop sẽ tự động mở!

## 📱 Sử Dụng Ứng Dụng

### Đăng Nhập

Hiện tại app đang dùng mock authentication. Bạn có thể đăng nhập với bất kỳ username/password nào.

**Ví dụ:**
- Username: `student`
- Password: `123456`

### Các Tính Năng Hiện Có

✅ **Hoàn Thành:**
- Đăng nhập/Đăng ký (UI)
- Dashboard với thống kê
- Sidebar navigation
- Header với thông tin user
- Responsive design
- Giao diện màu xanh dương đẹp mắt

🚧 **Đang Phát Triển:**
- Thời khóa biểu
- Quản lý bài tập
- Quản lý điểm số
- Tài liệu
- Ghi chú
- Thông báo
- Cài đặt

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Port 8080 already in use"
**Giải pháp:** Có ứng dụng khác đang chạy trên port 8080. Tắt ứng dụng đó hoặc thay đổi port trong `application.properties`:
```properties
server.port=8081
```

### Lỗi: "Cannot connect to MySQL"
**Giải pháp:** 
1. Kiểm tra MySQL đã chạy chưa
2. Kiểm tra username/password trong `application.properties`
3. Kiểm tra database `smart_study_db` đã được tạo chưa

### Lỗi: "npm ERR! code ENOENT"
**Giải pháp:** Chạy lại `npm install` trong thư mục frontend

### Lỗi: Electron không mở
**Giải pháp:** 
1. Đảm bảo Vite dev server đang chạy (http://localhost:5173)
2. Chờ 5-10 giây để Vite khởi động hoàn toàn
3. Thử chạy lại `npm run electron`

## 📦 Build Desktop App (Production)

### Build Frontend

```bash
cd frontend
npm run build
```

### Build Electron App

```bash
npm run electron:build
```

File cài đặt sẽ được tạo trong thư mục `frontend/dist-electron/`

## 🎨 Tùy Chỉnh

### Thay Đổi Màu Chủ Đạo

Mở file `frontend/src/index.css` và thay đổi các biến CSS:

```css
:root {
  --primary: #2563eb;  /* Màu xanh dương chính */
  --primary-dark: #1e40af;
  --primary-light: #3b82f6;
}
```

### Thay Đổi Logo

Thay thế file `frontend/public/icon.png` bằng logo của bạn.

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra log trong terminal
2. Kiểm tra console trong DevTools (F12)
3. Đảm bảo tất cả dependencies đã được cài đặt
4. Đảm bảo MySQL đang chạy

## 🎯 Roadmap Phát Triển

### Phase 1 (Hiện Tại) ✅
- [x] Setup project structure
- [x] Database models
- [x] Basic UI/UX
- [x] Authentication UI
- [x] Dashboard

### Phase 2 (Tiếp Theo)
- [ ] Hoàn thiện API Backend
- [ ] Kết nối Frontend với Backend
- [ ] CRUD cho tất cả tính năng
- [ ] File upload
- [ ] Notifications

### Phase 3 (Tương Lai)
- [ ] Statistics & Charts
- [ ] Desktop notifications
- [ ] Auto reminders
- [ ] Export reports
- [ ] Dark mode

## 📝 Ghi Chú

- App hiện đang ở chế độ development
- Database sẽ tự động tạo tables khi chạy lần đầu (JPA auto-create)
- Mock data được sử dụng cho demo

---

**Chúc bạn sử dụng app vui vẻ! 🎓📚**
