import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernmentNotice } from './entities/government-notice.entity';
import { CreateGovernmentNoticeDto } from './dto/create-government-notice.dto';
import { UpdateGovernmentNoticeDto } from './dto/update-government-notice.dto';
import { ApiResponseDto } from '../../common/dto/api-respose-dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class GovernmentNoticesService {
  constructor(
    @InjectRepository(GovernmentNotice)
    private readonly noticeRepository: Repository<GovernmentNotice>,
  ) {}

  async create(createDto: CreateGovernmentNoticeDto, user: any): Promise<ApiResponseDto<GovernmentNotice>> {
    const notice = this.noticeRepository.create({
      ...createDto,
      createdBy: { id: user.sub } as User,
      publishedAt: createDto.publishedAt ? new Date(createDto.publishedAt) : new Date(),
    });
    const saved = await this.noticeRepository.save(notice);
    return { success: true, message: 'Notice created successfully.', data: saved };
  }

  async findAll(search?: string, category?: string): Promise<ApiResponseDto<GovernmentNotice[]>> {
    const query = this.noticeRepository.createQueryBuilder('notice')
      .leftJoinAndSelect('notice.createdBy', 'user')
      .select(['notice.id', 'notice.title', 'notice.content', 'notice.category', 'notice.publishedAt', 'notice.createdAt', 'notice.updatedAt', 'user.firstName', 'user.lastName', 'user.email'])
      .orderBy('notice.createdAt', 'DESC');

    if (search) {
      query.andWhere('(notice.title LIKE :search OR notice.content LIKE :search)', { search: `%${search}%` });
    }
    
    if (category) {
      query.andWhere('notice.category = :category', { category });
    }

    const notices = await query.getMany();
    return { success: true, message: 'Notices retrieved.', data: notices };
  }

  async findOne(id: string): Promise<ApiResponseDto<GovernmentNotice>> {
    const notice = await this.noticeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!notice) throw new NotFoundException('Notice not found.');
    
    // We can sanitize user output manually to avoid sending passwords if user relation is fully loaded
    if (notice.createdBy) {
      const { password, ...safeUser } = notice.createdBy as any;
      notice.createdBy = safeUser;
    }
    
    return { success: true, message: 'Notice retrieved.', data: notice };
  }

  async update(id: string, updateDto: UpdateGovernmentNoticeDto): Promise<ApiResponseDto<GovernmentNotice>> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) throw new NotFoundException('Notice not found.');
    
    const updated = this.noticeRepository.merge(notice, updateDto);
    if (updateDto.publishedAt) updated.publishedAt = new Date(updateDto.publishedAt);
    
    const saved = await this.noticeRepository.save(updated);
    return { success: true, message: 'Notice updated.', data: saved };
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) throw new NotFoundException('Notice not found.');
    
    await this.noticeRepository.remove(notice);
    return { success: true, message: 'Notice deleted.', data: null };
  }
}
