const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Hello from server1');
});

app.get('/health', (req, res) => res.sendStatus(200));

app.listen(PORT, () => console.log(`Server1 listening on ${PORT}`));
