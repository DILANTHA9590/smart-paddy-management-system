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

@Entity('farmers')
export class Farmer {
  @PrimaryGeneratedColumn()
  id!: string;

  @OneToOne(() => User, (user) => user.farmer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ unique: true })
  nic!: string;

  @Column()
  phone_number!: string;

  @Column('text')
  address!: string;

  @Column()
  district!: string;

  @Column()
  province!: string;

  @Column()
  village!: string;

  @Column({ type: 'date' })
  date_of_birth!: Date;

  @Column({
    type: 'enum',
    enum: ['Male', 'Female', 'Other'],
  })
  gender!: string;

  @Column({ nullable: true })
  profile_image?: string;

  // @Column({ nullable: true })
  // organization_id?: number;

  //   @ManyToOne(
  //     () => Organization,
  //     (organization) => organization.farmers,
  //     {
  //       nullable: true,
  //       onDelete: "SET NULL",
  //     }
  //   )
  //   @JoinColumn({ name: "organization_id" })
  //   organization: Organization;


@OneToMany(
  () => FarmersAssociationMember,
  (member) => member.farmer,
)
associationMemberships?: FarmersAssociationMember[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
