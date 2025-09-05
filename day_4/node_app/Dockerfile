# Sử dụng image Node nhỏ gọn
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# chỉ cài lib thôi, khong can copy code nua
COPY package*.json ./

# Chạy app.js bằng Node
CMD ["node", "app.js"]
