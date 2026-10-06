# Xây khóa học đầy đủ

## Trạng thái hiện tại

Phiên bản dữ liệu `foundation-2026-10` có 4 cụm, 12 bài, 12 câu và 30 câu hỏi. Đây là phần nhập môn tự biên soạn, chưa được xác nhận là danh mục HSK chính thức. Mục tiêu HSK trong hồ sơ là đích học của người dùng, không phải nhãn chứng nhận cho nội dung hiện có.

## Thứ tự triển khai

1. Hoàn thiện vòng học ở mức nhập môn: giải mã câu, nghe mẫu, luyện nói, chọn đáp án, xếp từ, gõ Hán tự bằng bộ gõ Pinyin, lưu từng câu đúng, tiếp tục từ câu chưa xong và ôn tập. Kiểm tra luồng tiếng Việt và tiếng Anh trên máy tính và điện thoại.
2. Mở rộng nội dung theo tình huống và mẫu câu, theo thứ tự tăng dần: giao tiếp cá nhân, gia đình, thời gian, số lượng, mua sắm, di chuyển, học tập/công việc, kể chuyện, giải thích ý kiến, văn bản dài. Mỗi bài phải có câu tự nhiên, từ và chữ có thể tra cứu, Pinyin, nghĩa/giải thích tiếng Việt, bài nghe, luyện tập và tiêu chí hoàn thành.
3. Đối chiếu nội dung với **một bản đề cương HSK được ghi rõ phiên bản** trước khi gắn nhãn cấp. Ghi nguồn, phiên bản, ngày đối chiếu và phạm vi từng ánh xạ. Giữ HSK 1–6 là các mốc đánh giá; năng lực nghe, nói, đọc, viết và dịch cần có bài đánh giá riêng.
4. Thêm bài kiểm tra theo kỹ năng và báo cáo lỗ hổng thực tế; xây bài ôn thích ứng theo lỗi của người học. Giọng đọc tổng hợp và điểm khớp nội dung hiện chỉ hỗ trợ luyện tập, chưa chấm chuẩn âm vị/thanh điệu.

## Quy tắc dữ liệu và phát hành

- `src/data/course.ts` là thứ tự bài được phát hành; mỗi mã bài xuất hiện đúng một lần. Tiến độ lưu bằng ID ổn định để mở rộng mà không làm mất dữ liệu cũ.
- Nội dung Trung Quốc và giải thích `vi-VN`/`en-US` nằm trong dữ liệu, không viết riêng trong UI. Bài học phải có đủ dữ liệu tham chiếu và vượt kiểm tra toàn vẹn trước khi phát hành.
- Không chép nguyên đề cương hoặc ngân hàng câu hỏi bên thứ ba vào sản phẩm nếu chưa xác định quyền sử dụng.
- Chỉ ghi mức độ hoàn thành của phần đã học trong app. Không suy ra mức HSK hoặc khả năng phát âm từ số câu đã bấm xong.

## Điều kiện gọi là khóa học hoàn chỉnh

Nội dung từng cấp đã được biên tập và đối chiếu; đủ bài tập nghe, nói, đọc, gõ/viết theo mục tiêu; các bài kiểm tra tổng kết có ngưỡng đạt; luồng học và ôn tập giữ tiến độ qua phiên/thiết bị; kiểm thử trên thiết bị thật; bản quyền và nguồn dữ liệu được ghi rõ. Các điều kiện này hiện chưa đạt.
