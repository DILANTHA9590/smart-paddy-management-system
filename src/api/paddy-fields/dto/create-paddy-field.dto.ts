import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaddyFieldDto {
  @ApiProperty({ example: 'North Field' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2.5, description: 'Area size in acres' })
  @IsNumber()
  @IsNotEmpty()
  areaSize: number;

  @ApiProperty({ example: 'No 42, Village Road', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Anuradhapura', required: false })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ example: '8.3114, 80.4037', required: false })
  @IsString()
  @IsOptional()
  gpsCoordinates?: string;

  @ApiProperty({ example: 'Clay', required: false })
  @IsString()
  @IsOptional()
  soilType?: string;

  @ApiProperty({ example: 'Canal', required: false })
  @IsString()
  @IsOptional()
  irrigationType?: string;

  @ApiProperty({ example: 'uuid', description: 'Farmer ID (Optional if inferred from logged in user)', required: false })
  @IsString()
  @IsOptional()
  farmerId?: string;
}
