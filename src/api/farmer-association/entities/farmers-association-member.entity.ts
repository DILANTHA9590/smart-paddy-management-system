import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { FarmersAssociation } from './farmer-association.entity';
import { Farmer } from '../../farmers/entities/farmer.entity';

@Entity('farmers_association_members')
@Unique('UQ_FARMER_ASSOCIATION_MEMBER', ['farmer', 'association'])
export class FarmersAssociationMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //farmer  and  farmer association member realtionship
  @ManyToOne(() => Farmer, (farmer) => farmer.associationMemberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'farmerId' })
  farmer?: Farmer;

  //farmer association and  farmer association member realtionship
  @ManyToOne(() => FarmersAssociation, (association) => association.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'associationId' })
  association?: FarmersAssociation;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  joinedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
