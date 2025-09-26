local redis = require "resty.redis"
local red = redis:new()
red:set_timeout(1000)
assert(red:connect("redis", 6379))

local user_id = ngx.var.uri:match("/user/(%d+)")
if not user_id then
    ngx.status = 400
    ngx.say("user id missing")
    return
end

local key = "user:" .. user_id
local res, err = red:get(key)
if res and res ~= ngx.null then
    ngx.say(res)
    return
end

-- cache miss: call backend
local http = require "resty.http"
local httpc = http.new()
local backend_res, err = httpc:request_uri("http://backend:3000/user/" .. user_id, { method = "GET" })
if not backend_res then
    ngx.status = 500
    ngx.say("backend error")
    return
end

-- save to cache
red:set(key, backend_res.body)
ngx.say(backend_res.body)
