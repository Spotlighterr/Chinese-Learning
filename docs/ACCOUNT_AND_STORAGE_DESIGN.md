# Tài khoản học viên và chuyển kho dữ liệu

Trạng thái: thiết kế đề xuất ngày 2026-10-07; chưa triển khai hay thay dữ liệu production.

## Mục tiêu và ranh giới

- Mỗi học viên có tài khoản riêng và tiếp tục học trên nhiều thiết bị.
- Giữ đầy đủ tiến độ đang nằm dưới cookie ẩn danh khi học viên tạo hoặc đăng nhập tài khoản.
- Giữ app qua Tailscale Serve HTTPS hiện có; không thay route Cloudflare/TTV-REC.
- Nội dung khóa học biên tập vẫn ở mã nguồn có phiên bản cho đến khi có công cụ quản trị nội dung. Chuyển dữ liệu học viên trước, không vội chuyển toàn bộ seed sang database.

## Vai trò của từng thành phần

| Thành phần | Dữ liệu giữ | Tính bền vững |
| --- | --- | --- |
| PostgreSQL | tài khoản, hash mật khẩu, phiên đăng nhập, hồ sơ, bài đã làm, từ lưu, lịch ôn, mã chuyển tiến độ | nguồn dữ liệu chính, phải sao lưu và thử phục hồi |
| Valkey | giới hạn lần đăng nhập/đăng ký/khôi phục, cache ngắn hạn và tác vụ tạm sau này | dữ liệu tạm, mất Valkey không được làm mất tiến độ học |
| Cookie trình duyệt | mã phiên ngẫu nhiên; không chứa tiến độ hay mật khẩu | `HttpOnly`, `Secure`, `SameSite=Lax` hoặc `Strict` trên HTTPS |

Valkey không thay PostgreSQL trong vai trò lưu tiến độ. Phiên đăng nhập có bản ghi và khả năng thu hồi ở PostgreSQL; Valkey chỉ dùng để tăng tốc/giới hạn truy cập. Nếu Valkey lỗi, tạm chặn các thao tác xác thực cần giới hạn tốc độ, còn phiên đã đăng nhập vẫn có thể đọc tiến độ từ PostgreSQL.

## Luồng tài khoản đầu tiên

1. Giai đoạn đầu: học viên được mời tạo tài khoản bằng email và mật khẩu; thêm đăng ký tự do sau khi có email xác minh/khôi phục và chống lạm dụng. Không yêu cầu đăng nhập để xem thử bài học.
2. Mật khẩu lưu bằng Argon2id với salt riêng; không lưu mật khẩu hay token đăng nhập trong `localStorage`. Thông báo lỗi đăng nhập/khôi phục không tiết lộ email đã tồn tại hay chưa.
3. Sau đăng nhập, tạo phiên mới và vô hiệu phiên ẩn danh cũ để tránh cố định phiên. Hỗ trợ đăng xuất thiết bị hiện tại và tất cả thiết bị, hết hạn phiên, đổi/quên mật khẩu và xác minh email trước khi mở đăng ký đại trà.
4. Các API ghi dữ liệu xác nhận nguồn yêu cầu (Origin/CSRF), phân quyền theo `user_id` từ phiên phía server, không nhận `user_id` từ payload. Vai trò ban đầu chỉ `learner` và `admin`; không làm quyền giáo viên trước khi có chức năng tương ứng.
5. Người học có trang quản lý tài khoản: đổi mật khẩu, xem phiên đang hoạt động, xuất và xóa dữ liệu học tập. Email chỉ dùng cho tài khoản/khôi phục, không đưa vào thống kê công khai.

## Dữ liệu và chuyển tiến độ

- `users(id, email_normalized, password_hash, email_verified_at, created_at)`; `auth_sessions(id_hash, user_id, expires_at, revoked_at, created_at)`; bảng profile/progress/SRS tham chiếu `user_id`. Dùng ID ổn định cho bài học/câu hỏi như hiện tại.
- Viết migration có phiên bản từ SQLite sang PostgreSQL: chụp bản sao SQLite, đếm từng bảng trước/sau, chạy thử phục hồi, rồi mới chuyển ứng dụng đọc PostgreSQL. Giữ bản SQLite để rollback trong thời gian đầu.
- Trên cùng host HTTPS, cookie ẩn danh được đổi thành tài khoản trong một giao dịch: nối các câu/từ đã hoàn thành, giữ lịch sử lượt làm, tránh bản ghi trùng và cập nhật lịch ôn mà không lùi thời gian ôn. Bước gộp phải chạy được nhiều lần mà không nhân đôi dữ liệu.
- Người học từng dùng `http://100.80.180.36:3031` có cookie thuộc **host IP**, không tự chuyển sang `https://ubuntuserver01.tailf97613.ts.net:8443`. Trang cũ phải cấp mã chuyển tiến độ một lần, hết hạn nhanh; người học nhập mã này ở trang HTTPS sau khi đăng nhập. Không giả định hai host chia sẻ cookie.
- Trước khi bật đăng nhập thật, kiểm tra ít nhất ba tình huống: tài khoản mới từ trình duyệt đang có tiến độ; đăng nhập tài khoản cũ từ thiết bị mới; gộp hai tiến độ khác nhau không mất câu trả lời hoặc lịch ôn.

## Triển khai và vận hành

1. Thêm PostgreSQL và Valkey vào Compose trong mạng nội bộ, không publish cổng của chúng ra host/tailnet. Dùng volume riêng, healthcheck và secret ngoài Git; chỉ web đi qua Tailscale Serve HTTPS.
2. Đưa schema PostgreSQL, migration và test tích hợp vào CI. Chuyển kho dữ liệu ẩn danh trước khi mở đăng nhập, để tách rủi ro database khỏi rủi ro xác thực.
3. Thêm đăng ký theo lời mời, đăng nhập/đăng xuất, nối tiến độ, giới hạn lượt thử bằng Valkey, rồi kiểm tra giao diện `vi-VN` trên hai thiết bị.
4. Sao lưu PostgreSQL định kỳ, kiểm tra khôi phục, giám sát lỗi đăng nhập và kết nối database. Không coi volume Docker là bản sao lưu.
5. Chỉ đổi luồng người dùng production sau khi URL HTTPS, cookie `Secure`, chuyển tiến độ và rollback đã được kiểm chứng. Cổng HTTP cũ chỉ phục vụ chuyển tiến độ/điều hướng trong giai đoạn chuyển tiếp.

## Quyết định còn cần chốt khi viết chức năng

- Nhà cung cấp email để xác minh/khôi phục tài khoản; nếu chưa có, chỉ mở tài khoản theo lời mời và kênh khôi phục do quản trị viên xử lý.
- Chính sách giữ dữ liệu và thời hạn phiên khi mở rộng ra ngoài tailnet.
- Có cần thêm đăng nhập bằng passkey sau vòng email/mật khẩu đầu tiên hay không.

## Tài liệu kỹ thuật tham khảo

- [OWASP: lưu mật khẩu](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [quản lý phiên](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [chống CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
- [PostgreSQL: sao lưu và phục hồi](https://www.postgresql.org/docs/current/backup.html).
- [Valkey: thời hạn key](https://valkey.io/commands/set/) và [lựa chọn lưu bền](https://valkey.io/docs/topics/persistence/).
