import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiseasePredictionDto {
  @ApiProperty({ example: 'uuid-of-cultivation' })
  @IsUUID()
  @IsNotEmpty()
  cultivationId: string;

  @ApiProperty({ example: 'https://example.com/images/leaf.jpg' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 'Brown Spot' })
  @IsString()
  @IsNotEmpty()
  diseaseName: string;

  @ApiProperty({ example: 98.5 })
  @IsNumber()
  @IsNotEmpty()
  confidenceScore: number;

  @ApiProperty({ example: 'Apply Mancozeb', required: false })
  @IsString()
  @IsOptional()
  treatmentRecommendation?: string;

  @ApiProperty({ example: '2026-09-20' })
  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
