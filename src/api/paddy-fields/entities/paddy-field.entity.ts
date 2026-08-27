import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Farmer } from '../../farmers/entities/farmer.entity';
import { Cultivation } from '../../cultivations/entities/cultivation.entity';

@Entity('paddy_fields')
export class PaddyField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  areaSize: number; // Stored in acres or hectares based on preference

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  gpsCoordinates: string;

  @Column({ nullable: true })
  soilType: string;

  @Column({ nullable: true })
  irrigationType: string;

  @ManyToOne(() => Farmer, (farmer) => farmer.paddyFields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'farmer_id' })
  farmer: Farmer;

  @Column({ name: 'farmer_id' })
  farmerId: string;

  @OneToMany(() => Cultivation, (cultivation) => cultivation.paddyField)
  cultivations?: Cultivation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
