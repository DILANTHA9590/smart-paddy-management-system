import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Farmer } from './entities/farmer.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../roles/role.enum';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';
import { SearchFarmerDto } from './dto/search-farmer.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';

@Injectable()
export class FarmersService {
   constructor(
@InjectRepository(User) private readonly userRepository: Repository<User>,
@InjectRepository(Farmer) private readonly farmerRepository: Repository<Farmer>,
@InjectRepository(Role) private readonly RoleRepository: Repository<Role>,
      
    ) {}
  async create(dto: CreateFarmerDto ,id:string):Promise<ApiResponseDto<null>> {

    const { userId} = dto

    const user = await this.userRepository.findOne({
      where: { id: userId },
    })

    if(!user){
      throw new NotFoundException('User not found');
    }

   const role = await this.RoleRepository.findOne({
      where:{
        roleName:UserRole.FARMER
      }
    })
    if (!role) {
   throw new InternalServerErrorException(
    'Farmer role is not configured. Please contact the system administrator.',
  );

}
const farmer = this.farmerRepository.create({
      ...dto,
      createdBy:id,
      user:{id:userId} as User  
    });
    await this.userRepository.save(farmer);
    await this.userRepository.save({...user,role:{id:role.id}}) 


    return {
      success: true,
      message: 'User created successfully',
      data: null,
    };
  }

 async findAll(
  dto: SearchFarmerDto,
): Promise<ApiResponseDto<PaginatedDto<Farmer>>> {
  const { search, province, district, village, gender, page, limit } = dto;

  const query = this.farmerRepository
    .createQueryBuilder('farmer')
    .leftJoinAndSelect('farmer.user', 'user')
    .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.userName',
        'user.isVerified',
        'user.userStatus',
        'role.id',
        'role.roleName',
      ]);


  if (search) {
    query.andWhere(
      `(farmer.phoneNumber LIKE :search
        OR farmer.nic LIKE :search)`,
      {
        search: `%${search}%`,
      },
    );
  }

  if (province) {
    query.andWhere('farmer.province = :province', {
      province,
    });
  }

  if (district) {
    query.andWhere('farmer.district = :district', {
      district,
    });
  }

  if (village) {
    query.andWhere('farmer.village = :village', {
      village,
    });
  }

  if (gender) {
    query.andWhere('farmer.gender = :gender', {
      gender,
    });
  }

  query.take(limit);
  query.skip((page - 1) * limit);

  const [farmers, total] = await query.getManyAndCount();

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    message: 'Farmers retrieved successfully',
    data: {
      items: farmers,
      totalPages,
      limit,
    },
  };
}
async findOne(id: string): Promise<ApiResponseDto<Farmer>> {
  const farmer = await this.farmerRepository.findOne({
    where: { id },
    relations: {
      user: true,
    },
  });

  if (!farmer) {
    throw new NotFoundException('Farmer not found');
  }

  return {
    success: true,
    message: 'Farmer retrieved successfully',
    data: farmer,
  };
}

async update(
  id: string,
  dto: UpdateFarmerDto,
  user:JwtPayloadDto,

): Promise<ApiResponseDto<Farmer>> {
  const farmer = await this.farmerRepository.findOne({
    where: { id },
  });

  if (!farmer) {
    throw new NotFoundException('Farmer not found');
  }

  await this.farmerRepository.save({
    ...farmer,
    ...dto,
    updatedAt:user.sub
  });

  const updatedFarmer = await this.farmerRepository.findOne({
    where: { id },
    relations: {
      user: true,
    },
  });

  return {
    success: true,
    message: 'Farmer updated successfully',
    data: updatedFarmer!,
  };
}

async remove(id: string): Promise<ApiResponseDto<null>> {
  const farmer = await this.farmerRepository.findOne({
    where: { id },
  });

  if (!farmer) {
    throw new NotFoundException('Farmer not found');
  }

  await this.farmerRepository.remove(farmer);

  return {
    success: true,
    message: 'Farmer deleted successfully',
    data: null,
  };
}


}
