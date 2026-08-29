import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesGuidesService } from './articles-guides.service';
import { ArticlesGuidesController } from './articles-guides.controller';
import { ArticleGuide } from './entities/article-guide.entity';
import { FarmersAssociation } from '../farmer-association/entities/farmer-association.entity';
import { FarmersAssociationMember } from '../farmer-association/entities/farmers-association-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleGuide, FarmersAssociation, FarmersAssociationMember]),
  ],
  controllers: [ArticlesGuidesController],
  providers: [ArticlesGuidesService],
  exports: [ArticlesGuidesService],
})
export class ArticlesGuidesModule {}
