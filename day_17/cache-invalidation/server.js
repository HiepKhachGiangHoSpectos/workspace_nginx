// cache-invalidation/worker.js
import {Kafka} from "kafkajs";
import Redis from "ioredis";
import fs from "fs-extra";
import path from "path";

const redis = new Redis({host: "redis", port: 6379});

// Bắt lỗi Redis global để worker không crash
redis.on("error", (err) => {
    console.error("[ioredis] Redis error:", err.message);
});

// Kafka setup
const kafka = new Kafka({clientId: "cache-invalidation", brokers: ["kafka:9092"]});
const consumer = kafka.consumer({groupId: "cache-invalidation-group"});

// Path lưu tạm các key failed (mock DB)
const FAILED_FILE = path.join("/app", "failed_cache.json");

// Load file failed cache (nếu có)
let failedQueue = [];
if (fs.existsSync(FAILED_FILE)) {
    try {
        failedQueue = fs.readJSONSync(FAILED_FILE);
    } catch (err) {
        console.error("Failed to read failed queue:", err.message);
    }
}

const MAX_RETRY = 3;

// Retry xóa key
async function retryDelete(key, attempt = 0) {
    try {
        const result = await redis.del(key);
        console.log(`Deleted cache key ${key}, result=${result}`);
        return true;
    } catch (err) {
        attempt++;
        console.warn(`Retry ${attempt} failed for key ${key}:`, err.message);
        if (attempt < MAX_RETRY) {
            // Thử lại sau 1s
            await new Promise(res => setTimeout(res, 1000));
            return retryDelete(key, attempt);
        } else {
            // Push vào failedQueue
            failedQueue.push({key, timestamp: Date.now()});
            try {
                await fs.writeJSON(FAILED_FILE, failedQueue, {spaces: 2});
                console.warn(`Saved key ${key} to failed queue`);
            } catch (err) {
                console.error("Failed to write failed queue:", err.message);
            }
            return false;
        }
    }
}

// Xử lý failed queue định kỳ
async function processFailedQueue() {
    if (!failedQueue.length) return;
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
    try {
        await fs.writeJSON(FAILED_FILE, failedQueue, {spaces: 2});
    } catch (err) {
        console.error("Failed to write failed queue:", err.message);
    }
}

// Main
async function run() {
    await consumer.connect();
    await consumer.subscribe({topic: "cache_invalidate", fromBeginning: true});

    await consumer.run({
        eachMessage: async ({message}) => {
            const key = message.value.toString();
            console.log(`Received cache invalidate for key: ${key}`);
            console.log('================dang cho 20s ==================')
            // CHỜ 20 GIÂY TRƯỚC KHI GỌI retryDelete
            await new Promise((resolve) => setTimeout(resolve, 20000));
            console.log('================da cho 20s==================')
            await retryDelete(key);
        },
    });

    // Định kỳ xử lý failed queue
    setInterval(processFailedQueue, 10000); // 10s
}

run().catch(err => {
    console.error("Cache invalidation worker crashed:", err);
    process.exit(1);
});
