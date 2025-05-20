import { CacheModule } from '@nestjs/common/cache';
import { Client } from 'redis-om'
import * as redisStore from 'cache-manager-redis-store';

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` || '';  
const client = new Client()

const connectClient = async () => {
  if (!client.isOpen()) {
    await client.open('redis://localhost:6379')
  }
}

const cacheModuleInstance = CacheModule.register({
  store: redisStore as any,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // auth_pass: process.env.REDIS_PASSWORD,
  isGlobal: true,
  ttl: Number(process.env.CACHE_TTL_IN_SECOND) || 10000,
  max: Number(process.env.CACHE_MAX_ITEM) || 100,
})

export {
  client,
  connectClient,
  cacheModuleInstance
};