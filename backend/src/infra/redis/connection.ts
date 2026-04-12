import IORedis from 'ioredis';
import { env } from '../../config/env.js';

let instance: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (!instance) {
    instance = new IORedis(env.redis.url, { maxRetriesPerRequest: null });
  }
  return instance;
}
