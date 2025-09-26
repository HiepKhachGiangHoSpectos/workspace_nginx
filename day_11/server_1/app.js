const express = require('express');
const app = express();

app.get('/news/:slug', (req, res) => {
    res.send(`Server 1: new article at /news/${req.params.slug}`);
});

app.listen(8083, () => console.log('Server 1 running on 8083'));
