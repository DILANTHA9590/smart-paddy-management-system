import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIrrigationDto {
  @ApiProperty({ example: 'uuid-of-cultivation' })
  @IsUUID()
  @IsNotEmpty()
  cultivationId: string;

  @ApiProperty({ example: '2026-09-10' })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: '08:30:00', required: false })
  @IsString()
  @IsOptional()
  time?: string;

  @ApiProperty({ example: 2.5, description: 'Duration in hours', required: false })
  @IsNumber()
  @IsOptional()
  durationHours?: number;

  @ApiProperty({ example: 'Canal', required: false })
  @IsString()
  @IsOptional()
  waterSource?: string;

  @ApiProperty({ example: 'Morning watering', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
