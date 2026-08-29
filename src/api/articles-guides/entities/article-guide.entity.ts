import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FarmersAssociation } from '../../farmer-association/entities/farmer-association.entity';

export enum ArticleGuideType {
  ARTICLE = 'ARTICLE',
  GUIDE = 'GUIDE',
}

export enum ArticleGuideCategory {
  GENERAL = 'GENERAL',
  CULTIVATION = 'CULTIVATION',
  FERTILIZER = 'FERTILIZER',
  PEST_CONTROL = 'PEST_CONTROL',
  EQUIPMENT = 'EQUIPMENT',
  WEATHER = 'WEATHER',
  FINANCE = 'FINANCE',
  OTHER = 'OTHER',
}

@Entity('articles_guides')
export class ArticleGuide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ArticleGuideCategory,
    default: ArticleGuideCategory.GENERAL,
  })
  category: ArticleGuideCategory;

  @Column({
    type: 'enum',
    enum: ArticleGuideType,
    default: ArticleGuideType.ARTICLE,
  })
  type: ArticleGuideType;

  @Column({ nullable: true })
  associationId: string;

  @ManyToOne(() => FarmersAssociation, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'associationId' })
  association: FarmersAssociation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  publishedAt: Date;
}
