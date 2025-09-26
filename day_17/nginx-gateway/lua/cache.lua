local redis = require "resty.redis"
local cjson = require "cjson"

local red = redis:new()
red:set_timeout(1000)
local ok, err = red:connect("redis", 6379)
if not ok then
    ngx.status = 500
    ngx.say("failed to connect redis: ", err)
    return
end

-- Tính key
local user_id = ngx.var.uri:match("/user/(%d+)")
if not user_id then
    ngx.status = 400
    ngx.say("Bad request: missing user id")
    return
end

local key = "user:" .. user_id

-- Thử đọc cache
local res, err = red:get(key)
if res and res ~= ngx.null then
    ngx.say(res)
    return
end

-- Nếu cache không có, gọi backend
local http = require "resty.http"
local httpc = http.new()
local backend_res, err = httpc:request_uri("http://backend:3000/user/" .. user_id, {
    method = "GET",
})
if not backend_res then
    ngx.status = 500
    ngx.say("backend error: ", err)
    return
end

-- Lưu cache
red:set(key, backend_res.body)

ngx.say(backend_res.body)
