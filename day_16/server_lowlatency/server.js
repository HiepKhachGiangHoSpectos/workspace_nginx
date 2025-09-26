const express = require('express');
const Redis = require('ioredis');
const app = express();
app.use(express.json());

const redis = new Redis({ host: 'redis_pubsub' });

app.post('/update', (req, res) => {
    const message = req.body.message || `Update at ${new Date().toISOString()}`;
    redis.publish('lowlatency_channel', message);
    res.json({ status: 'published', message });
});

app.listen(3003, () => console.log('Lowlatency backend listening on 3003'));
