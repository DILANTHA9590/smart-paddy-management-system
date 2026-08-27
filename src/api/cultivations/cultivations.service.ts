import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCultivationDto } from './dto/create-cultivation.dto';
import { UpdateCultivationDto } from './dto/update-cultivation.dto';
import { Cultivation } from './entities/cultivation.entity';

@Injectable()
export class CultivationsService {
  constructor(
    @InjectRepository(Cultivation)
    private readonly cultivationRepository: Repository<Cultivation>,
  ) {}

  async create(createCultivationDto: CreateCultivationDto): Promise<Cultivation> {
    const cultivation = this.cultivationRepository.create(createCultivationDto);
    return await this.cultivationRepository.save(cultivation);
  }

  async findAll(): Promise<Cultivation[]> {
    return await this.cultivationRepository.find({ relations: ['paddyField'] });
  }

  async findByPaddyField(paddyFieldId: string): Promise<Cultivation[]> {
    return await this.cultivationRepository.find({
      where: { paddyFieldId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cultivation> {
    const cultivation = await this.cultivationRepository.findOne({
      where: { id },
      relations: ['paddyField'],
    });
    if (!cultivation) {
      throw new NotFoundException(`Cultivation with ID ${id} not found`);
    }
    return cultivation;
  }

  async update(id: string, updateCultivationDto: UpdateCultivationDto): Promise<Cultivation> {
    const cultivation = await this.findOne(id);
    const updated = this.cultivationRepository.merge(cultivation, updateCultivationDto);
    return await this.cultivationRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const cultivation = await this.findOne(id);
    await this.cultivationRepository.remove(cultivation);
  }
}
