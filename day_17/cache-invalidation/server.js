import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis({ host: 'redis', port: 6379 });

// API purge cache
app.post('/purge', async (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: 'Missing key' });

    try {
        await redis.del(key);
        console.log(`Cache key deleted: ${key}`);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete cache' });
    }
});

app.listen(3001, () => console.log('Cache Invalidation running on port 3001'));
