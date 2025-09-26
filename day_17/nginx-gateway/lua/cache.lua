local redis = require "resty.redis"
local red = redis:new()
red:set_timeout(1000)
red:connect("redis", 6379)

local key = ngx.var.uri  -- ex: /user/1

local res, err = red:get(key)
if res ~= ngx.null then
    ngx.say(res)
else
    -- fetch từ backend
    local http = require "resty.http"
    local httpc = http.new()
    local backend_res, backend_err = httpc:request_uri("http://backend:3000"..ngx.var.uri, { method = "GET" })
    if backend_res.status == 200 then
        red:set(key, backend_res.body, 60)  -- cache 60s
        ngx.say(backend_res.body)
    else
        ngx.status = backend_res.status
        ngx.say(backend_res.body)
    end
end
