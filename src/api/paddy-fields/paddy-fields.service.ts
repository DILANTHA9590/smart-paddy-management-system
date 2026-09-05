import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaddyFieldDto } from './dto/create-paddy-field.dto';
import { UpdatePaddyFieldDto } from './dto/update-paddy-field.dto';
import { PaddyField } from './entities/paddy-field.entity';
import { Farmer, Gender } from '../farmers/entities/farmer.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PaddyFieldsService {
  constructor(
    @InjectRepository(PaddyField)
    private readonly paddyFieldRepository: Repository<PaddyField>,
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

      // Auto-create a farmer profile for this user
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

    // Fallback: Check if any farmer exists in the DB
    const anyFarmer = await this.farmerRepository.findOne({ where: {} });
    if (anyFarmer) {
      return anyFarmer.id;
    }

    throw new BadRequestException('Farmer profile could not be determined. Please ensure farmer profile is registered.');
  }

  async create(createPaddyFieldDto: CreatePaddyFieldDto, user?: any): Promise<PaddyField> {
    const farmerId = await this.resolveFarmerId(user, createPaddyFieldDto.farmerId);
    const field = this.paddyFieldRepository.create({
      ...createPaddyFieldDto,
      farmerId,
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

  async findByUser(user: any): Promise<PaddyField[]> {
    if (!user) {
      return await this.findAll();
    }
    const farmerId = await this.resolveFarmerId(user).catch(() => null);
    if (!farmerId) {
      return await this.findAll();
    }
    return await this.paddyFieldRepository.find({
      where: { farmerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, farmerId?: string): Promise<PaddyField> {
    const field = await this.paddyFieldRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });
    if (!field) {
      throw new NotFoundException(`Paddy field with ID ${id} not found`);
    }
    if (farmerId && field.farmerId !== farmerId) {
      throw new ForbiddenException('You do not own this paddy field');
    }
    return field;
  }

  async update(id: string, updatePaddyFieldDto: UpdatePaddyFieldDto, user?: any): Promise<PaddyField> {
    const field = await this.findOne(id);
    if (user && user.role !== 'Admin' && user.role !== 'SUPER_ADMIN') {
      const farmerId = await this.resolveFarmerId(user).catch(() => null);
      if (farmerId && field.farmerId && field.farmerId !== farmerId) {
        throw new ForbiddenException('You do not have permission to update this paddy field');
      }
    }
    const updated = this.paddyFieldRepository.merge(field, updatePaddyFieldDto);
    return await this.paddyFieldRepository.save(updated);
  }

  async remove(id: string, user?: any): Promise<void> {
    const field = await this.findOne(id);
    if (user && user.role !== 'Admin' && user.role !== 'SUPER_ADMIN') {
      const farmerId = await this.resolveFarmerId(user).catch(() => null);
      if (farmerId && field.farmerId && field.farmerId !== farmerId) {
        throw new ForbiddenException('You do not have permission to delete this paddy field');
      }
    }
    await this.paddyFieldRepository.remove(field);
  }
}
