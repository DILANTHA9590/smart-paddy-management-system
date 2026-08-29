import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernmentNoticesService } from './government-notices.service';
import { GovernmentNoticesController } from './government-notices.controller';
import { GovernmentNotice } from './entities/government-notice.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GovernmentNotice, User])],
  controllers: [GovernmentNoticesController],
  providers: [GovernmentNoticesService],
  exports: [GovernmentNoticesService],
})
export class GovernmentNoticesModule {}
