import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CultivationSeason, CultivationStatus } from '../entities/cultivation.entity';

export class CreateCultivationDto {
  @ApiProperty({ example: 'uuid-of-paddy-field' })
  @IsUUID()
  @IsNotEmpty()
  paddyFieldId: string;

  @ApiProperty({ example: 'Suwandel' })
  @IsString()
  @IsNotEmpty()
  cropVariety: string;

  @ApiProperty({ enum: CultivationSeason, example: CultivationSeason.MAHA })
  @IsEnum(CultivationSeason)
  @IsOptional()
  season?: CultivationSeason;

  @ApiProperty({ example: '2026-09-01' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2027-01-15', required: false })
  @IsDateString()
  @IsOptional()
  expectedHarvestDate?: Date;

  @ApiProperty({ enum: CultivationStatus, example: CultivationStatus.PLANNED, required: false })
  @IsEnum(CultivationStatus)
  @IsOptional()
  status?: CultivationStatus;
}
