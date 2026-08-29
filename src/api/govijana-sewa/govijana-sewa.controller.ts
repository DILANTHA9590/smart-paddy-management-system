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
} from '@nestjs/common';
import { GovijanaSewaService } from './govijana-sewa.service';
import { CreateGovijanaSewaDto } from './dto/create-govijana-sewa.dto';
import { UpdateGovijanaSewaDto } from './dto/update-govijana-sewa.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../roles/entities/role.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('govijana-sewa')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GovijanaSewaController {
  constructor(private readonly govijanaSewaService: GovijanaSewaService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER)
  create(@Body() createGovijanaSewaDto: CreateGovijanaSewaDto, @Req() req: any) {
    return this.govijanaSewaService.create(createGovijanaSewaDto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FARMER, UserRole.ORGANIZATION_MANAGER)
  findAll(@Req() req: any) {
    return this.govijanaSewaService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FARMER, UserRole.ORGANIZATION_MANAGER)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.govijanaSewaService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER)
  update(@Param('id') id: string, @Body() updateGovijanaSewaDto: UpdateGovijanaSewaDto, @Req() req: any) {
    return this.govijanaSewaService.update(id, updateGovijanaSewaDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.govijanaSewaService.remove(id, req.user);
  }
}
