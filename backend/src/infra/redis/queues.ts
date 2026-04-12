import { Queue } from 'bullmq';
import { getRedisConnection } from './connection.js';

export const QUEUE_NAMES = {
  GEOCODING: 'geocoding',
} as const;

let geocodingQueue: Queue | null = null;

export function getGeocodingQueue(): Queue {
  if (!geocodingQueue) {
    geocodingQueue = new Queue(QUEUE_NAMES.GEOCODING, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 200 },
      },
    });
  }
  return geocodingQueue;
}
