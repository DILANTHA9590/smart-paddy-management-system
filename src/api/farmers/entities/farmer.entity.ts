import { FarmersAssociationMember } from 'src/api/farmer-association/entities/farmers-association-member.entity';
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
} from 'typeorm';


export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
@Entity('farmers')
export class Farmer {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ unique: true })
  nic!: string;

  @Column()
  phoneNumber!: string;

  @Column('text')
  address!: string;

  @Column()
  district!: string;

  @Column()
  province!: string;

  @Column()
  village!: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({
    type: 'enum',
    enum: Gender
  })
  gender!: Gender;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  //farmer and association member realtionship(one to many relationship)
  @OneToMany(
  () => FarmersAssociationMember,
  (member) => member.farmer,
)
associationMemberships?: FarmersAssociationMember[];

//farmer and user realtionship(one to one relationship)
  @OneToOne(() => User, (user) => user.farmer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
