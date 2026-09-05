import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseasePrediction } from './entities/disease-prediction.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';
import { Farmer } from '../farmers/entities/farmer.entity';
import { User } from '../user/entities/user.entity';
import { EmailModule } from '../email/email.module';
import { DiseasePredictionController } from './disease-prediction.controller';
import { DiseasePredictionService } from './disease-prediction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiseasePrediction, Cultivation, Farmer, User]),
    EmailModule,
  ],
  controllers: [DiseasePredictionController],
  providers: [DiseasePredictionService],
  exports: [DiseasePredictionService],
})
export class DiseasePredictionModule {}
