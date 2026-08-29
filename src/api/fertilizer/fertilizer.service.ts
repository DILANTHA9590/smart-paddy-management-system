import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFertilizerDto } from './dto/create-fertilizer.dto';
import { UpdateFertilizerDto } from './dto/update-fertilizer.dto';
import { FertilizerLog } from './entities/fertilizer-log.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';

@Injectable()
export class FertilizerService {
  constructor(
    @InjectRepository(FertilizerLog)
    private readonly fertilizerRepository: Repository<FertilizerLog>,
    @InjectRepository(Cultivation)
    private readonly cultivationRepository: Repository<Cultivation>,
  ) {}

  async create(createFertilizerDto: CreateFertilizerDto, farmerId?: string): Promise<FertilizerLog> {
    if (farmerId) {
      const cultivation = await this.cultivationRepository.findOne({
        where: { id: createFertilizerDto.cultivationId },
        relations: ['paddyField'],
      });
      if (!cultivation) throw new NotFoundException('Cultivation not found');
      if (cultivation.paddyField.farmerId !== farmerId) {
        throw new ForbiddenException('You do not own this cultivation');
      }
    }
    const log = this.fertilizerRepository.create(createFertilizerDto);
    return await this.fertilizerRepository.save(log);
  }

  async findAll(): Promise<FertilizerLog[]> {
    return await this.fertilizerRepository.find({ relations: ['cultivation'] });
  }

  async findByFarmer(farmerId: string): Promise<FertilizerLog[]> {
    return await this.fertilizerRepository.find({
      where: { cultivation: { paddyField: { farmerId } } },
      relations: ['cultivation', 'cultivation.paddyField'],
      order: { date: 'DESC' },
    });
  }

  async findByCultivation(cultivationId: string): Promise<FertilizerLog[]> {
    return await this.fertilizerRepository.find({
      where: { cultivationId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, farmerId?: string): Promise<FertilizerLog> {
    const log = await this.fertilizerRepository.findOne({
      where: { id },
      relations: ['cultivation', 'cultivation.paddyField'],
    });
    if (!log) {
      throw new NotFoundException(`Fertilizer log with ID ${id} not found`);
    }
    if (farmerId && log.cultivation.paddyField.farmerId !== farmerId) {
      throw new ForbiddenException('You do not own this fertilizer record');
    }
    return log;
  }

  async update(id: string, updateFertilizerDto: UpdateFertilizerDto, farmerId?: string): Promise<FertilizerLog> {
    const log = await this.findOne(id, farmerId);
    const updated = this.fertilizerRepository.merge(log, updateFertilizerDto);
    return await this.fertilizerRepository.save(updated);
  }

  async remove(id: string, farmerId?: string): Promise<void> {
    const log = await this.findOne(id, farmerId);
    await this.fertilizerRepository.remove(log);
  }
}
