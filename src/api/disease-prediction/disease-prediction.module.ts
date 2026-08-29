import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseasePrediction } from './entities/disease-prediction.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';
import { DiseasePredictionController } from './disease-prediction.controller';
import { DiseasePredictionService } from './disease-prediction.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiseasePrediction, Cultivation])],
  controllers: [DiseasePredictionController],
  providers: [DiseasePredictionService],
  exports: [DiseasePredictionService],
})
export class DiseasePredictionModule {}
