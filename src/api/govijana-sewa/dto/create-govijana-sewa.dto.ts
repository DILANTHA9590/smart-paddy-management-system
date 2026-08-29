import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { GovijanaSewaCategory } from '../entities/govijana-sewa-category.enum';

export class CreateGovijanaSewaDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum(GovijanaSewaCategory)
  @IsNotEmpty()
  category!: GovijanaSewaCategory;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsUUID()
  @IsOptional()
  associationId?: string;
}
