import express from 'express';
import bodyParser from 'body-parser';
import Redis from 'ioredis';

const app = express();
app.use(bodyParser.json());

const redis = new Redis({
  host: 'redis', // container name
  port: 6379,
});

let users = {
  1: { id: 1, name: 'Alice', age: 20 },
  2: { id: 2, name: 'Bob', age: 25 },
};

// GET user (gateway sẽ cache kết quả)
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const user = users[id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// UPDATE user
app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!users[id]) return res.status(404).json({ error: 'User not found' });

  users[id] = { ...users[id], ...data };

  // Publish event cho Cache Invalidation Service
  try {
    await redis.publish('cache_invalidation', JSON.stringify({
      key: `user:${id}`,
    }));
  } catch (err) {
    console.error('Failed to publish cache invalidation', err);
  }

  res.json(users[id]);
});

app.listen(3000, () => console.log('Backend server listening on 3000'));
