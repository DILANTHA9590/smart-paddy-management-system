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

  findOne(id: number) {
    return `This action returns a #${id} farmer`;
  }

  update(id: number, updateFarmerDto: UpdateFarmerDto) {
    return `This action updates a #${id} farmer`;
  }

  remove(id: number) {
    return `This action removes a #${id} farmer`;
  }
}
