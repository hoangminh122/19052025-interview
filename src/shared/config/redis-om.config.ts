import { CacheModule } from '@nestjs/common';
import { Client } from 'redis-om';
import * as redisStore from 'cache-manager-redis-store';
require('dotenv').config();

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const redisUrl = `redis://${redisHost}:${redisPort}`;

const client = new Client();

const connectClient = async () => {
  if (!client.isOpen()) {
    console.log('Connecting to Redis at:', redisUrl);
    await client.open(redisUrl);
  }
};

const cacheModuleInstance = CacheModule.register({
  isGlobal: true,
  store: redisStore as any,
  host: redisHost,
  port: redisPort,
  ttl: Number(process.env.CACHE_TTL_IN_SECOND) || 600,
  max: Number(process.env.CACHE_MAX_ITEM) || 100,
});

export {
  client,
  connectClient,
  cacheModuleInstance
};
