import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCultivationDto } from './create-cultivation.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateCultivationDto extends PartialType(CreateCultivationDto) {
  @ApiProperty({ example: '2027-01-20', required: false, description: 'Actual harvest date if completed' })
  @IsDateString()
  @IsOptional()
  actualHarvestDate?: Date;
}
