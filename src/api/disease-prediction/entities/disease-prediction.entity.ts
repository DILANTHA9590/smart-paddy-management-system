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

@Entity('disease_predictions')
export class DiseasePrediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cultivation, (cultivation) => cultivation.diseasePredictions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cultivation_id' })
  cultivation: Cultivation;

  @Column({ name: 'cultivation_id' })
  cultivationId: string;

  @Column()
  imageUrl: string;

  @Column()
  diseaseName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  confidenceScore: number;

  @Column({ type: 'text', nullable: true })
  treatmentRecommendation: string;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
