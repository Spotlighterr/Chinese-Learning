# Triển khai Chinese Decoder qua Tailscale

Compose chỉ quản lý `chinese-decoder-web`, dùng project name riêng `chinese-decoder` và volume `chinese-decoder-data`. Cổng `3031` của host chỉ bind vào địa chỉ Tailscale của Debian (`100.80.180.36` tại thời điểm thiết lập), không nghe trên LAN/WAN hay sửa Cloudflare Tunnel/TTV-REC. Uptime Kuma đã dùng cổng host `3001`.

```sh
git clone https://github.com/Spotlighterr/Chinese-Learning.git /home/spotlighter/Chineseapp
cd /home/spotlighter/Chineseapp
TAILSCALE_IP="$(tailscale ip -4)" docker compose -f deploy/docker-compose.yml up -d --build
docker compose -f deploy/docker-compose.yml ps
docker exec chinese-decoder-web node -e "fetch('http://127.0.0.1:3001/api/health').then(r=>r.text()).then(console.log)"
```

Từ một thiết bị đã vào cùng tailnet, mở `http://100.80.180.36:3031/`. Có thể thay `TAILSCALE_IP` và `TAILSCALE_PORT` khi cần. Kết nối Tailscale bảo vệ đường truyền trong tailnet; website hiện dùng HTTP trên IP Tailscale nên cookie `Secure` được để `false`. Nếu chuyển sang Tailscale Serve HTTPS sau này, đổi cookie sang `Secure=true`.

Để cập nhật, chạy `git pull --ff-only origin main` trong `/home/spotlighter/Chineseapp` rồi chạy lại Compose với `TAILSCALE_IP="$(tailscale ip -4)"`. Volume SQLite được giữ lại khi thay container. Sao lưu volume trước thay đổi schema lớn. Phiên học hiện gắn cookie trình duyệt, chưa có tài khoản hay đồng bộ thiết bị.
