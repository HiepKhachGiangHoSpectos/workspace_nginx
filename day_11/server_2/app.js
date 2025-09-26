const express = require('express');
const app = express();

app.get('/news/:slug', (req, res) => {
    res.send(`Server 2: new article at /news/${req.params.slug}`);
});

app.listen(8082, () => console.log('Server 2 running on 8082'));
