const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let messages = [];

// client POST send message
app.post('/send', (req, res) => {
    const msg = req.body.message;
    messages.push({ time: Date.now(), message: msg });
    res.json({ status: 'sent' });
});

// client GET receive (poll new messages)
app.get('/receive', (req, res) => {
    res.json(messages);
});

const server = http.createServer(app);

// WebSocket (chat)
const wss = new WebSocket.Server({ server, path: '/ws' });
wss.on('connection', ws => {
    ws.send('Connected to server_chat. Send message to echo.');
    ws.on('message', msg => {
        console.log('[server_chat nhận]:', msg);
        // broadcast tới tất cả client khác (trừ người gửi)
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`[Chat broadcast]: ${msg}`);
            }
        });
    });
});

server.listen(3002, () => console.log('Chat server listening on port 3002'));
