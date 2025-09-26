local redis = require "resty.redis"
local red = redis:new()
red:set_timeout(1000)
assert(red:connect("redis", 6379))

ngx.req.read_body()
local args = ngx.req.get_uri_args()
local key = args["key"]

if not key then
  ngx.status = 400
  ngx.say("Missing ?key=")
  return
end

local res, err = red:del(key)
if not res then
  ngx.status = 500
  ngx.say("DEL error: ", err)
  return
end

ngx.say("Cache purged: ", key)
