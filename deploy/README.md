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

Khi cần cập nhật thủ công trước lúc cài CI/CD, chạy `git pull --ff-only origin main` trong `/home/spotlighter/Chineseapp` rồi chạy lại Compose với `TAILSCALE_IP="$(tailscale ip -4)"`. Sau khi timer hoạt động, để timer quản lý checkout. Volume SQLite được giữ lại khi thay container. Sao lưu volume trước thay đổi schema lớn. Phiên học hiện gắn cookie trình duyệt, chưa có tài khoản hay đồng bộ thiết bị.

## CI/CD

Workflow `.github/workflows/ci-deploy.yml` chạy `npm ci`, audit, typecheck, test và build cho push vào `main`/nhánh WIP và pull request vào `main`. Chỉ sau khi kiểm tra trên `main` thành công, workflow mới đẩy chính commit đó sang nhánh `deploy/production`. Không cần khóa SSH hoặc quyền truy cập tailnet trong GitHub Actions.

Trên Debian, timer `chinese-decoder-deploy.timer` kiểm tra nhánh `deploy/production` khoảng 3 phút một lần. Script `deploy/update-from-github.sh` từ chối checkout bẩn, yêu cầu commit đã kiểm tra thuộc lịch sử `main`, chỉ fast-forward checkout rồi chạy Docker Compose và kiểm tra `/api/health`. Nếu build/health thất bại, lần chạy sau sẽ thử lại cùng commit; dấu `.data/deployed-sha` chỉ cập nhật sau khi kiểm tra thành công.

Cài timer một lần trên Debian sau khi mã nguồn đã có các file này:

```sh
cd /home/spotlighter/Chineseapp
sudo install -m 0644 deploy/systemd/chinese-decoder-deploy.service /etc/systemd/system/
sudo install -m 0644 deploy/systemd/chinese-decoder-deploy.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now chinese-decoder-deploy.timer
sudo systemctl start chinese-decoder-deploy.service
systemctl status chinese-decoder-deploy.service --no-pager
```

Vì micro của trình duyệt cần HTTPS, Compose còn bind cổng `3032` trên loopback để Tailscale Serve làm proxy TLS trên cổng `8443`. Cấu hình một lần bằng `tailscale serve --bg --https=8443 http://127.0.0.1:3032` sau khi container đã cập nhật. Mở `https://ubuntuserver01.tailf97613.ts.net:8443/` trong tailnet để luyện nói. Route Serve hiện có ở cổng `443` vẫn phục vụ dịch vụ khác; cổng `3031` cũ vẫn dùng được cho phần học không cần micro. Không dùng `tailscale funnel`.

Kiểm tra triển khai bằng `systemctl status chinese-decoder-deploy.timer --no-pager`, `journalctl -u chinese-decoder-deploy.service -n 80 --no-pager`, `docker compose -f deploy/docker-compose.yml ps`, và đối chiếu `git rev-parse HEAD` với `.data/deployed-sha`. Nếu cần dừng đồng bộ, chạy `sudo systemctl disable --now chinese-decoder-deploy.timer`.
