# Mô hình dữ liệu

## Nội dung học hiện tại

`Character` có chữ Hán, Pinyin, nghĩa theo `vi-VN`/`en-US`, quan hệ thành phần gợi nghĩa/gợi âm và nhóm gợi âm nếu đã biên tập. `Word` có ID, mặt chữ, Pinyin, nghĩa và ghi chú theo locale. `Sentence` có chuỗi ID từ theo thứ tự, bản dịch, mục tiêu và giải thích theo locale. Ranh giới từ được suy từ chuỗi token, không từ tách từ tự động không kiểm soát.

`src/data/curriculum.ts` hiện là nguồn seed. Việc liên kết từ cùng chữ được tính từ dữ liệu từ. Không ghi mỗi từ thành một nghĩa tiếng Anh duy nhất; dữ liệu nội dung phải hỗ trợ ngôn ngữ ở tầng dữ liệu.

## Tiến độ trên server

`sessions(id, created_at)`; `saved_words(session_id, word_id)`; `completed_sentences(session_id, sentence_id)`; `segmentation_attempts(session_id, sentence_id, correct, extra, total, created_at)`. Một phiên tương ứng một trình duyệt có cookie. Server lấy đáp án đúng từ token của câu; frontend gửi các vị trí người học chọn.

## Mở rộng sau

Tách nội dung biên tập thành thực thể `Component`, `PhoneticFamily`, `GrammarPattern`, `Lesson`, `Exercise`, `AudioAsset`, `ReviewItem`, `SRSState`, `ErrorRecord`, `HSKStandard` và bảng mapping có phiên bản. Lưu xuất xứ và trạng thái kiểm duyệt cho phân tích ngôn ngữ; phân biệt nghĩa tiếng Trung hiện đại, nghĩa tiếng Việt và quan hệ Hán-Việt.
