import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleGuideCategory, ArticleGuideType } from '../entities/article-guide.entity';

export class CreateArticleGuideDto {
  @ApiProperty({ description: 'Title of the article or guide' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the article or guide' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: ArticleGuideCategory })
  @IsEnum(ArticleGuideCategory)
  @IsNotEmpty()
  category: ArticleGuideCategory;

  @ApiProperty({ enum: ArticleGuideType })
  @IsEnum(ArticleGuideType)
  @IsNotEmpty()
  type: ArticleGuideType;

  @ApiPropertyOptional({ description: 'Farmers Association ID (null for system-wide)' })
  @IsOptional()
  @IsUUID()
  associationId?: string;

  @ApiPropertyOptional({ description: 'Publication date' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
