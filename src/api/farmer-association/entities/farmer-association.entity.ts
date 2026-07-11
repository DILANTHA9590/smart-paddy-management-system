import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { FarmersAssociationMember } from './farmers-association-member.entity';
import { FarmersAssociationNotice } from './farmers-association-notice.entity';
// import { FarmersAssociationMember } from './farmers-association-member.entity';
// import { FarmersAssociationNotice } from './farmers-association-notice.entity';

@Entity('farmers_associations')
export class FarmersAssociation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
    length: 20,
  })
  associationCode!: string;

  @Column({ unique: true, length: 150 })
  name!: string;

  @Column()
  district!: string;

  @Column()
  province!: string;

  @Column()
  village!: string;

  @Column()
  createdBy!: string;

  @Column()
  updatedBy!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Index()
  @UpdateDateColumn()
  updatedAt!: Date;

  //   farmer association and  assocation notice realtionship (one to many relationship)
  @OneToMany(() => FarmersAssociationNotice, (notice) => notice.association)
  notices!: FarmersAssociationNotice[];

  //   farmer association and  farmer association member realtionship(One to many relationship)
  @OneToMany(() => FarmersAssociationMember, (member) => member.association)
  members?: FarmersAssociationMember[];
}
