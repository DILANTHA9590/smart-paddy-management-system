import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FertilizerType } from '../entities/fertilizer-log.entity';

export class CreateFertilizerDto {
  @ApiProperty({ example: 'uuid-of-cultivation' })
  @IsUUID()
  @IsNotEmpty()
  cultivationId: string;

  @ApiProperty({ example: '2026-09-15' })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: 'Urea' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: FertilizerType, example: FertilizerType.CHEMICAL })
  @IsEnum(FertilizerType)
  @IsOptional()
  type?: FertilizerType;

  @ApiProperty({ example: 50.5 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 'kg', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: 'Applied evenly', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
