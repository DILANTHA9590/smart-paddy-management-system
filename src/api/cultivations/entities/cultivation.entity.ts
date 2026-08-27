import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PaddyField } from '../../paddy-fields/entities/paddy-field.entity';
import { IrrigationLog } from '../../irrigation/entities/irrigation-log.entity';
import { FertilizerLog } from '../../fertilizer/entities/fertilizer-log.entity';
import { DiseasePrediction } from '../../disease-prediction/entities/disease-prediction.entity';

export enum CultivationStatus {
  PLANNED = 'Planned',
  ACTIVE = 'Active',
  HARVESTED = 'Harvested',
  ABANDONED = 'Abandoned',
}

export enum CultivationSeason {
  YALA = 'Yala',
  MAHA = 'Maha',
  OTHER = 'Other',
}

@Entity('cultivations')
export class Cultivation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PaddyField, (paddyField) => paddyField.cultivations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'paddy_field_id' })
  paddyField: PaddyField;

  @Column({ name: 'paddy_field_id' })
  paddyFieldId: string;

  @Column()
  cropVariety: string;

  @Column({
    type: 'enum',
    enum: CultivationSeason,
    default: CultivationSeason.MAHA,
  })
  season: CultivationSeason;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedHarvestDate: Date;

  @Column({ type: 'date', nullable: true })
  actualHarvestDate: Date;

  @Column({
    type: 'enum',
    enum: CultivationStatus,
    default: CultivationStatus.PLANNED,
  })
  status: CultivationStatus;

  @OneToMany(() => IrrigationLog, (log) => log.cultivation)
  irrigationLogs?: IrrigationLog[];

  @OneToMany(() => FertilizerLog, (log) => log.cultivation)
  fertilizerLogs?: FertilizerLog[];

  @OneToMany(() => DiseasePrediction, (prediction) => prediction.cultivation)
  diseasePredictions?: DiseasePrediction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
