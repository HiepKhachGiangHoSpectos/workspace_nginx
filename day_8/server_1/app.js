const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Server 1');
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server 1 running on port ${PORT}`);
});
