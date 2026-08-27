import { PartialType } from '@nestjs/swagger';
import { CreateDiseasePredictionDto } from './create-disease-prediction.dto';

export class UpdateDiseasePredictionDto extends PartialType(CreateDiseasePredictionDto) {}
