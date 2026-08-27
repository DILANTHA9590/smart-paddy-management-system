import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiseasePredictionDto } from './dto/create-disease-prediction.dto';
import { UpdateDiseasePredictionDto } from './dto/update-disease-prediction.dto';
import { DiseasePrediction } from './entities/disease-prediction.entity';

@Injectable()
export class DiseasePredictionService {
  constructor(
    @InjectRepository(DiseasePrediction)
    private readonly diseasePredictionRepository: Repository<DiseasePrediction>,
  ) {}

  async create(createDiseasePredictionDto: CreateDiseasePredictionDto): Promise<DiseasePrediction> {
    const prediction = this.diseasePredictionRepository.create(createDiseasePredictionDto);
    return await this.diseasePredictionRepository.save(prediction);
  }

  async findAll(): Promise<DiseasePrediction[]> {
    return await this.diseasePredictionRepository.find({ relations: ['cultivation'] });
  }

  async findByCultivation(cultivationId: string): Promise<DiseasePrediction[]> {
    return await this.diseasePredictionRepository.find({
      where: { cultivationId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DiseasePrediction> {
    const prediction = await this.diseasePredictionRepository.findOne({
      where: { id },
      relations: ['cultivation'],
    });
    if (!prediction) {
      throw new NotFoundException(`Disease prediction with ID ${id} not found`);
    }
    return prediction;
  }

  async update(id: string, updateDiseasePredictionDto: UpdateDiseasePredictionDto): Promise<DiseasePrediction> {
    const prediction = await this.findOne(id);
    const updated = this.diseasePredictionRepository.merge(prediction, updateDiseasePredictionDto);
    return await this.diseasePredictionRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const prediction = await this.findOne(id);
    await this.diseasePredictionRepository.remove(prediction);
  }
}
