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

export enum FertilizerType {
  ORGANIC = 'Organic',
  CHEMICAL = 'Chemical',
}

@Entity('fertilizer_logs')
export class FertilizerLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cultivation, (cultivation) => cultivation.fertilizerLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cultivation_id' })
  cultivation: Cultivation;

  @Column({ name: 'cultivation_id' })
  cultivationId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  name: string; // e.g., Urea, Compost

  @Column({
    type: 'enum',
    enum: FertilizerType,
    default: FertilizerType.CHEMICAL,
  })
  type: FertilizerType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number; // The amount used

  @Column({ default: 'kg' })
  unit: string; // e.g., kg, liters

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
