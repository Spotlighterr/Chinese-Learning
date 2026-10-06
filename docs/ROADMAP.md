# Roadmap

## Mốc 1 — Lát cắt Phân tích câu (đã triển khai)

Website frontend/backend chạy cục bộ; giao diện `vi-VN` mặc định; dữ liệu câu/từ/chữ có locale; chọn token, xem thành phần và nhóm gợi âm; bốn mức trợ giúp; bài tách từ được server chấm; lưu tiến độ SQLite.

## Mốc 2 — MVP đầy đủ

Onboarding tiếng Việt; hồ sơ mục tiêu; bài học và bài tập điều khiển bằng dữ liệu; SRS cơ bản; dashboard năng lực; kiểm thử toàn bộ luồng không cần tiếng Anh; tăng nội dung seed đã biên tập. Hiện nhánh WIP đã có onboarding, ba bài seed, ôn tập cơ bản và bảng tiến độ gọn. Cần kiểm tra trải nghiệm người học và nội dung ở quy mô thực tế trước khi gọi là MVP đầy đủ.

## Mốc 3 — Năng lực mở rộng

Phòng phát âm và audio; luyện nghe/nói; lưu câu; trình đọc văn bản; ngữ pháp theo mẫu; gợi ý thích ứng; mapping HSK có phiên bản; đề thử. Nhánh WIP đã có bản thử nghiệm nghe mẫu, ghi âm, nghe lại, đồ thị biên độ/cao độ và điểm khớp nội dung nhận dạng. Chấm thanh điệu/phát âm chuẩn vẫn cần mô hình chuyên dụng và dữ liệu tham chiếu. AI tutor giải thích bằng tiếng Việt mặc định, không thay dữ liệu ngôn ngữ đã kiểm duyệt.

## Trước khi triển khai công khai

Thêm tài khoản/xác thực, migration dữ liệu, sao lưu, rà soát quyền riêng tư, chính sách cookie và HTTPS. Đánh giá việc giữ SQLite hay chuyển PostgreSQL theo số người dùng thực tế.
