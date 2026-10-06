# Trạng thái công việc — tạm dừng ngày 2026-10-01

## Tiếp tục xây khóa học ngày 2026-10-07

- Nhánh `feature/course-foundation` bổ sung 3 bài đầu về chào hỏi, giới thiệu và việc học, cùng 3 bài dùng lại mẫu câu; tổng cộng hiện có 3 cụm/9 bài/9 câu/23 câu hỏi. Có câu hỏi gõ chữ Hán qua bộ gõ Pinyin, bài nghe hiểu, và chấm trên server.
- API tiến độ trả về các mã câu hỏi từng trả lời đúng; giao diện chọn bài còn thiếu và tiếp tục từ câu chưa xong sau khi tải lại. Lộ trình bài học được nhóm theo cụm và liên kết sang Bộ phân tích câu.
- Kiểm tra toàn vẹn dữ liệu, API chấm gõ chữ Hán, `typecheck`, `test`, `build` đều qua. Chrome với backend thật đã xác nhận hồ sơ, trắc nghiệm, gõ Hán tự, tiếp tục bài sau tải lại; viewport 390px không tràn ngang.
- Xem `docs/COURSE_BUILD.md` để biết thứ tự mở rộng và tiêu chí gọi là khóa học hoàn chỉnh. Chưa phủ nội dung HSK 1–6; chưa chấm chuẩn phát âm/thanh điệu. Nhánh này chưa được đưa lên `main` hoặc server.
- Đã kiểm kê bộ PDF/MP3 HSK 1–6 mới có trong workspace, xác định đây là bộ Giáo trình chuẩn HSK sáu cấp cũ; xem `docs/HSK_SOURCE_AUDIT.md`. File sách/MP3 được giữ cục bộ, không đưa lên Git hoặc vào app. Bài nghe hiểu dùng giọng tổng hợp từ câu tự biên soạn.
- Tiến độ hoàn thành bài được tính từ các câu hỏi hiện hành; nếu bài có thêm câu hỏi mới thì bài được mở lại cho đến khi trả lời đủ. Chrome với backend thật đã kiểm tra liên tiếp lựa chọn, nghe hiểu, gõ chữ Hán, tải lại và tiếp tục bài sau; viewport 390px không tràn ngang.

## CI/CD chuẩn bị ngày 2026-10-07

- Đã viết workflow GitHub Actions kiểm tra push/PR và chỉ đánh dấu commit `main` qua CI lên `deploy/production`.
- Đã viết timer Debian để kéo nhánh đã kiểm tra, fast-forward checkout, build Compose và xác nhận health trước khi ghi nhận SHA đã triển khai.
- Đã chuẩn bị Tailscale Serve HTTPS cổng `8443` cho luyện nói; route HTTPS `443` hiện có của dịch vụ khác phải được giữ nguyên. Xem `deploy/README.md`.
- Người dùng đã xác nhận kho GitHub và server. Đã push `main`, CI thành công, triển khai commit `4c61eb1`, bật timer và Serve HTTPS `:8443`; SQLite đã được sao lưu trước khi cập nhật.
- Máy làm việc lúc kiểm tra chưa kết nối được tailnet, nên URL HTTPS được xác nhận từ chính Debian (HTTP/2 200 và `/api/health` trả `{"ok":true}`); cần kiểm tra lại từ thiết bị người học khi Tailscale hoạt động.

## Tiếp tục ngày 2026-10-06

- Đã `git pull --ff-only` trên `wip/mvp-phase-2`; remote không có commit mới.
- Đã nối API hồ sơ, bài tập và ôn tập vào giao diện: onboarding chọn mục tiêu, buổi học theo hai bài dữ liệu, trả lời câu hỏi, hiển thị từ đến hạn và tự đánh giá ôn tập. Bộ Phân tích câu vẫn nằm trên cùng trang.
- Đã mở rộng kiểm thử API cho hồ sơ, hoàn thành bài học, hàng ôn tập; `typecheck`, `test`, `build` đều qua.
- Cần kiểm tra luồng trong trình duyệt với backend thật, đặc biệt trên màn hình hẹp và khi đổi ngôn ngữ. Chưa merge vào `main`, push hay triển khai Debian.
- Mốc 2 chưa hoàn chỉnh: cần mở rộng nội dung và kiểm tra trải nghiệm người học ở nhiều thiết bị; bảng tiến độ hiện chỉ phản ánh các hoạt động đã lưu, chưa đánh giá năng lực toàn diện.

