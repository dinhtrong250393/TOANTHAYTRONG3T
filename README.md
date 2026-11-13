# QUẢN LÝ ỨNG DỤNG - THẦY TRỌNG 3T

Trang chủ quản lý, hiển thị giao diện và khởi chạy nhanh các ứng dụng web, sẵn sàng đẩy lên **GitHub** và triển khai trên **Vercel**.

## Tính năng chính

- **Thêm ứng dụng nhanh**: Nhập tên ứng dụng, tải ảnh giao diện/logo (tự động căn chỉnh tỷ lệ hiển thị trọn vẹn) và gắn đường link chạy app web.
- **Kích để mở ngay**: Bấm trực tiếp vào thẻ ứng dụng để chạy đường dẫn web trong tab mới.
- **Quản lý linh hoạt**: Chỉnh sửa, xóa, tìm kiếm nhanh và chuyển đổi giao diện Sáng / Tối; dữ liệu lưu tự động trên trình duyệt.

## Triển khai lên GitHub & Vercel

1. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan>/<ten-repo>.git
   git push -u origin main
   ```

2. **Deploy trên Vercel**:
   - Truy cập [vercel.com/new](https://vercel.com/new) và chọn **Import** repository từ GitHub.
   - Vercel tự động nhận diện dự án **Vite** (đã cấu hình sẵn `vercel.json`).
   - Nhấn **Deploy** để hoàn tất.
