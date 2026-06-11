import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(  
    private configService: ConfigService) {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  getClient() {
    return this.redis;
  }
}