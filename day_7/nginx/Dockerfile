FROM nginx:alpine

# Xoá default config nếu muốn
RUN rm /etc/nginx/conf.d/default.conf || true

# Copy file cấu hình reverse proxy tới php-fpm
COPY default.conf /etc/nginx/conf.d/default.conf
