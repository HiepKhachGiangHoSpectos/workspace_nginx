const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

let counter = 0;

// endpoint /data trả về số tăng dần
app.get('/data', (req, res) => {
    counter++;
    res.json({ time: new Date().toISOString(), value: counter });
});

app.listen(3000, () => console.log('Polling server listening on port 3000'));
