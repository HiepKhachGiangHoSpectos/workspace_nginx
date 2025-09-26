const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let counter = 0;

app.get('/status', (req, res) => {
    counter++;
    res.json({ time: new Date().toISOString(), counter });
});

app.listen(3003, () => console.log('Low latency server listening on port 3003'));
