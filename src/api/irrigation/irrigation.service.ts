import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIrrigationDto } from './dto/create-irrigation.dto';
import { UpdateIrrigationDto } from './dto/update-irrigation.dto';
import { IrrigationLog } from './entities/irrigation-log.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';

@Injectable()
export class IrrigationService {
  constructor(
    @InjectRepository(IrrigationLog)
    private readonly irrigationRepository: Repository<IrrigationLog>,
    @InjectRepository(Cultivation)
    private readonly cultivationRepository: Repository<Cultivation>,
  ) {}

  async create(createIrrigationDto: CreateIrrigationDto, farmerId?: string): Promise<IrrigationLog> {
    if (farmerId) {
      const cultivation = await this.cultivationRepository.findOne({
        where: { id: createIrrigationDto.cultivationId },
        relations: ['paddyField'],
      });
      if (!cultivation) throw new NotFoundException('Cultivation not found');
      if (cultivation.paddyField.farmerId !== farmerId) {
        throw new ForbiddenException('You do not own this cultivation');
      }
    }
    const log = this.irrigationRepository.create(createIrrigationDto);
    return await this.irrigationRepository.save(log);
  }

  async findAll(): Promise<IrrigationLog[]> {
    return await this.irrigationRepository.find({ relations: ['cultivation'] });
  }

  async findByFarmer(farmerId: string): Promise<IrrigationLog[]> {
    return await this.irrigationRepository.find({
      where: { cultivation: { paddyField: { farmerId } } },
      relations: ['cultivation', 'cultivation.paddyField'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findByCultivation(cultivationId: string): Promise<IrrigationLog[]> {
    return await this.irrigationRepository.find({
      where: { cultivationId },
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findOne(id: string, farmerId?: string): Promise<IrrigationLog> {
    const log = await this.irrigationRepository.findOne({
      where: { id },
      relations: ['cultivation', 'cultivation.paddyField'],
    });
    if (!log) {
      throw new NotFoundException(`Irrigation log with ID ${id} not found`);
    }
    if (farmerId && log.cultivation.paddyField.farmerId !== farmerId) {
      throw new ForbiddenException('You do not own this irrigation record');
    }
    return log;
  }

  async update(id: string, updateIrrigationDto: UpdateIrrigationDto, farmerId?: string): Promise<IrrigationLog> {
    const log = await this.findOne(id, farmerId);
    const updated = this.irrigationRepository.merge(log, updateIrrigationDto);
    return await this.irrigationRepository.save(updated);
  }

  async remove(id: string, farmerId?: string): Promise<void> {
    const log = await this.findOne(id, farmerId);
    await this.irrigationRepository.remove(log);
  }
}
