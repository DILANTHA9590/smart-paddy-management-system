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
import { FarmerAssociationService } from './farmer-association.service';
import { CreateFarmersAssociationDto } from './dto/create-farmer-association.dto';
import { UpdateFarmerAssociationDto } from './dto/update-farmer-association.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../roles/entities/role.enum';
import { SearchFarmersAssociationDto } from './dto/search-farmer-association.dto';

@Controller('farmer-association')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FarmerAssociationController {
  constructor(
    private readonly farmerAssociationService: FarmerAssociationService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createFarmerAssociationDto: CreateFarmersAssociationDto, @Req() req: any) {
    return this.farmerAssociationService.create(createFarmerAssociationDto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() searchDto: SearchFarmersAssociationDto, @Req() req: any) {
    return this.farmerAssociationService.findAll(searchDto, req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.farmerAssociationService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateFarmerAssociationDto: UpdateFarmerAssociationDto, @Req() req: any) {
    return this.farmerAssociationService.update(id, updateFarmerAssociationDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.farmerAssociationService.remove(id);
  }

  @Get('my-org/stats')
  @Roles(UserRole.ORGANIZATION_MANAGER)
  findMyOrgStats(@Req() req: any) {
    return this.farmerAssociationService.findMyOrgStats(req.user.farmerId);
  }

  @Get('my-org/members')
  @Roles(UserRole.ORGANIZATION_MANAGER)
  findMyOrgMembers(@Req() req: any) {
    return this.farmerAssociationService.findMyOrgMembers(req.user.farmerId);
  }

  @Get('my-org')
  @Roles(UserRole.ORGANIZATION_MANAGER)
  findMyOrg(@Req() req: any) {
    return this.farmerAssociationService.findMyOrg(req.user.farmerId);
  }
}
