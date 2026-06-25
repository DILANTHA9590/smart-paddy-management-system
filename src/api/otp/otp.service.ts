import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly rediseService: RedisService, //redis service
    private readonly emailService: EmailService,
  ) {}
  async create(email: string): Promise<ApiResponseDto<null>> {
    const otp = this.genarateOtp();
    const key = `otp:${email}`;
    const existingValue = await this.rediseService.getRedis(key);
    if (existingValue)
      throw new ConflictException('We Are Already Send Otp Your Email');

    try {
      await this.rediseService.setRedis(key, otp); //
      await this.emailService.sendOtp(email, otp);
      return {
        success: true,
        message: 'Email send succsessfully ',
        data: null,
      };
    } catch (error) {
      console.error('Send OTP failed:', error);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }

  genarateOtp() {
    const otp = String(Math.floor(100000 + Math.random() * 900000)); //genarate random no
    return otp;
  }

  async resendOtp(email: string) {

    const key = `otp:${email}`;
    const ttl = await this.rediseService.getTTL(key);
    if (ttl > 0) {
      throw new BadRequestException(
        `Please wait ${ttl} seconds before requesting a new OTP`,
      );
    }

    const otp = this.genarateOtp();

    try {
      await this.emailService.sendOtp(email, otp);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send OTP email');
    }
    await this.rediseService.setRedis(key, otp);
  }

  async validateOtp(email: string, otp: string) {
    const key = `otp:${email}`;
    const existingOtp = await this.rediseService.getRedis(key);
    if (!existingOtp) throw new NotFoundException('OTP expired or not found');
    if (otp !== existingOtp) {
      throw new BadRequestException('Please enter the correct OTP');
    }

    await this.rediseService.deleteRedis(key);
  }
}
