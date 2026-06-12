import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';

@Injectable()
export class RolesService {
  constructor(
  @InjectRepository
  (Role) private readonly roleRepository: Repository<Role>,
  ){}
  async create(createRoleDto: CreateRoleDto ,id:string):Promise<ApiResponseDto<null>> {
    const {roleName}=createRoleDto

    const existingRole = await this.roleRepository.createQueryBuilder('role')
    .where('role.roleName = :name',{roleName})
    .getOne()

    if (existingRole)  throw new ConflictException("Role already exists")


    await this.roleRepository.save(createRoleDto)  


    return{
    success: true,
    message: 'rOLE created successfully',
    data:null

    }













  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
