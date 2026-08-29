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
import { GovernmentNoticesService } from './government-notices.service';
import { CreateGovernmentNoticeDto } from './dto/create-government-notice.dto';
import { UpdateGovernmentNoticeDto } from './dto/update-government-notice.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../roles/entities/role.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('government-notices')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GovernmentNoticesController {
  constructor(private readonly governmentNoticesService: GovernmentNoticesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createGovernmentNoticeDto: CreateGovernmentNoticeDto, @Req() req: any) {
    return this.governmentNoticesService.create(createGovernmentNoticeDto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FARMER, UserRole.ORGANIZATION_MANAGER)
  findAll(@Query('search') search?: string, @Query('category') category?: string) {
    return this.governmentNoticesService.findAll(search, category);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FARMER, UserRole.ORGANIZATION_MANAGER)
  findOne(@Param('id') id: string) {
    return this.governmentNoticesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateGovernmentNoticeDto: UpdateGovernmentNoticeDto) {
    return this.governmentNoticesService.update(id, updateGovernmentNoticeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.governmentNoticesService.remove(id);
  }
}
