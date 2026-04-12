import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processGeocodeProperty } from './jobs/geocode-property.js';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is required');
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const JOB_HANDLERS: Record<string, (job: import('bullmq').Job) => Promise<void>> = {
  'geocode-property': processGeocodeProperty,
};

const QUEUE_NAMES = ['geocoding'] as const;

for (const queueName of QUEUE_NAMES) {
  const worker = new Worker(
    queueName,
    async (job) => {
      const handler = JOB_HANDLERS[job.name];
      if (!handler) {
        console.warn(`[worker/${queueName}] unknown job: ${job.name}`);
        return;
      }
      await handler(job);
    },
    {
      connection,
      limiter: { max: 1, duration: 1100 },
    },
  );

  worker.on('completed', (job) => {
    console.log(`[worker/${queueName}] job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[worker/${queueName}] job ${job?.id} failed:`, err.message);
  });

  console.log(`[worker] listening on queue "${queueName}"...`);
}
