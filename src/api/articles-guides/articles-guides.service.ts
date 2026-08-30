import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { CreateArticleGuideDto } from './dto/create-article-guide.dto';
import { UpdateArticleGuideDto } from './dto/update-article-guide.dto';
import { ArticleGuide } from './entities/article-guide.entity';
import { FarmersAssociation } from '../farmer-association/entities/farmer-association.entity';
import { FarmersAssociationMember } from '../farmer-association/entities/farmers-association-member.entity';
import { UserRole } from '../roles/entities/role.enum';

@Injectable()
export class ArticlesGuidesService {
  constructor(
    @InjectRepository(ArticleGuide)
    private readonly articleGuideRepository: Repository<ArticleGuide>,
    @InjectRepository(FarmersAssociation)
    private readonly associationRepository: Repository<FarmersAssociation>,
    @InjectRepository(FarmersAssociationMember)
    private readonly memberRepository: Repository<FarmersAssociationMember>,
  ) {}

  async create(createArticleGuideDto: CreateArticleGuideDto, userRole: string, farmerId?: string): Promise<ArticleGuide> {
    const data = { ...createArticleGuideDto };

    if (userRole === UserRole.ORGANIZATION_MANAGER && farmerId) {
      const managedOrg = await this.associationRepository.findOne({
        where: { manager: { id: farmerId } },
      });
      if (!managedOrg) {
        throw new ForbiddenException('You do not manage any organization');
      }
      data.associationId = managedOrg.id;
    }

    const article = this.articleGuideRepository.create(data);
    return await this.articleGuideRepository.save(article);
  }

  async findAll(userRole: string, farmerId?: string): Promise<ArticleGuide[]> {
    if (userRole === UserRole.ADMIN) {
      return await this.articleGuideRepository.find({
        relations: ['association'],
        order: { createdAt: 'DESC' },
      });
    }

    let allowedAssociationIds: string[] = [];

    if (farmerId) {
      if (userRole === UserRole.ORGANIZATION_MANAGER) {
        const managedOrg = await this.associationRepository.findOne({
          where: { manager: { id: farmerId } },
        });
        if (managedOrg) allowedAssociationIds.push(managedOrg.id);
      }

      const memberships = await this.memberRepository.find({
        where: { farmer: { id: farmerId } },
        relations: ['association'],
      });
      allowedAssociationIds.push(...memberships.map((m) => m.association?.id).filter((id): id is string => id !== undefined));
    }

    allowedAssociationIds = [...new Set(allowedAssociationIds)]; // Deduplicate

    return await this.articleGuideRepository.find({
      where: [
        { associationId: IsNull() },
        ...(allowedAssociationIds.length > 0 ? [{ associationId: In(allowedAssociationIds) }] : []),
      ],
      relations: ['association'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userRole: string, farmerId?: string): Promise<ArticleGuide> {
    const article = await this.articleGuideRepository.findOne({
      where: { id },
      relations: ['association'],
    });

    if (!article) {
      throw new NotFoundException(`Article or Guide with ID ${id} not found`);
    }

    if (userRole === UserRole.ADMIN) {
      return article;
    }

    let allowedAssociationIds: string[] = [];
    if (farmerId) {
      if (userRole === UserRole.ORGANIZATION_MANAGER) {
        const managedOrg = await this.associationRepository.findOne({
          where: { manager: { id: farmerId } },
        });
        if (managedOrg) allowedAssociationIds.push(managedOrg.id);
      }

      const memberships = await this.memberRepository.find({
        where: { farmer: { id: farmerId } },
        relations: ['association'],
      });
      allowedAssociationIds.push(...memberships.map((m) => m.association?.id).filter((id): id is string => id !== undefined));
    }

    if (article.associationId !== null && !allowedAssociationIds.includes(article.associationId)) {
      throw new ForbiddenException('You do not have permission to view this article');
    }

    return article;
  }

  async update(id: string, updateArticleGuideDto: UpdateArticleGuideDto, userRole: string, farmerId?: string): Promise<ArticleGuide> {
    const article = await this.findOne(id, userRole, farmerId);

    if (userRole === UserRole.ORGANIZATION_MANAGER && farmerId) {
      const managedOrg = await this.associationRepository.findOne({
        where: { manager: { id: farmerId } },
      });
      if (!managedOrg || article.associationId !== managedOrg.id) {
        throw new ForbiddenException('You can only update articles belonging to your managed organization');
      }
      
      // Prevent manager from changing the association or making it general
      delete updateArticleGuideDto.associationId;
    }

    const updated = this.articleGuideRepository.merge(article, updateArticleGuideDto);
    return await this.articleGuideRepository.save(updated);
  }

  async remove(id: string, userRole: string, farmerId?: string): Promise<void> {
    const article = await this.findOne(id, userRole, farmerId);

    if (userRole === UserRole.ORGANIZATION_MANAGER && farmerId) {
      const managedOrg = await this.associationRepository.findOne({
        where: { manager: { id: farmerId } },
      });
      if (!managedOrg || article.associationId !== managedOrg.id) {
        throw new ForbiddenException('You can only delete articles belonging to your managed organization');
      }
    }

    await this.articleGuideRepository.remove(article);
  }
}
