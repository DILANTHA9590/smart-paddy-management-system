import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Gender } from '../gender.enum';

export class SearchFarmerDto {
  @ApiPropertyOptional({
    description: 'Search by farmer name',
    example: 'Kamal',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Search by NIC',
    example: '200012345678',
  })
  @ApiPropertyOptional({
    description: 'Search by district',
    example: 'Kandy',
  })
  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Search by province',
    example: 'Central',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: 'Search by village',
    example: 'Peradeniya',
  })
  @IsOptional()
  @IsString()
  village?: string;

  @ApiPropertyOptional({
    description: 'Search by user id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of users per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
