local redis = require "resty.redis"
local cjson = require "cjson"

ngx.req.read_body()
local data = ngx.req.get_body_data()
local obj = cjson.decode(data)
local key = obj.key

local red = redis:new()
red:set_timeout(1000)
local ok, err = red:connect("redis", 6379)
if not ok then
    ngx.status = 500
    ngx.say("failed to connect redis: ", err)
    return
end

red:del(key)
ngx.say("purged key: ", key)
