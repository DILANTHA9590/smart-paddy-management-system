import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';
// x
@Injectable()
export class RolesService {
  constructor(
  @InjectRepository
  (Role) private readonly roleRepository: Repository<Role>,
  ){}
  async create(createRoleDto: CreateRoleDto ,id:string):Promise<ApiResponseDto<null>> {
    const {roleName}=createRoleDto
    const existingRole = await this.roleRepository.createQueryBuilder('role')
    .where('role.roleName = :roleName',{roleName})
    .getOne()
    if (existingRole)  throw new ConflictException("Role already exists")

    await this.roleRepository.save(createRoleDto)  


    return{
    success: true,
    message: `Role ${roleName} created successfully`,
    data:null

    }

  }

 async findAll(name: string):Promise<ApiResponseDto<Role[]>> {
  const roles = await this.roleRepository.createQueryBuilder('role')
    .where('role.roleName LIKE :name', { name: `%${name}%` })
    .getMany();

  return {
    success: true,
    message: `Roles retrieved successfully`,
    data: roles
  };
}
  

async findOne(id: string):Promise<ApiResponseDto<Role>> {

    const role = await this.roleRepository.findOne({
      where:{
        id
      }
    })

    if(!role) throw new NotFoundException("This role name not found")

    return{
    success: true,
    message: `Role retrieved successfully`,
    data: role
    }
  
  }

  async remove(id: string):Promise<ApiResponseDto<null>> {

     const role = await this.roleRepository.findOne({
      where:{
        id
      }
    })

    if(!role) throw new NotFoundException("This role name not found")


    await this.roleRepository.remove(role)  


    return{
    success: true,
    message: `Role deleted successfully`,
    data: null
    }

  }



  async updateRole(id:string,dto:UpdateRoleDto):Promise<ApiResponseDto<Role>>{
     const role = await this.roleRepository.findOne({
      where:{
        id
      }
    })
    if(!role) throw new NotFoundException("This role  not found")

    const newroleData =  this.roleRepository.merge(role,dto)

    await this.roleRepository.save(newroleData);


    return{
    success: true,
    message: `Role updated successfully`,
    data: newroleData
    }






  }
}
