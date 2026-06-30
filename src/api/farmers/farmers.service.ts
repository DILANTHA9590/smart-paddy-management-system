import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Farmer } from './entities/farmer.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../roles/role.enum';

@Injectable()
export class FarmersService {
   constructor(
@InjectRepository(User) private readonly userRepository: Repository<User>,
@InjectRepository(Farmer) private readonly farmerRepository: Repository<Farmer>,
@InjectRepository(Role) private readonly RoleRepository: Repository<Role>,
      
    ) {}
  async create(dto: CreateFarmerDto) {

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
      user:{id:userId} as User  
    });
    await this.userRepository.save(farmer);
    await this.userRepository.save({...user,role:{id:role.id}}
    ) 
  }

  findAll() {
    return `This action returns all farmers`;
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
