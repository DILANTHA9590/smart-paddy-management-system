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
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Reminders')
@Controller('reminders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reminder' })
  create(@Body() createReminderDto: CreateReminderDto, @Req() req: any) {
    // If not provided in body, use logged in user's farmer ID
    if (!createReminderDto.farmerId && req.user?.farmerId) {
      createReminderDto.farmerId = req.user.farmerId;
    }
    return this.remindersService.create(createReminderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reminders' })
  findAll() {
    return this.remindersService.findAll();
  }

  @Get('my-reminders')
  @ApiOperation({ summary: 'Get reminders for logged in farmer' })
  findMyReminders(@Req() req: any) {
    return this.remindersService.findByFarmer(req.user?.farmerId);
  }

  @Get('farmer/:farmerId')
  @ApiOperation({ summary: 'Get reminders by farmer ID' })
  findByFarmer(@Param('farmerId') farmerId: string) {
    return this.remindersService.findByFarmer(farmerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reminder by id' })
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reminder (e.g. mark as completed)' })
  update(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(id, updateReminderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  remove(@Param('id') id: string) {
    return this.remindersService.remove(id);
  }
}
