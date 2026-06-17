import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redis: Redis;

  constructor(
    private readonly configService: ConfigService,
  ) {
    console.log('🔥 RedisService Constructor');

    this.redis = new Redis({
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: Number(
        this.configService.getOrThrow<string>('REDIS_PORT'),
      ),
    });
  }

  async onModuleInit() {
    try {
      const result = await this.redis.ping();
      console.log('PING RESULT:', result);
    } catch (error) {
      console.error('❌ Redis Error:', error);
    }
  }


  getClient(): Redis {
    return this.redis;
  }
}