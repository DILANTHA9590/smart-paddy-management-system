import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FertilizerLog } from './entities/fertilizer-log.entity';
import { FertilizerController } from './fertilizer.controller';
import { FertilizerService } from './fertilizer.service';

@Module({
  imports: [TypeOrmModule.forFeature([FertilizerLog])],
  controllers: [FertilizerController],
  providers: [FertilizerService],
  exports: [FertilizerService],
})
export class FertilizerModule {}
