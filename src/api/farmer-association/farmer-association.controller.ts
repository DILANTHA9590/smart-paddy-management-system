import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FarmerAssociationService } from './farmer-association.service';
import { CreateFarmerAssociationDto } from './dto/create-farmer-association.dto';
import { UpdateFarmerAssociationDto } from './dto/update-farmer-association.dto';

@Controller('farmer-association')
export class FarmerAssociationController {
  constructor(private readonly farmerAssociationService: FarmerAssociationService) {}

  @Post()
  create(@Body() createFarmerAssociationDto: CreateFarmerAssociationDto) {
    return this.farmerAssociationService.create(createFarmerAssociationDto);
  }

  @Get()
  findAll() {
    return this.farmerAssociationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmerAssociationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmerAssociationDto: UpdateFarmerAssociationDto) {
    return this.farmerAssociationService.update(+id, updateFarmerAssociationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmerAssociationService.remove(+id);
  }
}
