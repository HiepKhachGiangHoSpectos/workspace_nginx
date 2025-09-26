// cache-invalidation/worker.js
import {Kafka} from "kafkajs";
import Redis from "ioredis";
import fs from "fs-extra";
import path from "path";
import express from "express";
import client from "prom-client";

const app = express();
const PORT = 3002; // metrics server port

const redis = new Redis({host: "redis", port: 6379});

// Bắt lỗi Redis global để worker không crash
redis.on("error", (err) => {
    console.error("[ioredis] Redis error:", err.message);
});

// Kafka setup
const kafka = new Kafka({clientId: "cache-invalidation", brokers: ["kafka:9092"]});
const consumer = kafka.consumer({groupId: "cache-invalidation-group"});

const FAILED_FILE = path.join("/app", "failed_cache.json");
let failedQueue = fs.existsSync(FAILED_FILE) ? fs.readJSONSync(FAILED_FILE) : [];

// --- Prometheus metrics ---
const register = new client.Registry();

const messagesReceived = new client.Counter({
    name: 'cache_messages_received_total', help: 'Total messages received from Kafka'
});
const messagesSuccess = new client.Counter({
    name: 'cache_messages_success_total', help: 'Total messages successfully deleted from Redis'
});
const messagesFailed = new client.Counter({
    name: 'cache_messages_failed_total', help: 'Total messages failed and pushed to failed queue'
});
const failedQueueGauge = new client.Gauge({
    name: 'failed_queue_size', help: 'Number of keys in failed queue'
});

register.registerMetric(messagesReceived);
register.registerMetric(messagesSuccess);
register.registerMetric(messagesFailed);
register.registerMetric(failedQueueGauge);

// Endpoint Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(PORT, () => console.log(`Metrics server running on port ${PORT}`));


async function retryDelete(key) {
    const MAX_RETRY = 3;
    let attempt = 0;
    while (attempt < MAX_RETRY) {
        try {
            await redis.del(key);
            console.log(`Deleted cache key ${key}`);
            return true;
        } catch (err) {
            attempt++;
            console.error(`Retry ${attempt} failed for key ${key}:`, err.message);
            await new Promise(r => setTimeout(r, 2000)); // delay retry 2s
        }
    }
    failedQueue.push({key, timestamp: Date.now()});
    fs.writeJSONSync(FAILED_FILE, failedQueue, {spaces: 2});
    console.warn(`Saved key ${key} to failed queue`);
    return false;
}

// Xử lý failed queue định kỳ
async function processFailedQueue() {
    if (failedQueue.length === 0) return;
    console.log("Processing failed queue...");
    const newQueue = [];
    for (const item of failedQueue) {
        try {
            await redis.del(item.key);
            console.log(`Deleted failed key ${item.key}`);
        } catch (err) {
            console.warn(`Still failed for key ${item.key}:`, err.message);
            newQueue.push(item);
        }
    }
    failedQueue = newQueue;
    fs.writeJSONSync(FAILED_FILE, failedQueue, {spaces: 2});
    failedQueueGauge.set(failedQueue.length);
}

// Main
async function run() {
    await consumer.connect();
    await consumer.subscribe({topic: "cache_invalidate", fromBeginning: true});

    await consumer.run({
        eachMessage: async ({message}) => {
            const key = message.value.toString();
            messagesReceived.inc();
            console.log(`Received cache invalidate for key: ${key}`);
            const ok = await retryDelete(key);
            if (ok) messagesSuccess.inc(); else messagesFailed.inc();
            failedQueueGauge.set(failedQueue.length);
        }
    });

    setInterval(processFailedQueue, 10000);
}

run().catch(err => {
    console.error("Cache invalidation worker crashed:", err);
    process.exit(1);
});
