import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FarmersAssociationNotice } from './entities/farmers-association-notice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmersAssociationNoticeDto } from './dto/create-farmers-association.notice.dto';
import { FarmersAssociation } from './entities/farmer-association.entity';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';

@Injectable()
export class FamerAssociationNoticeService {
  constructor(
    @InjectRepository(FarmersAssociationNotice)
    private readonly famerAssociationNoticeRepository: Repository<FarmersAssociationNotice>,
    // @InjectRepository(Farmer) private readonly famerRepository: Repository<Farmer>
  ) {}
  async create(dto: CreateFarmersAssociationNoticeDto, id: string) {
    const { displayStartDate, displayEndDate } = dto;
    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    `                                                                                                    `;

    if (displayStartDate && displayEndDate) {
      if (new Date(displayStartDate) <= yesterdayEnd) {
        throw new BadRequestException('Please Enter future date Range');
      }
      if (new Date(displayStartDate) > new Date(displayEndDate)) {
        throw new BadRequestException('Please Enter future date Range');
      }
    }
    const FarmersAssociationNotice =
      this.famerAssociationNoticeRepository.create({
        ...dto,
        association: { id: dto.associationId } as FarmersAssociation,
      });
  }

  async findOne(id: string): Promise<ApiResponseDto<FarmersAssociationNotice>> {
    const notice = await this.famerAssociationNoticeRepository.findOne({
      where: { id },
      relations: {
        association: true,
      },
    });

    if (!notice) {
      throw new NotFoundException('Notice not found.');
    }

    return {
      success: true,
      message: 'Notice retrieved successfully.',
      data: notice,
    };
  }

  async update(id: string, dto: FarmersAssociationNotice) {
    const { displayStartDate, displayEndDate } = dto;

    const existing = await this.famerAssociationNoticeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Inavalid Notice ID');
    }

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    if (displayStartDate && displayEndDate) {
      if (new Date(displayStartDate) <= yesterdayEnd) {
        throw new BadRequestException('Please Enter future date Range');
      }
      if (new Date(displayStartDate) > new Date(displayEndDate)) {
        throw new BadRequestException('Start date cannot be after the end date');
   
      }
    }
  }
}
