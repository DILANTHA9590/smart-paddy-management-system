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
import { SearchFarmersAssociationNoticeDto } from './dto/search-farmers-association-notice.dto';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';
import { Farmer } from '../farmers/entities/farmer.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FamerAssociationNoticeService {
  constructor(
    @InjectRepository(FarmersAssociationNotice)
    private readonly famerAssociationNoticeRepository: Repository<FarmersAssociationNotice>,
        @InjectRepository(Farmer)
        private readonly famerRepository: Repository<Farmer>,
            @InjectRepository(User) private readonly userRepository: Repository<User>,

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



  async remove(id: string): Promise<ApiResponseDto<null>> {

  const notice = await this.famerAssociationNoticeRepository.findOne({
    where: { id },
  });

  if (!notice) {
    throw new NotFoundException('Notice not found.');
  }

  await this.famerAssociationNoticeRepository.delete(id);

  return {
    success: true,
    message: 'Notice deleted successfully.',
    data: null,
  };
}

  async update(id: string, dto: CreateFarmersAssociationNoticeDto): Promise<ApiResponseDto<null>>{
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

     
     const newData = this.famerAssociationNoticeRepository.merge(existing,dto)

    await this.famerAssociationNoticeRepository.save(newData)

    return {
    success: true,
    message: 'Notice deleted successfully.',
    data: null,
  };

  }


// async getAll(dto: SearchFarmersAssociationNoticeDto, user: JwtPayloadDto) {
//   // 🌟 TEST: දැනට role එක token එකෙන් ගන්නවා (උඹේ test එකට අනුව)

//    // e.g., "farmer", "admin"
//   const { fromDate, toDate, search, page = 1, limit = 10 } = dto;
// const role ="admin";
//   const query = this.famerAssociationNoticeRepository
//     .createQueryBuilder('notice')
//     .leftJoin('notice.association', 'association')
//     .addSelect(['association.name']);

//   // 🔐 1. ADMIN නෙමෙයි නම් විතරක් සමිතිය හොයන ලොජික් එක රන් කරනවා
//   if (role !== 'admin') {
//     // User -> Farmer -> Association ලින්ක් එක එකපාර relations වලින් ඇදලා ගන්නවා
//     const dbUser = await this.userRepository.findOne({
//       where: { id: user.sub },
//       relations: {   
//         farmer: {
//         associationMemberships:{
//           association:true
//         }
//         },
//       },
//     });

//     // ⚠️ වැදගත්: Farmer කෙනෙක්ට සමිතියක් ඇත්තටම link වෙලා තියෙනවද කියලා check කරනවා
//     const {}= dbUser
    

//   //   if (!associationId) {
//   //     throw new NotFoundException('ඔබ කිසිදු ගොවි සමිතියකට අනුයුක්ත කර නැත.');
//   //   }

//   //   // 🎯 අන්න ඒ හොයාගත්තු ID එකෙන් විතරක් notices filter කරනවා
//   //   query.andWhere('notice.associationId = :associationId', { associationId });
//   // }

//   // 📅 2. DATE FILTER (දිනයන් අනුව සෙවීම)
//   if (fromDate && toDate) {
//     query.andWhere('notice.createdAt BETWEEN :fromDate AND :toDate', {
//       fromDate,
//       toDate,
//     });
//   }

//   // 🔍 3. SEARCH FILTER
//   if (search) {
//     query.andWhere(
//       '(notice.title LIKE :search OR notice.description LIKE :search)',
//       { search: `%${search}%` },
//     );
//   }

//   // 📄 4. PAGINATION
//   query.skip((page - 1) * limit).take(limit);

//   const [notices, total] = await query.getManyAndCount();

//   return {
//     success: true,
//     data: {
//       items: notices,
//       totalItems: total,
//       totalPages: Math.ceil(total / limit),
//       page,
//       limit,
//     },
//   };
// }

  




 

  


//   }

}