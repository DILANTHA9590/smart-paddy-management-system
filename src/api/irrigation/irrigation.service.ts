import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIrrigationDto } from './dto/create-irrigation.dto';
import { UpdateIrrigationDto } from './dto/update-irrigation.dto';
import { IrrigationLog } from './entities/irrigation-log.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';
import { Farmer, Gender } from '../farmers/entities/farmer.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class IrrigationService {
  constructor(
    @InjectRepository(IrrigationLog)
    private readonly irrigationRepository: Repository<IrrigationLog>,
    @InjectRepository(Cultivation)
    private readonly cultivationRepository: Repository<Cultivation>,
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async resolveFarmerId(user?: any, requestedFarmerId?: string): Promise<string> {
    if (requestedFarmerId) {
      const directFarmer = await this.farmerRepository.findOne({ where: { id: requestedFarmerId } });
      if (directFarmer) return directFarmer.id;
    }

    if (user?.farmerId) {
      const userFarmer = await this.farmerRepository.findOne({ where: { id: user.farmerId } });
      if (userFarmer) return userFarmer.id;
    }

    const userId = user?.sub || user?.id;
    if (userId) {
      const existingFarmer = await this.farmerRepository.findOne({
        where: { user: { id: userId } },
      });
      if (existingFarmer) {
        return existingFarmer.id;
      }

      const userEntity = await this.userRepository.findOne({ where: { id: userId } });
      if (userEntity) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const newFarmer = this.farmerRepository.create({
          nic: `NIC${Date.now().toString().slice(-6)}${randomSuffix}`,
          phoneNumber: `07${randomSuffix}${randomSuffix}`,
          address: 'Main St, Agricultural Zone',
          district: 'Ampara',
          province: 'Eastern',
          village: 'Sammanthurai',
          dateOfBirth: new Date('1990-01-01'),
          gender: Gender.MALE,
          user: userEntity,
        });
        const savedFarmer = await this.farmerRepository.save(newFarmer);
        return savedFarmer.id;
      }
    }

    return '';
  }

  async create(createIrrigationDto: CreateIrrigationDto, user?: any): Promise<IrrigationLog> {
    const farmerId = await this.resolveFarmerId(user);
    if (farmerId) {
      const cultivation = await this.cultivationRepository.findOne({
        where: { id: createIrrigationDto.cultivationId },
        relations: ['paddyField'],
      });
      if (!cultivation) throw new NotFoundException('Cultivation not found');
      if (cultivation.paddyField && cultivation.paddyField.farmerId && cultivation.paddyField.farmerId !== farmerId) {
        throw new ForbiddenException('You do not own this cultivation');
      }
    }
    const log = this.irrigationRepository.create(createIrrigationDto);
    return await this.irrigationRepository.save(log);
  }

  async findAll(): Promise<IrrigationLog[]> {
    return await this.irrigationRepository.find({
      relations: ['cultivation', 'cultivation.paddyField'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findByFarmer(user?: any): Promise<IrrigationLog[]> {
    const farmerId = await this.resolveFarmerId(user);
    if (!farmerId) {
      return await this.findAll();
    }
    return await this.irrigationRepository.find({
      where: { cultivation: { paddyField: { farmerId } } },
      relations: ['cultivation', 'cultivation.paddyField'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findByCultivation(cultivationId: string): Promise<IrrigationLog[]> {
    return await this.irrigationRepository.find({
      where: { cultivationId },
      relations: ['cultivation', 'cultivation.paddyField'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findOne(id: string, user?: any): Promise<IrrigationLog> {
    const farmerId = await this.resolveFarmerId(user);
    const log = await this.irrigationRepository.findOne({
      where: { id },
      relations: ['cultivation', 'cultivation.paddyField'],
    });
    if (!log) {
      throw new NotFoundException(`Irrigation log with ID ${id} not found`);
    }
    if (farmerId && log.cultivation?.paddyField?.farmerId && log.cultivation.paddyField.farmerId !== farmerId) {
      throw new ForbiddenException('You do not own this irrigation record');
    }
    return log;
  }

  async update(id: string, updateIrrigationDto: UpdateIrrigationDto, user?: any): Promise<IrrigationLog> {
    const log = await this.findOne(id, user);
    const updated = this.irrigationRepository.merge(log, updateIrrigationDto);
    return await this.irrigationRepository.save(updated);
  }

  async remove(id: string, user?: any): Promise<void> {
    const log = await this.findOne(id, user);
    await this.irrigationRepository.remove(log);
  }
}
