// server_lowlatency/server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { EventEmitter } = require('events');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });
const emitter = new EventEmitter();

let lastValue = null; // để tránh gửi trùng

// WebSocket: khi có connection
wss.on('connection', (ws) => {
  console.log('WS client connected');
  ws.send(JSON.stringify({ type: 'welcome', time: new Date().toISOString() }));

  // pong handler cho heartbeat
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (msg) => {
    console.log('Received from client:', msg.toString());
    // tùy cần, xử lý msg từ client
  });
});

// Heartbeat: ping clients để keepalive / detect dead sockets
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    try { ws.ping(() => {}); } catch (e) { /* ignore */ }
  });
}, 30000);

// Khi có event update từ emitter => broadcast tới tất cả client
emitter.on('update', (payload) => {
  const payloadStr = JSON.stringify({ type: 'update', data: payload, time: new Date().toISOString() });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(payloadStr);
  });
});

// public HTTP endpoint: giả lập "có data mới" (admin / upstream gọi vào)
app.post('/update', (req, res) => {
  const newValue = req.body.value;
  if (newValue === undefined) return res.status(400).json({ error: 'missing value' });

  // chỉ broadcast khi value khác với lastValue (tránh gửi trùng)
  if (lastValue === newValue) {
    return res.json({ status: 'no-change', value: newValue });
  }

  lastValue = newValue;
  emitter.emit('update', { value: newValue });
  res.json({ status: 'broadcasted', value: newValue });
});

// health & debug
app.get('/health', (req, res) => res.send('OK'));
app.get('/current', (req, res) => res.json({ lastValue }));

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => console.log(`Low-latency push server listening on ${PORT}`));

// cleanup on exit
process.on('SIGINT', () => {
  clearInterval(heartbeatInterval);
  wss.close();
  server.close(() => process.exit(0));
});
