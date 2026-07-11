import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchFarmersAssociationNoticeDto {

  @IsOptional()
  @IsString()
  search?: string;

  // 2. Filter by Specific Association
  @IsOptional()
  @IsUUID()
  associationId?: string;


  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) 
  page?: number = 1; 

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10; 
}