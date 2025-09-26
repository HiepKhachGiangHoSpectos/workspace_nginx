const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
    res.json({ status: 'ok', message });
});

app.listen(3001, () => console.log('Push server listening on port 3001'));
