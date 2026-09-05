import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EmailStatus {
  PENDING = 'Pending',
  REPLIED = 'Replied',
  DRAFT = 'Draft',
}

@Entity('advisor_emails')
export class AdvisorEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ nullable: true })
  farmerName: string;

  @Column({ nullable: true })
  farmerEmail: string;

  @Column()
  advisorName: string;

  @Column()
  advisorEmail: string;

  @Column({ nullable: true })
  advisorRole: string;

  @Column({ nullable: true })
  advisorAvatar: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  attachmentName: string;

  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @Column('text', { nullable: true })
  replyMessage: string;

  @Column({ type: 'timestamp', nullable: true })
  repliedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
