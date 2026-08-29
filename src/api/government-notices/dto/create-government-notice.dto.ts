import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { NoticeCategory } from '../entities/notice-category.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGovernmentNoticeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ enum: NoticeCategory })
  @IsEnum(NoticeCategory)
  @IsNotEmpty()
  category!: NoticeCategory;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}
