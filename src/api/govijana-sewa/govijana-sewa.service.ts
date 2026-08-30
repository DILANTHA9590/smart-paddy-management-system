import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovijanaSewa } from './entities/govijana-sewa.entity';
import { CreateGovijanaSewaDto } from './dto/create-govijana-sewa.dto';
import { UpdateGovijanaSewaDto } from './dto/update-govijana-sewa.dto';
import { ApiResponseDto } from '../../common/dto/api-respose-dto';
import { FarmersAssociation } from '../farmer-association/entities/farmer-association.entity';
import { FarmersAssociationMember } from '../farmer-association/entities/farmers-association-member.entity';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';

@Injectable()
export class GovijanaSewaService {
  constructor(
    @InjectRepository(GovijanaSewa)
    private readonly govijanaSewaRepository: Repository<GovijanaSewa>,
    @InjectRepository(FarmersAssociation)
    private readonly associationRepository: Repository<FarmersAssociation>,
    @InjectRepository(FarmersAssociationMember)
    private readonly memberRepository: Repository<FarmersAssociationMember>,
  ) {}

  async create(createDto: CreateGovijanaSewaDto, user: JwtPayloadDto): Promise<ApiResponseDto<GovijanaSewa>> {
    let associationId = createDto.associationId;

    if (user.role === 'ORGANIZATION_MANAGER') {
      // Must find the organization they manage
      const managedOrg = await this.associationRepository.findOne({
        where: { manager: { id: user.farmerId } }
      });
      if (!managedOrg) {
        throw new ForbiddenException('You do not manage any organization.');
      }
      
      // Enforce that they create for their own org
      if (associationId && associationId !== managedOrg.id) {
        throw new ForbiddenException('You can only create notices for your own organization.');
      }
      
      associationId = managedOrg.id; // Auto-assign to their org
    } else if (user.role === 'ADMIN') {
      // Admin can leave it empty (general) or specify an ID
      associationId = createDto.associationId;
    } else {
      throw new ForbiddenException('You do not have permission to create this.');
    }

    const govijanaSewa = this.govijanaSewaRepository.create({
      ...createDto,
      association: associationId ? ({ id: associationId } as FarmersAssociation) : undefined,
      publishedAt: createDto.publishedAt ? new Date(createDto.publishedAt) : new Date(),
    });

    const saved = await this.govijanaSewaRepository.save(govijanaSewa);
    return { success: true, message: 'Govijana Sewa record created successfully.', data: saved };
  }

  async findAll(user: JwtPayloadDto): Promise<ApiResponseDto<GovijanaSewa[]>> {
    const query = this.govijanaSewaRepository.createQueryBuilder('govijanaSewa')
      .leftJoinAndSelect('govijanaSewa.association', 'association')
      .orderBy('govijanaSewa.createdAt', 'DESC');

    if (user.role === 'ADMIN') {
      // Admin sees everything
    } else if (user.role === 'ORGANIZATION_MANAGER') {
      const managedOrg = await this.associationRepository.findOne({
        where: { manager: { id: user.farmerId } }
      });
      
      if (managedOrg) {
        // General (associationId IS NULL) OR their own org
        query.where('govijanaSewa.associationId IS NULL OR govijanaSewa.associationId = :orgId', { orgId: managedOrg.id });
      } else {
        // Only General
        query.where('govijanaSewa.associationId IS NULL');
      }
    } else if (user.role === 'FARMER') {
      // Find which orgs they belong to
      const memberships = await this.memberRepository.find({
        where: { farmer: { id: user.farmerId } },
        relations: ['association']
      });
      const orgIds = memberships.map(m => m.association?.id).filter(Boolean);
      
      if (orgIds.length > 0) {
        query.where('govijanaSewa.associationId IS NULL OR govijanaSewa.associationId IN (:...orgIds)', { orgIds });
      } else {
        query.where('govijanaSewa.associationId IS NULL');
      }
    }

    const records = await query.getMany();
    return { success: true, message: 'Records retrieved.', data: records };
  }

  async findOne(id: string, user: JwtPayloadDto): Promise<ApiResponseDto<GovijanaSewa>> {
    const record = await this.govijanaSewaRepository.findOne({
      where: { id },
      relations: ['association'],
    });
    
    if (!record) throw new NotFoundException('Record not found.');

    // Enforce access control for single record
    if (user.role !== 'ADMIN') {
      if (record.association) {
        if (user.role === 'ORGANIZATION_MANAGER') {
          const managedOrg = await this.associationRepository.findOne({ where: { manager: { id: user.farmerId } } });
          if (!managedOrg || managedOrg.id !== record.association.id) {
            throw new ForbiddenException('Cannot access this record.');
          }
        } else if (user.role === 'FARMER') {
          const membership = await this.memberRepository.findOne({
            where: { farmer: { id: user.farmerId }, association: { id: record.association.id } }
          });
          if (!membership) {
            throw new ForbiddenException('Cannot access this record.');
          }
        }
      }
    }
    
    return { success: true, message: 'Record retrieved.', data: record };
  }

  async update(id: string, updateDto: UpdateGovijanaSewaDto, user: JwtPayloadDto): Promise<ApiResponseDto<GovijanaSewa>> {
    const record = await this.govijanaSewaRepository.findOne({
      where: { id },
      relations: ['association']
    });
    if (!record) throw new NotFoundException('Record not found.');
    
    if (user.role === 'ORGANIZATION_MANAGER') {
      const managedOrg = await this.associationRepository.findOne({
        where: { manager: { id: user.farmerId } }
      });
      if (!managedOrg || !record.association || record.association.id !== managedOrg.id) {
        throw new ForbiddenException('You can only edit records for your own organization.');
      }
      
      if (updateDto.associationId && updateDto.associationId !== managedOrg.id) {
        throw new ForbiddenException('Cannot change organization ownership.');
      }
    }

    const updated = this.govijanaSewaRepository.merge(record, updateDto);
    if (updateDto.publishedAt) updated.publishedAt = new Date(updateDto.publishedAt);
    if (updateDto.associationId) updated.association = { id: updateDto.associationId } as FarmersAssociation;
    
    const saved = await this.govijanaSewaRepository.save(updated);
    return { success: true, message: 'Record updated.', data: saved };
  }

  async remove(id: string, user: JwtPayloadDto): Promise<ApiResponseDto<null>> {
    const record = await this.govijanaSewaRepository.findOne({
      where: { id },
      relations: ['association']
    });
    if (!record) throw new NotFoundException('Record not found.');
    
    if (user.role === 'ORGANIZATION_MANAGER') {
      const managedOrg = await this.associationRepository.findOne({
        where: { manager: { id: user.farmerId } }
      });
      if (!managedOrg || !record.association || record.association.id !== managedOrg.id) {
        throw new ForbiddenException('You can only delete records from your own organization.');
      }
    }
    
    await this.govijanaSewaRepository.remove(record);
    return { success: true, message: 'Record deleted.', data: null };
  }
}
