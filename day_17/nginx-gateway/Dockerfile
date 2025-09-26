FROM openresty/openresty:alpine-fat

# Cài đặt luarocks để cài thêm module nếu cần
RUN apk add --no-cache luarocks \
    && luarocks install lua-resty-redis \
    && luarocks install lua-resty-http

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY lua/ /usr/local/openresty/nginx/lua/

CMD ["openresty", "-g", "daemon off;"]