### Cập nhật tiếp trong ngày

- Đã thêm bài học thứ ba cho câu thời tiết và bảng tiến độ gọn (câu đã hiểu, bài hoàn thành, từ cần ôn).
- Đã thêm luyện nói thử nghiệm: nghe mẫu tiếng Trung, ghi âm/nghe lại, đồ thị biên độ và cao độ ước tính, điểm khớp nội dung nhận dạng khi trình duyệt hỗ trợ. Điểm này chưa chấm chuẩn thanh điệu/phát âm.
- Đã kiểm tra trong Chrome headless với API thật: giao diện tiếng Việt render, lưu onboarding hoạt động, đổi sang tiếng Anh giữ nội dung tiếng Trung, nộp bài có phản hồi; tại viewport 390px không còn tràn ngang toàn trang.
- Với micro giả lập, ghi âm/nghe lại hoạt động và đồ thị xuất 80 cột biên độ cùng các đoạn cao độ ước tính. Nhận dạng tiếng Trung không trả lời trong môi trường kiểm tra này nên không hiển thị điểm. Vẫn cần thử micro, giọng đọc và nhận dạng trên thiết bị thật.

## Bản ổn định đã triển khai

- `main` tại commit `60bfcd5`; repo GitHub `Spotlighterr/Chinese-Learning` đã đồng bộ.
- Debian checkout: `/home/spotlighter/Chineseapp`, container `chinese-decoder-web`, Docker Compose project `chinese-decoder`, volume SQLite `chinese-decoder-data`.
- Truy cập qua Tailscale: `http://100.80.180.36:3031/`. Đã xác nhận HTTP 200 từ máy làm việc; container healthy và `/api/health` trả `{"ok":true}`.
- Cổng host `3031` chỉ bind vào IP Tailscale. Uptime Kuma vẫn dùng cổng host `3001`; TTV-REC và `cloudflared-tncb` không bị thay đổi.
- Chưa dùng tên miền hay thêm route Cloudflare cho Chinese Decoder, theo yêu cầu của người dùng.

## Công việc dở dang đã lưu trên nhánh `wip/mvp-phase-2`

- Đã thêm dữ liệu hai bài học trong `src/data/lessons.ts`: nhận diện từ/Pinyin/sắp xếp câu và manh mối gợi nghĩa/gợi âm trong nhóm `青`.
- Đã thêm bảng SQLite cho hồ sơ học, lượt làm bài, bài hoàn thành và lịch ôn tập; các bảng được tạo thêm khi backend khởi động trên DB cũ.
- Đã thêm API hồ sơ, chấm bài tập, lấy từ đến hạn ôn và đánh giá ôn tập; logic lịch ôn nằm ở `server/review.ts`.
- `npm.cmd run typecheck` đã qua sau các thay đổi này. Chưa chạy lại test/build đầy đủ và chưa triển khai nhánh dở dang. Test API cũ cần cập nhật vì dạng `Progress` đã có trường mới.

## Việc tiếp theo

1. Cập nhật `src/api/progress.ts` cho `LearningProfile`, tiến độ bài học, hàng ôn tập và các endpoint mới.
2. Làm giao diện onboarding tiếng Việt, buổi học hôm nay/bài tập, và ôn tập từ đã lưu; giữ Sentence Decoder là tính năng chính.
3. Cập nhật test tích hợp cho hồ sơ, chấm bài, lịch ôn và nâng cấp DB; chạy `typecheck`, `test`, `build`, kiểm tra luồng tiếng Việt trong trình duyệt.
4. Khi hoàn thiện, merge vào `main`, push, `git pull --ff-only` tại `/home/spotlighter/Chineseapp`, rồi chạy `TAILSCALE_IP="$(tailscale ip -4)" docker compose -f deploy/docker-compose.yml up -d --build`.
5. Kiểm tra container healthy, HTTP 200 tại IP Tailscale, các API và trạng thái của TTV-REC/Tunnel. Cập nhật `docs/ROADMAP.md` theo phần thực sự hoàn thành.

Không gọi phần này là MVP hoàn chỉnh: frontend chưa nối các API mới, SRS mới ở backend, chưa có tài khoản hay đồng bộ thiết bị.
