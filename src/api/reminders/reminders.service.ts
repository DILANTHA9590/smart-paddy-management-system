import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { Farmer } from '../farmers/entities/farmer.entity';
import { Cultivation } from '../cultivations/entities/cultivation.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
    @InjectRepository(Cultivation)
    private readonly cultivationRepository: Repository<Cultivation>,
    private readonly emailService: EmailService,
  ) {}

  async resolveFarmerId(user?: any, requestedFarmerId?: string): Promise<string> {
    if (requestedFarmerId) return requestedFarmerId;
    if (user?.farmerId) return user.farmerId;
    
    const userId = user?.sub || user?.id;
    if (userId) {
      const farmer = await this.farmerRepository.findOne({
        where: { user: { id: userId } },
      });
      if (farmer) return farmer.id;
    }

    const fallbackFarmer = await this.farmerRepository.findOne({ where: {} });
    if (fallbackFarmer) return fallbackFarmer.id;

    throw new BadRequestException('Farmer profile required for reminders');
  }

  async create(createReminderDto: CreateReminderDto, user?: any): Promise<Reminder> {
    const farmerId = await this.resolveFarmerId(user, createReminderDto.farmerId);
    const reminder = this.reminderRepository.create({
      ...createReminderDto,
      farmerId,
    });
    const saved = await this.reminderRepository.save(reminder);

    // Fetch cultivation details if attached
    let cultivationName = '';
    if (saved.cultivationId) {
      const cult = await this.cultivationRepository.findOne({
        where: { id: saved.cultivationId },
        relations: ['paddyField'],
      });
      if (cult) {
        cultivationName = `${cult.cropVariety} (${cult.paddyField?.name || 'Field'})`;
      }
    }

    // Auto-send notification email to farmer
    const recipientEmail = user?.email || 'dilanthanayanajith@gmail.com';
    const farmerName = user?.firstName || user?.userName || 'Paddy Farmer';
    
    this.emailService.sendReminderEmail(recipientEmail, farmerName, {
      title: saved.title,
      dueDate: saved.dueDate,
      type: saved.type,
      description: saved.description,
      cultivationName,
    }).catch(err => console.error('Error in background reminder email:', err));

    return saved;
  }

  async findAll(): Promise<Reminder[]> {
    return await this.reminderRepository.find({ relations: ['farmer', 'cultivation'] });
  }

  async findByFarmer(farmerId: string): Promise<Reminder[]> {
    if (!farmerId) {
      return await this.findAll();
    }
    return await this.reminderRepository.find({
      where: { farmerId },
      order: { dueDate: 'ASC' },
      relations: ['cultivation', 'cultivation.paddyField'],
    });
  }

  async findByUser(user: any): Promise<Reminder[]> {
    if (!user) return await this.findAll();
    const farmerId = await this.resolveFarmerId(user).catch(() => null);
    if (!farmerId) return await this.findAll();
    return await this.findByFarmer(farmerId);
  }

  async findOne(id: string, farmerId?: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id },
      relations: ['farmer', 'cultivation', 'cultivation.paddyField'],
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
    const reminder = await this.findOne(id);
    const updated = this.reminderRepository.merge(reminder, updateReminderDto);
    return await this.reminderRepository.save(updated);
  }

  async remove(id: string, farmerId?: string): Promise<void> {
    const reminder = await this.findOne(id);
    await this.reminderRepository.remove(reminder);
  }
}
