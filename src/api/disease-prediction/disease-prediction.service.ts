import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiseasePredictionDto } from './dto/create-disease-prediction.dto';
import { UpdateDiseasePredictionDto } from './dto/update-disease-prediction.dto';
import { DiseasePrediction } from './entities/disease-prediction.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';

@Injectable()
export class DiseasePredictionService {
  constructor(
    @InjectRepository(DiseasePrediction)
    private readonly diseasePredictionRepository: Repository<DiseasePrediction>,
    @InjectRepository(Cultivation)
    private readonly cultivationRepository: Repository<Cultivation>,
  ) {}

  async create(createDiseasePredictionDto: CreateDiseasePredictionDto, farmerId?: string): Promise<DiseasePrediction> {
    if (farmerId) {
      const cultivation = await this.cultivationRepository.findOne({
        where: { id: createDiseasePredictionDto.cultivationId },
        relations: ['paddyField'],
      });
      if (!cultivation) throw new NotFoundException('Cultivation not found');
      if (cultivation.paddyField.farmerId !== farmerId) {
        throw new ForbiddenException('You do not own this cultivation');
      }
    }
    const prediction = this.diseasePredictionRepository.create(createDiseasePredictionDto);
    return await this.diseasePredictionRepository.save(prediction);
  }

  async findAll(): Promise<DiseasePrediction[]> {
    return await this.diseasePredictionRepository.find({ relations: ['cultivation'] });
  }

  async findByFarmer(farmerId: string): Promise<DiseasePrediction[]> {
    return await this.diseasePredictionRepository.find({
      where: { cultivation: { paddyField: { farmerId } } },
      relations: ['cultivation', 'cultivation.paddyField'],
      order: { date: 'DESC' },
    });
  }

  async findByCultivation(cultivationId: string): Promise<DiseasePrediction[]> {
    return await this.diseasePredictionRepository.find({
      where: { cultivationId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, farmerId?: string): Promise<DiseasePrediction> {
    const prediction = await this.diseasePredictionRepository.findOne({
      where: { id },
      relations: ['cultivation', 'cultivation.paddyField'],
    });
    if (!prediction) {
      throw new NotFoundException(`Disease prediction with ID ${id} not found`);
    }
    if (farmerId && prediction.cultivation.paddyField.farmerId !== farmerId) {
      throw new ForbiddenException('You do not own this prediction');
    }
    return prediction;
  }

  async update(id: string, updateDiseasePredictionDto: UpdateDiseasePredictionDto, farmerId?: string): Promise<DiseasePrediction> {
    const prediction = await this.findOne(id, farmerId);
    const updated = this.diseasePredictionRepository.merge(prediction, updateDiseasePredictionDto);
    return await this.diseasePredictionRepository.save(updated);
  }

  async remove(id: string, farmerId?: string): Promise<void> {
    const prediction = await this.findOne(id, farmerId);
    await this.diseasePredictionRepository.remove(prediction);
  }
}
