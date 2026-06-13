import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedOwner();
    await this.seedEventTypes();
    this.logger.log('Seed completed');
  }

  private async seedOwner() {
    const exists = await this.redisService.exists('owner:profile');
    if (exists) {
      this.logger.log('Owner already exists, skipping seed');
      return;
    }

    const owner = {
      id: 'owner-1',
      name: this.configService.get<string>('OWNER_NAME', 'Renat Kunafin'),
      email: this.configService.get<string>('OWNER_EMAIL', 'renat@example.com'),
    };

    await this.redisService.hSet('owner:profile', owner);
    this.logger.log('Owner seeded');
  }

  private async seedEventTypes() {
    const count = await this.redisService.sCard('event_types:ids');
    if (count > 0) {
      this.logger.log('EventTypes already exist, skipping seed');
      return;
    }

    const eventTypes = [
      {
        id: 'quick-chat',
        name: 'Быстрый звонок',
        description: '15-минутный звонок для быстрого обсуждения вопросов',
        durationMinutes: 15,
      },
      {
        id: 'project-review',
        name: 'Ревью проекта',
        description: '30-минутная сессия для разбора проекта и планирования',
        durationMinutes: 30,
      },
      {
        id: 'strategy-session',
        name: 'Стратегическая сессия',
        description: 'Часовое погружение для стратегического планирования',
        durationMinutes: 60,
      },
    ];

    for (const eventType of eventTypes) {
      await this.redisService.hSet(`event_type:${eventType.id}`, eventType);
      await this.redisService.sAdd('event_types:ids', eventType.id);
    }

    this.logger.log(`Seeded ${eventTypes.length} event types`);
  }
}
