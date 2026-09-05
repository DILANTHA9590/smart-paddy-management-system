import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { EmailModule } from '../email/email.module';
import { Farmer } from '../farmers/entities/farmer.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder, Farmer, Cultivation]),
    EmailModule,
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}
