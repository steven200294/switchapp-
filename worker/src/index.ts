import { Worker } from "bullmq";
import IORedis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL environment variable is required");
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "default",
  async (job) => {
    console.log(`[worker] processing job ${job.id} — ${job.name}`);
    // Job handlers will be registered here per domain
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`[worker] job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] job ${job?.id} failed:`, err.message);
});

console.log("[worker] listening for jobs...");
