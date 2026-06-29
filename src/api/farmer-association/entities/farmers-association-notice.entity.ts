import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FarmersAssociation } from './farmer-association.entity';


@Entity('farmers_association_notices')
export class FarmersAssociationNotice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;


  @Column({ type: 'timestamp', nullable: true })
  displayStartDate?: Date;

  @Column({ type: 'timestamp', nullable: true ,})
  displayEndDate?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
  //   farmer association and  assocation notice realtionship
  @ManyToOne(
    () => FarmersAssociation,
    (association) => association.notices,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'associationId' })
  association!: FarmersAssociation;
}