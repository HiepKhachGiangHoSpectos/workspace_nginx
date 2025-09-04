| Ngày | Chủ đề                      | Bài tập                                                    | Tiêu chí “qua ngày”                                     |
| ---- | --------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| 1    | Giới thiệu & cài đặt        | Cài Nginx trên máy hoặc VPS.                               | Truy cập được `http://localhost` và thấy trang welcome. |
| 2    | Cấu trúc config, service    | Xem `nginx.conf`, biết `sites-enabled`, start/stop/reload. | Giải thích được file nào chứa gì, reload mà không lỗi.  |
| 3    | Server block (virtual host) | Tạo 2 site chạy trên 2 domain giả.                         | Truy cập được 2 domain khác nhau.                       |
| 4    | Location & file tĩnh        | Serve file HTML/CSS/JS.                                    | Truy cập file tĩnh không lỗi 404.                       |
| 5    | Logging                     | Tách access/error log riêng cho từng site.                 | Xem được log truy cập của từng site.                    |
| 6    | Gzip, cache cơ bản          | Bật gzip, cache-control.                                   | Dùng devtools kiểm tra header gzip/cache.               |
| 7    | FastCGI/Proxy tới PHP-FPM   | Chạy 1 trang PHP qua Nginx.                                | Trang PHP chạy được, header đúng.                       |
| 8    | Reverse Proxy               | Proxy tới 1 app NodeJS.                  | Request qua Nginx tới backend thành công.           |
| 9    | Load Balancing              | 2 backend NodeJS, round-robin & ip_hash. | Thử nhiều request, thấy luân phiên IP.              |
| 10   | SSL/TLS cơ bản              | Cấu hình HTTPS tự ký.                    | Truy cập site qua `https://` không cảnh báo nội bộ. |
| 11   | Rewrite & redirect nâng cao | Viết rule redirect có điều kiện.         | Test URL cũ → URL mới đúng.                         |
| 12   | Rate limiting & IP block    | Giới hạn 10 req/s, chặn IP.              | Bắn request quá nhiều thấy 503; IP bị block.        |
| 13   | Performance tuning cơ bản   | Chỉnh worker_processes, connections.     | Chạy `ab` hoặc `wrk` thấy cải thiện.                |
| 14   | Monitor stub_status         | Bật stub_status, đọc metric.             | Truy cập `/nginx_status` thấy active connection.    |
| 15   | Dựng hệ thống 3 backend + Nginx LB | NodeJS x3 + LB + health check.                    | Down 1 backend, Nginx tự route sang backend khác. |
| 16   | Proxy WebSocket/HTTP2              | Chạy WebSocket qua Nginx; bật HTTP/2.             | Client kết nối WS ổn định; HTTP/2 active.         |
| 17   | Proxy cache & purge                | Dùng `proxy_cache` cho trang động.                | Hit cache thấy tốc độ tăng; xóa cache thành công. |
| 18   | Bảo mật nâng cao                   | Thêm HSTS, CSP header.                            | Kiểm tra header bằng curl/devtools.               |
| 19   | Logging JSON + gửi log             | Định dạng JSON, gửi sang ELK (hoặc file riêng).   | Log ra đúng format; có thể phân tích.             |
| 20   | CI/CD deploy config                | Viết script reload tự động (Ansible/Bash).        | Thay config, chạy script, reload không downtime.  |
| 21   | Stress test tổng thể               | Dùng `wrk`/`ab` test 10k concurrent; tune sysctl. | Server ổn định, không 502/504 trong test.         |
