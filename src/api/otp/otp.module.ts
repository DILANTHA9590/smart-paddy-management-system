import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { RedisModule } from '../redis/redis.module';
import { EmailModule } from '../email/email.module';

@Module({
   imports: [RedisModule, EmailModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports:[OtpService]
})
export class OtpModule {}
