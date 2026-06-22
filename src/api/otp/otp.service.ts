import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly rediseService:RedisService //redis service
    
  ){}
 async create(createOtpDto: CreateOtpDto) {
    const {email}= createOtpDto
    const otp = String( Math.floor(100000 + Math.random() * 900000))//genarate random no
    const existingValue = await this.rediseService.getRedis(email)
    if(existingValue)  throw new ConflictException("We Are Already Send Otp Your Email")
    await this.rediseService.setRedis(email,otp)  



    

  
  }


}
