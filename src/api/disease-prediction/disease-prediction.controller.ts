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
import { ScanDiseaseDto } from './dto/scan-disease.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Disease Prediction')
@Controller('disease-prediction')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DiseasePredictionController {
  constructor(private readonly diseasePredictionService: DiseasePredictionService) {}

  @Post('scan')
  @ApiOperation({ summary: 'AI Disease Scan for a leaf image with Gemini Vision and auto-alert email' })
  scan(@Body() body: ScanDiseaseDto, @Req() req: any) {
    return this.diseasePredictionService.scanAndPredict(body, req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Save a disease prediction record' })
  create(@Body() createDiseasePredictionDto: CreateDiseasePredictionDto, @Req() req: any) {
    return this.diseasePredictionService.create(createDiseasePredictionDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all disease predictions' })
  findAll() {
    return this.diseasePredictionService.findAll();
  }

  @Get('my-predictions')
  @ApiOperation({ summary: 'Get disease predictions for the logged in farmer' })
  findMyPredictions(@Req() req: any) {
    return this.diseasePredictionService.findByFarmer(req.user);
  }

  @Get('cultivation/:cultivationId')
  @ApiOperation({ summary: 'Get disease predictions by cultivation ID' })
  findByCultivation(@Param('cultivationId') cultivationId: string) {
    return this.diseasePredictionService.findByCultivation(cultivationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a disease prediction by id' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.diseasePredictionService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a disease prediction' })
  update(
    @Param('id') id: string,
    @Body() updateDiseasePredictionDto: UpdateDiseasePredictionDto,
    @Req() req: any,
  ) {
    return this.diseasePredictionService.update(id, updateDiseasePredictionDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a disease prediction' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.diseasePredictionService.remove(id, req.user);
  }
}
