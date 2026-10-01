# Trạng thái công việc — tạm dừng ngày 2026-10-01

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
