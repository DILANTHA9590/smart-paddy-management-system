import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationLog } from './entities/irrigation-log.entity';
import { IrrigationController } from './irrigation.controller';
import { IrrigationService } from './irrigation.service';

@Module({
  imports: [TypeOrmModule.forFeature([IrrigationLog])],
  controllers: [IrrigationController],
  providers: [IrrigationService],
  exports: [IrrigationService],
})
export class IrrigationModule {}
