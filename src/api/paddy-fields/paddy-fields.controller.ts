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
import { PaddyFieldsService } from './paddy-fields.service';
import { CreatePaddyFieldDto } from './dto/create-paddy-field.dto';
import { UpdatePaddyFieldDto } from './dto/update-paddy-field.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Paddy Fields')
@Controller('paddy-fields')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaddyFieldsController {
  constructor(private readonly paddyFieldsService: PaddyFieldsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new paddy field' })
  create(@Body() createPaddyFieldDto: CreatePaddyFieldDto, @Req() req: any) {
    return this.paddyFieldsService.create(createPaddyFieldDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all paddy fields' })
  findAll() {
    return this.paddyFieldsService.findAll();
  }

  @Get('my-fields')
  @ApiOperation({ summary: 'Get paddy fields for the logged in farmer' })
  findMyFields(@Req() req: any) {
    return this.paddyFieldsService.findByUser(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a paddy field by id' })
  findOne(@Param('id') id: string) {
    return this.paddyFieldsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a paddy field' })
  update(
    @Param('id') id: string,
    @Body() updatePaddyFieldDto: UpdatePaddyFieldDto,
    @Req() req: any,
  ) {
    return this.paddyFieldsService.update(id, updatePaddyFieldDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a paddy field' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.paddyFieldsService.remove(id, req.user);
  }
}
