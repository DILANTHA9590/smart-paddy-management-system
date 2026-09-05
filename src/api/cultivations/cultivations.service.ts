import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async findByFarmer(farmerId: string): Promise<Cultivation[]> {
    if (!farmerId) {
      return await this.findAll();
    }
    return await this.cultivationRepository.find({
      where: { paddyField: { farmerId } },
      relations: ['paddyField'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPaddyField(paddyFieldId: string): Promise<Cultivation[]> {
    return await this.cultivationRepository.find({
      where: { paddyFieldId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, farmerId?: string): Promise<Cultivation> {
    const cultivation = await this.cultivationRepository.findOne({
      where: { id },
      relations: ['paddyField'],
    });
    if (!cultivation) {
      throw new NotFoundException(`Cultivation with ID ${id} not found`);
    }
    if (farmerId && cultivation.paddyField.farmerId !== farmerId) {
      throw new ForbiddenException('You do not own this cultivation');
    }
    return cultivation;
  }

  async update(id: string, updateCultivationDto: UpdateCultivationDto, farmerId?: string): Promise<Cultivation> {
    const cultivation = await this.findOne(id, farmerId);
    const updated = this.cultivationRepository.merge(cultivation, updateCultivationDto);
    return await this.cultivationRepository.save(updated);
  }

  async remove(id: string, farmerId?: string): Promise<void> {
    const cultivation = await this.findOne(id, farmerId);
    await this.cultivationRepository.remove(cultivation);
  }
}
