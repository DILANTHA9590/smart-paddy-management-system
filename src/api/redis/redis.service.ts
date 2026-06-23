import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    console.log('🔥 RedisService Constructor');

    this.redis = new Redis({
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: Number(this.configService.getOrThrow<string>('REDIS_PORT')),
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

  async getClient(): Promise<Redis> {
    return this.redis;
  }

  async setRedis(key: string, value: string): Promise<string> {
    return this.redis.set(
      key,
      value,
      'EX',
      this.configService.getOrThrow<number>('OTP_EXPIRE_SECONDS'),
    );
  }

  async getRedis(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async deleteRedis(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async getTTL(key: string): Promise<number> {
    return this.redis.ttl(key);
  }
}
