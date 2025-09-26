const http = require('http');
const WebSocket = require('ws');
const Redis = require('ioredis');

// WS gateway lắng WS từ client
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Kết nối Redis subscribe
const redis = new Redis({ host: 'redis_pubsub' });

wss.on('connection', (ws) => {
    ws.send('Connected to WS Gateway');

    // Nếu client gửi gì lên (ví dụ subscribe room)
    ws.on('message', (msg) => {
        ws.send(`Echo from Gateway: ${msg}`);
    });
});

// Nhận event từ Redis, broadcast tới tất cả WS client
redis.subscribe('lowlatency_channel', () => {
    console.log('Subscribed to Redis channel');
});

redis.on('message', (channel, message) => {
    console.log(`New message from Redis: ${message}`);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`[Broadcast from Redis]: ${message}`);
        }
    });
});

server.listen(3000, () => console.log('WS Gateway listening on port 3000'));
