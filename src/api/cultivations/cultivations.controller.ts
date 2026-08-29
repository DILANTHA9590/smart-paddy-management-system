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
import { CultivationsService } from './cultivations.service';
import { CreateCultivationDto } from './dto/create-cultivation.dto';
import { UpdateCultivationDto } from './dto/update-cultivation.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Cultivations')
@Controller('cultivations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CultivationsController {
  constructor(private readonly cultivationsService: CultivationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cultivation cycle for a paddy field' })
  create(@Body() createCultivationDto: CreateCultivationDto) {
    return this.cultivationsService.create(createCultivationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cultivations' })
  findAll() {
    return this.cultivationsService.findAll();
  }

  @Get('my-cultivations')
  @ApiOperation({ summary: 'Get cultivations for the logged in farmer' })
  findMyCultivations(@Req() req: any) {
    return this.cultivationsService.findByFarmer(req.user?.farmerId);
  }

  @Get('field/:paddyFieldId')
  @ApiOperation({ summary: 'Get cultivations by paddy field ID' })
  findByPaddyField(@Param('paddyFieldId') paddyFieldId: string) {
    return this.cultivationsService.findByPaddyField(paddyFieldId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cultivation by id' })
  findOne(@Param('id') id: string) {
    return this.cultivationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cultivation status or details' })
  update(
    @Param('id') id: string,
    @Body() updateCultivationDto: UpdateCultivationDto,
  ) {
    return this.cultivationsService.update(id, updateCultivationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cultivation record' })
  remove(@Param('id') id: string) {
    return this.cultivationsService.remove(id);
  }
}
