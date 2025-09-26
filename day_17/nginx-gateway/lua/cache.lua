local redis = require "resty.redis"
local http  = require "resty.http"

local user_id = ngx.var.uri:match("/user/(%d+)")
if not user_id then
    ngx.status = 400
    ngx.say("user id missing")
    return
end

local key = "user:" .. user_id

-- Hàm gọi backend
local function fetch_from_backend(uid)
    local httpc = http.new()
    local res, err = httpc:request_uri("http://backend:3000/user/" .. uid, {
        method = "GET",
    })
    if not res then
        ngx.log(ngx.ERR, "Backend request failed: ", err)
        return nil, err
    end
    return res, nil
end

-- Kết nối Redis
local red = redis:new()
red:set_timeout(1000)
local ok, err = red:connect("redis", 6379)
if not ok then
    ngx.log(ngx.ERR, "Redis connect failed: ", err)

    -- Fallback gọi backend
    local backend_res, err2 = fetch_from_backend(user_id)
    if not backend_res then
        ngx.status = 500
        ngx.say("backend error")
        return
    end
    ngx.status = backend_res.status
    ngx.say(backend_res.body)
    return
end

-- Nếu kết nối Redis ok, thử lấy cache
local res, err = red:get(key)
if res and res ~= ngx.null then
    ngx.say(res)
    return
end

-- Cache miss: gọi backend
local backend_res, err2 = fetch_from_backend(user_id)
if not backend_res then
    ngx.status = 500
    ngx.say("backend error")
    return
end

-- Trả dữ liệu cho client
ngx.status = backend_res.status
ngx.say(backend_res.body)

-- Thử lưu cache (write-through)
local ok_set, err3 = red:set(key, backend_res.body)
if not ok_set then
    ngx.log(ngx.WARN, "Failed to set cache: ", err3)
end
