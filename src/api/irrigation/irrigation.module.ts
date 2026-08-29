import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationLog } from './entities/irrigation-log.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';
import { IrrigationController } from './irrigation.controller';
import { IrrigationService } from './irrigation.service';

@Module({
  imports: [TypeOrmModule.forFeature([IrrigationLog, Cultivation])],
  controllers: [IrrigationController],
  providers: [IrrigationService],
  exports: [IrrigationService],
})
export class IrrigationModule {}
