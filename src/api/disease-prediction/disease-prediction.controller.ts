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
import { DiseasePredictionService } from './disease-prediction.service';
import { CreateDiseasePredictionDto } from './dto/create-disease-prediction.dto';
import { UpdateDiseasePredictionDto } from './dto/update-disease-prediction.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Disease Prediction')
@Controller('disease-prediction')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DiseasePredictionController {
  constructor(private readonly diseasePredictionService: DiseasePredictionService) {}

  @Post()
  @ApiOperation({ summary: 'Save a new AI disease prediction' })
  create(@Body() createDiseasePredictionDto: CreateDiseasePredictionDto, @Req() req: any) {
    return this.diseasePredictionService.create(createDiseasePredictionDto, req.user?.farmerId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all disease predictions' })
  findAll() {
    return this.diseasePredictionService.findAll();
  }

  @Get('my-predictions')
  @ApiOperation({ summary: 'Get disease predictions for logged in farmer' })
  findMyPredictions(@Req() req: any) {
    return this.diseasePredictionService.findByFarmer(req.user?.farmerId);
  }

  @Get('cultivation/:cultivationId')
  @ApiOperation({ summary: 'Get predictions by cultivation ID' })
  findByCultivation(@Param('cultivationId') cultivationId: string) {
    return this.diseasePredictionService.findByCultivation(cultivationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a disease prediction by id' })
  findOne(@Param('id') id: string) {
    return this.diseasePredictionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a disease prediction (e.g. feedback/treatment added)' })
  update(
    @Param('id') id: string,
    @Body() updateDiseasePredictionDto: UpdateDiseasePredictionDto,
    @Req() req: any,
  ) {
    return this.diseasePredictionService.update(id, updateDiseasePredictionDto, req.user?.farmerId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a disease prediction log' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.diseasePredictionService.remove(id, req.user?.farmerId);
  }
}
