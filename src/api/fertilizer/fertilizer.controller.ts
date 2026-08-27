import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FertilizerService } from './fertilizer.service';
import { CreateFertilizerDto } from './dto/create-fertilizer.dto';
import { UpdateFertilizerDto } from './dto/update-fertilizer.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Fertilizer')
@Controller('fertilizer')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FertilizerController {
  constructor(private readonly fertilizerService: FertilizerService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new fertilizer application' })
  create(@Body() createFertilizerDto: CreateFertilizerDto) {
    return this.fertilizerService.create(createFertilizerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fertilizer logs' })
  findAll() {
    return this.fertilizerService.findAll();
  }

  @Get('cultivation/:cultivationId')
  @ApiOperation({ summary: 'Get fertilizer logs by cultivation ID' })
  findByCultivation(@Param('cultivationId') cultivationId: string) {
    return this.fertilizerService.findByCultivation(cultivationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fertilizer log by id' })
  findOne(@Param('id') id: string) {
    return this.fertilizerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fertilizer log' })
  update(
    @Param('id') id: string,
    @Body() updateFertilizerDto: UpdateFertilizerDto,
  ) {
    return this.fertilizerService.update(id, updateFertilizerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fertilizer log' })
  remove(@Param('id') id: string) {
    return this.fertilizerService.remove(id);
  }
}
