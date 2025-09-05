# Sử dụng image nginx chính thức
FROM nginx:alpine

# Xoá default config nếu muốn (không bắt buộc)
# || true = nếu lệnh rm lỗi (ví dụ file không tồn tại) thì cũng không dừng build image.
RUN rm /etc/nginx/conf.d/default.conf || true

# Copy file cấu hình reverse proxy vào container
# Nếu bạn mount volume trong docker-compose rồi thì không cần COPY ở đây
# nhưng để demo mình vẫn COPY cho sẵn.
COPY reverse.conf /etc/nginx/conf.d/reverse.conf
