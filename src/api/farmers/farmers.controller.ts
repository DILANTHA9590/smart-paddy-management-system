import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../roles/entities/role.enum';
import { SearchFarmerDto } from './dto/search-farmer.dto';

@Controller('farmers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createFarmerDto: CreateFarmerDto, @Req() req: any) {
    return this.farmersService.create(createFarmerDto, req.user.sub);
  }

  @Post('admin-create')
  @Roles(UserRole.ADMIN)
  adminCreate(@Body() createFarmerFullDto: any, @Req() req: any) {
    return this.farmersService.adminCreateWithTransaction(createFarmerFullDto, req.user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() searchDto: SearchFarmerDto) {
    return this.farmersService.findAll(searchDto);
  }

  @Get('available-users')
  @Roles(UserRole.ADMIN)
  findAvailableUsers() {
    return this.farmersService.findAvailableUsers();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FARMER, UserRole.ORGANIZATION_MANAGER)
  findOne(@Param('id') id: string) {
    return this.farmersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateFarmerDto: UpdateFarmerDto, @Req() req: any) {
    return this.farmersService.update(id, updateFarmerDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.farmersService.remove(id);
  }
}
