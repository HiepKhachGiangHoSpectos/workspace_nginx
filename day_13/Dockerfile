FROM nginx:1.28.0

# Copy file config vào image
COPY nginx.conf /etc/nginx/nginx.conf

# Tùy chọn: cài thêm gói benchmark (ví dụ ab)
RUN apt-get update && apt-get install -y apache2-utils && rm -rf /var/lib/apt/lists/*
