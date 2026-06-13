import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { SeedService } from './seed.service';

@Module({
  imports: [RedisModule],
  providers: [SeedService],
})
export class SeedModule {}
