import Redis from 'ioredis';

const redis = new Redis({ host: 'redis', port: 6379 });

const sub = new Redis({ host: 'redis', port: 6379 });

sub.subscribe('cache_invalidation', (err, count) => {
    if (err) console.error(err);
    else console.log(`Subscribed to ${count} channel(s)`);
});

sub.on('message', async (channel, message) => {
    const { key } = JSON.parse(message);
    console.log(`Invalidating cache key: ${key}`);

    // Xóa key trong Redis
    try {
        await redis.del(key);
        console.log(`Cache key ${key} deleted`);
    } catch (err) {
        console.error(err);
    }

    // Có thể gọi OpenResty purge API nếu muốn purge gateway cache layer
});
