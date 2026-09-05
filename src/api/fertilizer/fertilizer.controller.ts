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
  create(@Body() createFertilizerDto: CreateFertilizerDto, @Req() req: any) {
    return this.fertilizerService.create(createFertilizerDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fertilizer logs' })
  findAll() {
    return this.fertilizerService.findAll();
  }

  @Get('my-fertilizers')
  @ApiOperation({ summary: 'Get fertilizer logs for the logged in farmer' })
  findMyFertilizers(@Req() req: any) {
    return this.fertilizerService.findByFarmer(req.user);
  }

  @Get('cultivation/:cultivationId')
  @ApiOperation({ summary: 'Get fertilizer logs by cultivation ID' })
  findByCultivation(@Param('cultivationId') cultivationId: string) {
    return this.fertilizerService.findByCultivation(cultivationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fertilizer log by id' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.fertilizerService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fertilizer log' })
  update(
    @Param('id') id: string,
    @Body() updateFertilizerDto: UpdateFertilizerDto,
    @Req() req: any,
  ) {
    return this.fertilizerService.update(id, updateFertilizerDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fertilizer log' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.fertilizerService.remove(id, req.user);
  }
}
