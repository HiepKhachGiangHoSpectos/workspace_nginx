const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let message = "initial data";
// mo 2 tab, mot la trinh duyet, mot la postman
// client GET data
app.get('/data', (req, res) => {
    res.json({ time: new Date().toISOString(), message });
});

// admin POST update data
app.post('/update', (req, res) => {
    message = req.body.message || message;
    // broadcast tới tất cả client đang kết nối
    wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`[Push broadcast]: ${message}`);
    }
  });
  res.json({ status: 'ok', broadcasted: message });
    res.json({ status: 'ok', message });
});

const server = http.createServer(app);

// WebSocket (server push test)
const wss = new WebSocket.Server({ server, path: '/ws' });
wss.on('connection', ws => {
    ws.send('WebSocket connected to server_push');
    // gửi message định kỳ để giả lập push
    const interval = setInterval(() => {
        ws.send(`[server_push push] ${new Date().toISOString()}`);
    }, 2000);

    ws.on('close', () => clearInterval(interval));
});

server.listen(3001, () => console.log('Push server listening on port 3001'));
