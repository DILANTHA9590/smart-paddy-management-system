import { FarmersAssociationMember } from '../../farmer-association/entities/farmers-association-member.entity';
import { User } from '../../user/entities/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
@Entity('farmers')
export class Farmer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true })
  nic!: string;

  @Index()
  @Column({ unique: true })
  phoneNumber!: string;

  @Column('text')
  address!: string;
  @Index()
  @Column()
  district!: string;
  @Index()
  @Column()
  province!: string;
  @Index()
  @Column()
  village!: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender!: Gender;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  //farmer and association member realtionship(one to many relationship)
  @OneToMany(() => FarmersAssociationMember, (member) => member.farmer)
  associationMemberships?: FarmersAssociationMember[];

  //farmer and user realtionship(one to one relationship)
  @OneToOne(() => User, (user) => user.farmer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
