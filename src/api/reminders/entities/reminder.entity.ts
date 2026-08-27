import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farmer } from '../../farmers/entities/farmer.entity';
import { Cultivation } from '../../cultivations/entities/cultivation.entity';

export enum ReminderType {
  FERTILIZER = 'Fertilizer',
  IRRIGATION = 'Irrigation',
  HARVEST = 'Harvest',
  GENERAL = 'General',
}

export enum ReminderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue',
}

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Farmer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmer_id' })
  farmer: Farmer;

  @Column({ name: 'farmer_id' })
  farmerId: string;

  @ManyToOne(() => Cultivation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cultivation_id' })
  cultivation?: Cultivation;

  @Column({ name: 'cultivation_id', nullable: true })
  cultivationId?: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ReminderType,
    default: ReminderType.GENERAL,
  })
  type: ReminderType;

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING,
  })
  status: ReminderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
