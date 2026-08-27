import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaddyFieldDto } from './dto/create-paddy-field.dto';
import { UpdatePaddyFieldDto } from './dto/update-paddy-field.dto';
import { PaddyField } from './entities/paddy-field.entity';

@Injectable()
export class PaddyFieldsService {
  constructor(
    @InjectRepository(PaddyField)
    private readonly paddyFieldRepository: Repository<PaddyField>,
  ) {}

  async create(createPaddyFieldDto: CreatePaddyFieldDto, farmerId?: string): Promise<PaddyField> {
    const field = this.paddyFieldRepository.create({
      ...createPaddyFieldDto,
      farmerId: createPaddyFieldDto.farmerId || farmerId,
    });
    return await this.paddyFieldRepository.save(field);
  }

  async findAll(): Promise<PaddyField[]> {
    return await this.paddyFieldRepository.find({ relations: ['farmer'] });
  }

  async findByFarmer(farmerId: string): Promise<PaddyField[]> {
    return await this.paddyFieldRepository.find({
      where: { farmerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PaddyField> {
    const field = await this.paddyFieldRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });
    if (!field) {
      throw new NotFoundException(`Paddy field with ID ${id} not found`);
    }
    return field;
  }

  async update(id: string, updatePaddyFieldDto: UpdatePaddyFieldDto): Promise<PaddyField> {
    const field = await this.findOne(id);
    const updated = this.paddyFieldRepository.merge(field, updatePaddyFieldDto);
    return await this.paddyFieldRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const field = await this.findOne(id);
    await this.paddyFieldRepository.remove(field);
  }
}
