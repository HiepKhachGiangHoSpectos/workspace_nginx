import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(bodyParser.json());

let users = {
    1: { id: 1, name: 'Alice eee' },
    2: { id: 2, name: 'Bob' },
};

// API get user
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    if (users[id]) res.json(users[id]);
    else res.status(404).json({ error: 'User not found' });
});

// API update user
app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    if (!users[id]) return res.status(404).json({ error: 'User not found' });
    // update DB
    users[id] = { ...users[id], ...data };

    // call cache invalidation
    try {
        await fetch('http://cache-invalidation:3001/purge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: `user:${id}` }),
        });
    } catch (err) {
        console.error('Failed to purge cache', err);
    }

    res.json(users[id]);
});

app.listen(3000, () => console.log('Backend running on port 3000'));
