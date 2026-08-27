import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cultivation } from '../../cultivations/entities/cultivation.entity';

@Entity('irrigation_logs')
export class IrrigationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cultivation, (cultivation) => cultivation.irrigationLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cultivation_id' })
  cultivation: Cultivation;

  @Column({ name: 'cultivation_id' })
  cultivationId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  durationHours: number; // e.g., 2.5 hours

  @Column({ nullable: true })
  waterSource: string; // e.g., Canal, Rain, Tube well

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
