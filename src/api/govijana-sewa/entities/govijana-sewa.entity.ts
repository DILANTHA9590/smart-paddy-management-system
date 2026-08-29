import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FarmersAssociation } from '../../farmer-association/entities/farmer-association.entity';
import { GovijanaSewaCategory } from './govijana-sewa-category.enum';

@Entity('govijana_sewa')
export class GovijanaSewa {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'enum', enum: GovijanaSewaCategory, default: GovijanaSewaCategory.GENERAL })
  category!: GovijanaSewaCategory;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @ManyToOne(() => FarmersAssociation, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'associationId' })
  association?: FarmersAssociation;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
