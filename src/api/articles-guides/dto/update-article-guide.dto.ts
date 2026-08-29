import { PartialType } from '@nestjs/swagger';
import { CreateArticleGuideDto } from './create-article-guide.dto';

export class UpdateArticleGuideDto extends PartialType(CreateArticleGuideDto) {}
