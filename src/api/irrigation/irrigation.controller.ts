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
import { IrrigationService } from './irrigation.service';
import { CreateIrrigationDto } from './dto/create-irrigation.dto';
import { UpdateIrrigationDto } from './dto/update-irrigation.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Irrigation')
@Controller('irrigation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class IrrigationController {
  constructor(private readonly irrigationService: IrrigationService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new irrigation activity' })
  create(@Body() createIrrigationDto: CreateIrrigationDto, @Req() req: any) {
    return this.irrigationService.create(createIrrigationDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all irrigation logs' })
  findAll() {
    return this.irrigationService.findAll();
  }

  @Get('my-irrigation')
  @ApiOperation({ summary: 'Get irrigation logs for the logged in farmer' })
  findMyIrrigation(@Req() req: any) {
    return this.irrigationService.findByFarmer(req.user);
  }

  @Get('cultivation/:cultivationId')
  @ApiOperation({ summary: 'Get irrigation logs by cultivation ID' })
  findByCultivation(@Param('cultivationId') cultivationId: string) {
    return this.irrigationService.findByCultivation(cultivationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an irrigation log by id' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.irrigationService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an irrigation log' })
  update(
    @Param('id') id: string,
    @Body() updateIrrigationDto: UpdateIrrigationDto,
    @Req() req: any,
  ) {
    return this.irrigationService.update(id, updateIrrigationDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an irrigation log' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.irrigationService.remove(id, req.user);
  }
}
