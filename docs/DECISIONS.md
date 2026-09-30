# Quyết định kỹ thuật

## 2026-10-01 — Website có frontend và backend

Người dùng xác nhận chỉ cần website nhưng phải có cả frontend và backend. Chọn React + TypeScript + Vite, Express và SQLite để có lát cắt chạy được cục bộ với ít hạ tầng. Chưa dùng Next.js/PostgreSQL vì chưa có yêu cầu SSR, tài khoản hay môi trường triển khai; đây là lựa chọn có thể thay đổi khi nhu cầu rõ hơn.

## 2026-10-01 — Vietnamese-first ở cả giao diện và dữ liệu

`vi-VN` là mặc định. Chuỗi UI nằm trong i18n; nghĩa và giải thích của nội dung nằm trong dữ liệu theo locale. `en-US` là tùy chọn. Bất kỳ bài học mới nào cũng phải hoàn thành được bằng tiếng Việt.

## 2026-10-01 — Sentence Decoder trước dashboard

Xây luồng đọc/chọn từ/chữ/tách từ trước, vì đây là luận điểm chính của sản phẩm. Chỉ lưu các chỉ số có ý nghĩa: câu đã hiểu, từ đã lưu, lượt luyện; không tối ưu streak.

## 2026-10-01 — Phiên học ẩn danh cho lát cắt đầu

Backend tạo cookie HttpOnly và lưu tiến độ theo phiên. Điều này cho phép kiểm tra lưu tiến độ xuyên lần tải trang mà chưa phải xây xác thực ngay. Không xem đây là giải pháp tài khoản cho sản phẩm công khai.
