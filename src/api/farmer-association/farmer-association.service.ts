import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFarmerAssociationDto } from './dto/update-farmer-association.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FarmersAssociation } from './entities/farmer-association.entity';
import { Repository } from 'typeorm';
import { Farmer } from '../farmers/entities/farmer.entity';
import { CreateFarmersAssociationDto } from './dto/create-farmer-association.dto';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';
import { SearchFarmersAssociationDto } from './dto/search-farmer-association.dto';
import { SearchFarmerDto } from '../farmers/dto/search-farmer.dto';
import { QueryResult } from 'typeorm/browser';

@Injectable()
export class FarmerAssociationService {
  constructor(
    @InjectRepository(FarmersAssociation)
    private readonly famerAssociationRepository: Repository<FarmersAssociation>,
    @InjectRepository(Farmer)
    private readonly famerRepository: Repository<Farmer>,
  ) {}
  async create(
    dto: CreateFarmersAssociationDto,
    user: JwtPayloadDto,
  ): Promise<ApiResponseDto<null>> {
    const isExisting = await this.famerAssociationRepository
      .createQueryBuilder('farmerAssociation')
      .where('farmerAssociation.name =:name', { name: dto.name })
      .getOne();

    if (isExisting) {
      throw new ConflictException('This farmer association already exists.');
    }

    const associationCode = await this.generateAssociationCode();

    await this.famerAssociationRepository.save({
      ...dto,
      associationCode,
      createdBy: user.sub,
      updatedBy: user.sub,
    });

    return {
      success: true,
      message: 'Farmer updated successfully',
      data: null,
    };
  }

  async generateAssociationCode(): Promise<string> {
    //genarate  association code
    const associationNumber = await this.famerAssociationRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    let nextNumber: Number = 100;
    let Prefix: string = 'FA';

    if (associationNumber && associationNumber.associationCode) {
      nextNumber =
        Number(associationNumber.associationCode.replace(/\D/g, '')) + 1;
    }
    return `${Prefix}${String(nextNumber).padStart(4, '0')}`;
  }

  async update(
    id: string,
    dto: UpdateFarmerAssociationDto,
    user: JwtPayloadDto,
  ): Promise<ApiResponseDto<null>> {
    const association = await this.famerAssociationRepository.findOne({
      where: { id },
    });

    if (!association) {
      throw new NotFoundException('Farmers association not found.');
    }

    if (dto.name && dto.name !== association.name) {
      const exists = await this.famerAssociationRepository.findOne({
        where: { name: dto.name },
      });

      if (exists) {
        throw new ConflictException('This farmer association already exists.');
      }
    }

    await this.famerAssociationRepository.update(id, {
      ...dto,
      updatedBy: user.sub,
    });

    return {
      success: true,
      message: 'Farmers association updated successfully.',
      data: null,
    };
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    const association = await this.famerAssociationRepository.findOne({
      where: { id },
    });

    if (!association) {
      throw new NotFoundException('Farmers association not found.');
    }

    await this.famerAssociationRepository.remove(association);

    return {
      success: true,
      message: 'Farmers association deleted successfully.',
      data: null,
    };
  }

  async findAll(dto: SearchFarmersAssociationDto, user: JwtPayloadDto) {
    const { search, district, village, province } = dto;
    const limit = dto.limit || 10;
    const page = dto.page || 1;
    // 🔹 Role filter එක මුලින්
    // switch (user.role) {
    //   case Role.ADMIN:
    //     break;

    //   case Role.FARMER:
    //     query
    //       .innerJoin('association.members', 'member')
    //       .andWhere('member.farmerId = :farmerId', {
    //         farmerId: user.farmerId,
    //       });
    //     break;

    //   case Role.AGRICULTURE_ADVISOR:
    //     query
    //       .innerJoin('association.members', 'member')
    //       .andWhere('member.associationId = :associationId', {
    //         associationId: user.associationId,
    //       });
    //     break;
    // }

    const query =
      this.famerAssociationRepository.createQueryBuilder('association');

    if (search) {
      query.andWhere(
        '(association.name LIKE :search OR association.associationCode LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (province) {
      query.andWhere('association.province LIKE :province', {
        province: `%${province}%`,
      });
    }

    if (district) {
      query.andWhere('association.district LIKE :district', {
        district: `%${district}%`,
      });
    }

    query.take(limit);

    query.skip((page - 1) * limit);

    const [association, total] = await query.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'User created successfully',
      data: {
        items: association,
        totalPages,
        limit,
      },
    };
  }

  async findOne(id: string): Promise<ApiResponseDto<FarmersAssociation>> {
    const association = await this.famerAssociationRepository.findOne({
      where: { id },
      relations: ['manager', 'manager.user', 'members', 'members.farmer', 'members.farmer.user']
    });

    if (!association) {
      throw new NotFoundException('Farmers association not found.');
    }

    return {
      success: true,
      message: 'Farmers association retrieved successfully.',
      data: association,
    };
  }

  async findMyOrg(farmerId: string): Promise<ApiResponseDto<FarmersAssociation>> {
    const association = await this.famerAssociationRepository.findOne({
      where: { manager: { id: farmerId } },
      relations: ['manager']
    });

    if (!association) {
      throw new NotFoundException('You do not manage any organization.');
    }

    return {
      success: true,
      message: 'Managed organization retrieved successfully.',
      data: association,
    };
  }

  async findMyOrgMembers(farmerId: string): Promise<ApiResponseDto<any>> {
    const association = await this.famerAssociationRepository.findOne({
      where: { manager: { id: farmerId } },
      relations: ['members', 'members.farmer']
    });

    if (!association) {
      throw new NotFoundException('You do not manage any organization.');
    }

    return {
      success: true,
      message: 'Organization members retrieved successfully.',
      data: association.members || [],
    };
  }

  async findMyOrgStats(farmerId: string): Promise<ApiResponseDto<any>> {
    const association = await this.famerAssociationRepository.findOne({
      where: { manager: { id: farmerId } },
      relations: ['members', 'notices']
    });

    if (!association) {
      throw new NotFoundException('You do not manage any organization.');
    }

    const totalMembers = association.members ? association.members.length : 0;
    const activeAnnouncements = association.notices ? association.notices.length : 0;
    const pendingRequests = 0; // Placeholder

    return {
      success: true,
      message: 'Organization stats retrieved successfully.',
      data: {
        totalMembers,
        pendingRequests,
        activeAnnouncements
      },
    };
  }
}
