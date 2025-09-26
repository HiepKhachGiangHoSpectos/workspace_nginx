local redis = require "resty.redis"
local red = redis:new()
red:set_timeout(1000)
assert(red:connect("redis", 6379))

ngx.req.read_body()
local cjson = require "cjson.safe"
local data = cjson.decode(ngx.req.get_body_data())

if not data or not data.key then
    ngx.status = 400
    ngx.say("missing key")
    return
end

red:del(data.key)
ngx.say("deleted ", data.key)
