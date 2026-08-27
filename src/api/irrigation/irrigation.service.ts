import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIrrigationDto } from './dto/create-irrigation.dto';
import { UpdateIrrigationDto } from './dto/update-irrigation.dto';
import { IrrigationLog } from './entities/irrigation-log.entity';

@Injectable()
export class IrrigationService {
  constructor(
    @InjectRepository(IrrigationLog)
    private readonly irrigationRepository: Repository<IrrigationLog>,
  ) {}

  async create(createIrrigationDto: CreateIrrigationDto): Promise<IrrigationLog> {
    const log = this.irrigationRepository.create(createIrrigationDto);
    return await this.irrigationRepository.save(log);
  }

  async findAll(): Promise<IrrigationLog[]> {
    return await this.irrigationRepository.find({ relations: ['cultivation'] });
  }

  async findByCultivation(cultivationId: string): Promise<IrrigationLog[]> {
    return await this.irrigationRepository.find({
      where: { cultivationId },
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findOne(id: string): Promise<IrrigationLog> {
    const log = await this.irrigationRepository.findOne({
      where: { id },
      relations: ['cultivation'],
    });
    if (!log) {
      throw new NotFoundException(`Irrigation log with ID ${id} not found`);
    }
    return log;
  }

  async update(id: string, updateIrrigationDto: UpdateIrrigationDto): Promise<IrrigationLog> {
    const log = await this.findOne(id);
    const updated = this.irrigationRepository.merge(log, updateIrrigationDto);
    return await this.irrigationRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const log = await this.findOne(id);
    await this.irrigationRepository.remove(log);
  }
}
