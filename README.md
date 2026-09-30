# Chinese Decoder

Website học tiếng Trung dành trước tiên cho người Việt. Lát cắt hiện tại là **Phân tích câu**: đọc câu, chọn từ và chữ Hán, xem manh mối gợi nghĩa/gợi âm, ẩn dần trợ giúp, rồi luyện tách từ. Giao diện mặc định là `vi-VN`; `en-US` là tùy chọn.

## Chạy cục bộ

Yêu cầu Node.js 24 và npm. Từ thư mục `Chineseapp`:

```powershell
npm.cmd install
npm.cmd run dev
```

Mở `http://localhost:5173`. Vite chuyển `/api` sang backend tại `http://127.0.0.1:3001`. Cơ sở dữ liệu SQLite được tạo tự động ở `.data/chinese-decoder.sqlite`.

## Kiểm tra và build

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd start
```

Sau `build`, `start` phục vụ cả website và API tại `http://localhost:3001`. Có thể đặt `PORT`, `DATABASE_PATH`, `COOKIE_SECURE` bằng biến môi trường. Khi triển khai sau HTTPS, đặt `COOKIE_SECURE=true` và chỉ truy cập qua HTTPS. `.env.example` liệt kê các biến nhưng ứng dụng không tự nạp file `.env`.

Triển khai bằng Docker trên Debian: xem [deploy/README.md](deploy/README.md).

## Đã có

- Ba câu mẫu với dữ liệu từ và chữ Hán tách khỏi giao diện; trọng tâm là ranh giới từ và nhóm gợi âm `青`.
- Bốn mức trợ giúp, nghĩa câu theo yêu cầu, bộ xem từ/chữ, quan hệ từ cùng chữ, bài luyện tách từ.
- Backend Express + SQLite lưu câu đã hiểu, từ đã lưu và kết quả luyện tách từ theo phiên học ẩn danh; server tự chấm đáp án.
- Giao diện và giải thích tiếng Việt mặc định, có tùy chọn tiếng Anh.

## Giới hạn hiện tại

Đây là lát cắt đầu tiên, chưa phải MVP hoàn chỉnh: chưa có tài khoản, đồng bộ nhiều thiết bị, âm thanh, SRS, lộ trình 180 ngày hay kho nội dung mở rộng. Phiên ẩn danh gắn với cookie của trình duyệt. Nội dung tiếng Trung mẫu cần được biên tập ngôn ngữ trước khi mở rộng quy mô. Không triển khai công khai như hệ thống nhiều người dùng cho đến khi có xác thực và cấu hình bảo mật phù hợp.

Đọc [AGENTS.md](AGENTS.md) và các tài liệu trong [docs](docs) trước khi phát triển tiếp.
