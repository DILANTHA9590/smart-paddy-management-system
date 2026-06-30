import { Module } from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { FarmersController } from './farmers.controller';
import { Farmer } from './entities/farmer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer,User])],
  controllers: [FarmersController],
  providers: [FarmersService],
})
export class FarmersModule {}
