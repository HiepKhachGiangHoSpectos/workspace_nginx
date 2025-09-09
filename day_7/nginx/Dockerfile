FROM nginx:alpine

# Xóa default config
RUN rm /etc/nginx/conf.d/default.conf || true

# Copy config gzip/cache vào container
COPY gzip_cache.conf /etc/nginx/conf.d/gzip_cache.conf
