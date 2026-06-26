import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FarmersAssociationMember } from './farmers-association-member.entity';
// import { FarmersAssociationMember } from './farmers-association-member.entity';
// import { FarmersAssociationNotice } from './farmers-association-notice.entity';

@Entity('farmers_associations')
export class FarmersAssociation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 150 })
  name!: string;

  @Column({ nullable: true })
  district!: string;

@OneToMany(
  () => FarmersAssociationMember,
  (member) => member.association,
)
members?: FarmersAssociationMember[];

  
  @Column()
  createdBy!:string;

  @Column()
  updatedBy!:string
  

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}