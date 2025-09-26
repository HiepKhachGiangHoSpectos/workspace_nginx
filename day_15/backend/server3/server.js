const express = require('express');
const app = express();
const PORT = 3003;

app.get('/', (req, res) => {
    res.send('Hello from server3');
});

app.get('/health', (req, res) => res.sendStatus(200));

app.listen(PORT, () => console.log(`Server1 listening on ${PORT}`));
