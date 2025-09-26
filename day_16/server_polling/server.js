const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const cors = require('cors');
const app = express();
app.use(cors());

let counter = 0;

app.get('/data', (req, res) => {
    counter++;
    res.json({ time: new Date().toISOString(), value: counter });
});

const server = http.createServer(app);

// WebSocket tại path /ws
const wss = new WebSocket.Server({ server, path: '/ws' });
wss.on('connection', ws => {
  console.log('Client connected WS');
  ws.send('WebSocket connected to server_polling');
  ws.on('message', msg => {
    console.log('Received from client:', msg);
    ws.send(`[server_polling echo]: ${msg}`);
  });
});
// Broadcast dữ liệu mỗi 2s
setInterval(() => {
  counter++;
  const payload = JSON.stringify({
    time: new Date().toISOString(),
    value: counter
  });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}, 2000);

// Quan trọng: dùng server.listen, không dùng app.listen
server.listen(3000, () => console.log('Polling server listening on port 3000'));
