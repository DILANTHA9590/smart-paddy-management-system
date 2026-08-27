import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFertilizerDto } from './dto/create-fertilizer.dto';
import { UpdateFertilizerDto } from './dto/update-fertilizer.dto';
import { FertilizerLog } from './entities/fertilizer-log.entity';

@Injectable()
export class FertilizerService {
  constructor(
    @InjectRepository(FertilizerLog)
    private readonly fertilizerRepository: Repository<FertilizerLog>,
  ) {}

  async create(createFertilizerDto: CreateFertilizerDto): Promise<FertilizerLog> {
    const log = this.fertilizerRepository.create(createFertilizerDto);
    return await this.fertilizerRepository.save(log);
  }

  async findAll(): Promise<FertilizerLog[]> {
    return await this.fertilizerRepository.find({ relations: ['cultivation'] });
  }

  async findByCultivation(cultivationId: string): Promise<FertilizerLog[]> {
    return await this.fertilizerRepository.find({
      where: { cultivationId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FertilizerLog> {
    const log = await this.fertilizerRepository.findOne({
      where: { id },
      relations: ['cultivation'],
    });
    if (!log) {
      throw new NotFoundException(`Fertilizer log with ID ${id} not found`);
    }
    return log;
  }

  async update(id: string, updateFertilizerDto: UpdateFertilizerDto): Promise<FertilizerLog> {
    const log = await this.findOne(id);
    const updated = this.fertilizerRepository.merge(log, updateFertilizerDto);
    return await this.fertilizerRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const log = await this.findOne(id);
    await this.fertilizerRepository.remove(log);
  }
}
