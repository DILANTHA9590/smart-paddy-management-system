import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Req() req:any):Promise<ApiResponseDto<null>>{
    return this.rolesService.create(createRoleDto,req.user);
  }

  @Get()
  findAll(@Query('name') name:string):Promise<ApiResponseDto<Role[]>> {
    return this.rolesService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string):Promise<ApiResponseDto<Role>> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id:string, @Body() updateRoleDto: UpdateRoleDto):Promise<ApiResponseDto<Role>> {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string):Promise<ApiResponseDto<null>> {
    return this.rolesService.remove(id);
  }
}
