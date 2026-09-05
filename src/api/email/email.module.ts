import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AdvisorEmail } from './entities/advisor-email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdvisorEmail])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
