import express from "express";
import { Kafka } from "kafkajs";

const app = express();
app.use(express.json());

let users = {
    "1": { id: 1, name: "Alice" },
    "2": { id: 2, name: "Bob" },
};

// Kafka setup
const kafka = new Kafka({ clientId: "backend", brokers: ["kafka:9092"] });
const producer = kafka.producer();

await producer.connect();

// Publish cache invalidation
async function publishCacheInvalidate(key) {
    await producer.send({
        topic: "cache_invalidate",
        messages: [{ key, value: key }],
    });
    console.log("Published cache invalidation for", key);
}

// GET user
app.get("/user/:id", (req, res) => {
    const user = users[req.params.id];
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log('============== ge user=========', user)
    res.json(user);
});

// PUT user
app.put("/user/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    if (!users[id]) return res.status(404).json({ error: "User not found" });
    users[id] = { ...users[id], ...data };

    // call Cache Invalidation
    await publishCacheInvalidate(`user:${id}`);

    res.json(users[id]);
});

app.listen(3000, () => console.log("Backend app running on port 3000"));
