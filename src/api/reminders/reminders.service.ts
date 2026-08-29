import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
  ) {}

  async create(createReminderDto: CreateReminderDto): Promise<Reminder> {
    const reminder = this.reminderRepository.create(createReminderDto);
    return await this.reminderRepository.save(reminder);
  }

  async findAll(): Promise<Reminder[]> {
    return await this.reminderRepository.find({ relations: ['farmer', 'cultivation'] });
  }

  async findByFarmer(farmerId: string): Promise<Reminder[]> {
    return await this.reminderRepository.find({
      where: { farmerId },
      order: { dueDate: 'ASC' },
      relations: ['cultivation'],
    });
  }

  async findOne(id: string, farmerId?: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id },
      relations: ['farmer', 'cultivation'],
    });
    if (!reminder) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }
    if (farmerId && reminder.farmerId !== farmerId) {
      throw new ForbiddenException('You do not own this reminder');
    }
    return reminder;
  }

  async update(id: string, updateReminderDto: UpdateReminderDto, farmerId?: string): Promise<Reminder> {
    const reminder = await this.findOne(id, farmerId);
    const updated = this.reminderRepository.merge(reminder, updateReminderDto);
    return await this.reminderRepository.save(updated);
  }

  async remove(id: string, farmerId?: string): Promise<void> {
    const reminder = await this.findOne(id, farmerId);
    await this.reminderRepository.remove(reminder);
  }
}
