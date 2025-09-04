# Day 0 – Chuẩn bị môi trường học Nginx với Docker

## Mục tiêu
Có môi trường Nginx chạy trên Windows bằng Docker để phục vụ cho 21 ngày học Nginx.

## Các bước thực hiện
- Tạo folder `workspace_nginx/day_0`.
- Tạo các file `Dockerfile`, `default.conf`, `docker-compose.yml` và thư mục `html` chứa `index.html`.
- Chạy `docker compose up --build`.
- Truy cập `http://localhost:2800`.

## Kết quả
Hiển thị trang **“Xin chào, Nginx từ Docker!”** trên trình duyệt Windows.