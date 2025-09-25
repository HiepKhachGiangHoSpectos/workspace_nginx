const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Server 2');
});

// route chậm
app.get('/slow', (req, res) => {
    console.log(`Received request at ${new Date().toISOString()} on Server 2`);
    setTimeout(() => {
        console.log(`Sending response at ${new Date().toISOString()} on Server 2`);
        res.send('Server 2 took 15 seconds');
    }, 15000);
});

// route CPU nặng
app.get('/cpu', (req, res) => {
    // giả lập CPU bận
    let now = Date.now() + 15000; // 15s
    while (Date.now() < now) {
    }
    res.send('CPU server 2 busy done!');
});

const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Server 2 running on port ${PORT}`);
});
