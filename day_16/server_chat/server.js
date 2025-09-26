const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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

app.listen(3002, () => console.log('Chat server listening on port 3002'));
