# Kiến trúc và đánh giá ban đầu

## Trạng thái trước khi triển khai

Repo chỉ có `AGENTS.md`; chưa có framework, mã ứng dụng, package manager lockfile, database hay test. Không có thành phần cũ cần chuyển đổi.

## Lát cắt hiện tại

- **Frontend:** React + TypeScript strict + Vite. `src/data/curriculum.ts` chứa dữ liệu seed có nghĩa/giải thích theo locale. `src/i18n.ts` chứa chuỗi giao diện. Component trình bày không giữ kho bài học trong JSX.
- **Backend:** Express trên Node 24. API cùng origin qua Vite proxy khi dev; bản build phục vụ frontend và API từ một server. `server/segmentation.ts` chấm ranh giới từ trên server.
- **Lưu trữ:** SQLite của Node tại `.data/`. Cookie HttpOnly tạo phiên học ẩn danh. Các bảng có khóa ngoại và ràng buộc cơ bản cho từ lưu, câu hoàn thành, lần luyện tách từ.
- **Đường chạy:** `npm run dev` khởi động cả Vite và API; `npm run build` kiểm tra TypeScript, build frontend và backend; `npm start` phục vụ bản build.

## Quyết định và giới hạn

Website hiện là lát cắt cục bộ. Cookie ẩn danh không phải tài khoản và không đồng bộ giữa thiết bị. Chưa có người dùng, quyền truy cập, API nội dung hay công cụ biên tập. `node:sqlite` trên Node 24 còn ở giai đoạn phát triển của Node; cần đánh giá lại khi triển khai quy mô lớn. Trước khi công khai, bổ sung xác thực, chính sách cookie/HTTPS, migration và backup. Dữ liệu seed cần kiểm duyệt ngôn ngữ.

Khi cần nhiều bài học hoặc nhiều người dùng, chuyển seed vào kho dữ liệu có migration và quản lý phiên được xác thực. Không gắn kiến trúc với một phiên bản HSK cố định.
