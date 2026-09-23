# 🦉 E-SMART ENGLISH KIDS
### Ứng dụng Chuyển Đổi Số Dạy và Học Tiếng Anh Tiểu Học - Chương Trình GDPT 2018 (Global Success Lớp 1 & Lớp 2)

Ứng dụng web toàn diện tích hợp Trí tuệ Nhân tạo (Gemini AI), đồng bộ cơ sở dữ liệu học sinh trực tuyến từ **Google Sheets**, cổng đăng nhập bảo mật riêng tư theo **Họ tên & Số thứ tự (STT)**, và hệ thống hoạt động **Fun Time Hub** phong phú.

---

## 🌟 Tính Năng Nổi Bật

### 1. Đồng Bộ Trực Tuyến Danh Sách Lớp từ Google Sheets
- Kết nối trực tiếp với bảng tính Google Sheets của trường học / giáo viên qua đường dẫn chia sẻ hoặc CSV xuất bản.
- Backend proxy bypass CORS an toàn (`/api/sheets/sync`), nhận diện linh hoạt các cột tiếng Việt/Anh (`STT`, `Mã HS`, `Họ và tên`, `Lớp`, `SĐT`, `Email`, `Trạng thái`).
- Hỗ trợ tải bảng tính mẫu, tải lên tệp CSV và quản lý danh sách học sinh.

### 2. Cổng Đăng Nhập Bảo Mật & Riêng Tư Học Sinh (Privacy Login Gate)
- Mỗi học sinh khi vào học phải nhập đúng **Họ và tên** cùng **Số thứ tự (STT)** được giáo viên cấp.
- Chặn hoàn toàn việc học sinh tùy ý xem trộm bài học, điểm số, bản ghi âm giọng nói hay thư khen của bạn khác (khóa menu đổi học sinh ở chế độ Học sinh).
- Xác thực mã PIN (`1234`) khi chuyển từ chế độ Học sinh sang Giáo viên hoặc Quản trị viên.

### 3. Nội Dung Global Success Lớp 1 & Lớp 2 + Trạm Hoạt Động Fun Time Hub
- Bám sát khung chương trình Sách giáo khoa Tiếng Anh Global Success (Bộ GD&ĐT, 16 Units/khối).
- **Fun Time Hub** tương tác đa giác quan với 4 chặng đánh giá định kỳ (Milestones 1-4):
  - 🎡 **Vòng Quay Kỳ Diệu (Lucky Phonics Wheel)**: Quay thưởng từ vựng và thử thách phát âm với hiệu ứng pháo hoa confetti.
  - 🎵 **Karaoke Sing-Along Chant**: Đồng bộ từng dòng lời bài chant tiếng Anh, kết hợp giọng đọc AI chuẩn bản xứ.
  - 🎲 **Đường Đua Thử Thách (Adventure Board Game)**: Lắc xúc xắc 3D di chuyển qua các ô thử thách nghe, nói, hát.
  - 🧩 **Giải Đố Phản Xạ (Odd One Out Puzzle)**: Tìm từ khác biệt về mặt ngữ nghĩa và ngữ âm.

### 4. Công Cụ Sư Phạm Dành Cho Giáo Viên
- Hiển thị rõ ràng STT học sinh trong danh sách lớp.
- Tính năng **Sao chép danh sách cấp STT**: Định dạng sẵn văn bản chuyên nghiệp gửi Zalo cho phụ huynh học sinh.
- **Xuất phiếu bài tập ôn tập chuẩn sư phạm (Printable Worksheets)**: Tạo và in ngay phiếu bài tập ôn tập từng chặng Fun Time (hỗ trợ in hoặc lưu file PDF trực tiếp).
- Cấp Thư khen AI (AI Praise Letter) và Chứng chỉ hoàn thành có mã số xác thực.

### 5. Tích Hợp Gemini AI & Quản Lý Khóa API
- Nút cảnh báo màu đỏ trên Header nhắc nhở người dùng nhập API key: *"Lấy API key để sử dụng app"*.
- Modal cấu hình API key cá nhân hóa từ Google AI Studio (`aistudio.google.com/api-keys`).
- Cơ chế tự động chuyển đổi dự phòng 3 mô hình (Model Fallback Chain):
  `gemini-3-flash-preview` ➔ `gemini-3-pro-preview` ➔ `gemini-2.5-flash`.
- Sẵn sàng triển khai trên **Vercel** (`vercel.json` SPA rewrite).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu cầu
- Node.js (v18 trở lên) hoặc Bun

### Các bước thực hiện
```bash
# 1. Cài đặt các thư viện
npm install

# 2. Tạo tệp .env (tùy chọn nếu người dùng nhập API key trực tiếp trên web)
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# 3. Chạy ứng dụng chế độ phát triển
npm run dev
```

Ứng dụng sẽ hoạt động tại địa chỉ: `http://localhost:3000`

---

## 🏫 Danh Sách Tài Khoản Trải Nghiệm Mẫu

| STT | Mã Học Sinh | Họ và Tên | Lớp | Khối | Giáo Viên Phụ Trách |
|---|---|---|---|---|---|
| **01** | `G1-001` | Nguyễn Nhật Minh | Class 1/1 | Lớp 1 | Cô Thanh Thảo |
| **02** | `G1-002` | Trần Bảo An | Class 1/1 | Lớp 1 | Cô Thanh Thảo |
| **03** | `G1-003` | Lê Gia Huy | Class 1/2 | Lớp 1 | Cô Thanh Thảo |
| **04** | `G1-004` | Phạm Quỳnh Chi | Class 1/2 | Lớp 1 | Cô Thanh Thảo |
| **01** | `G2-001` | Hoàng Minh Khôi | Class 2/3 | Lớp 2 | Cô Hồng Phượng |
| **02** | `G2-002` | Vũ Thùy Linh | Class 2/3 | Lớp 2 | Cô Hồng Phượng |
| **03** | `G2-003` | Đỗ Tuấn Kiệt | Class 2/4 | Lớp 2 | Cô Hồng Phượng |
| **04** | `G2-004` | Bùi Phương Mai | Class 2/4 | Lớp 2 | Cô Hồng Phượng |

*Mã PIN chuyển sang quyền Giáo viên/Quản trị viên:* **`1234`**
