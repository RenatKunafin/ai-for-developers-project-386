import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.client = new Redis(redisUrl);
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  async hSet(key: string, data: Record<string, string | number>): Promise<void> {
    const entries = Object.entries(data).flat();
    await this.client.hset(key, ...entries);
  }

  async hGet(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hDel(key: string, field: string): Promise<void> {
    await this.client.hdel(key, field);
  }

  async sAdd(key: string, member: string): Promise<void> {
    await this.client.sadd(key, member);
  }

  async sMembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async sRem(key: string, member: string): Promise<void> {
    await this.client.srem(key, member);
  }

  async sCard(key: string): Promise<number> {
    return this.client.scard(key);
  }

  async zAdd(key: string, score: number, member: string): Promise<void> {
    await this.client.zadd(key, score, member);
  }

  async zRangeByScore(key: string, min: number, max: number): Promise<string[]> {
    return this.client.zrangebyscore(key, min, max);
  }

  async zRem(key: string, member: string): Promise<void> {
    await this.client.zrem(key, member);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async pipeline(commands: Array<['hset' | 'sadd', string, ...unknown[]]>): Promise<void> {
    const pipeline = this.client.pipeline();
    for (const cmd of commands) {
      const [method, key, ...args] = cmd;
      if (method === 'hset') {
        pipeline.hset(key, ...(args as (string | number)[]));
      } else if (method === 'sadd') {
        pipeline.sadd(key, ...(args as string[]));
      }
    }
    await pipeline.exec();
  }
}
