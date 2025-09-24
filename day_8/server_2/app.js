const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Server 2');
});

const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Server 2 running on port ${PORT}`);
});
