import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReminderStatus, ReminderType } from '../entities/reminder.entity';

export class CreateReminderDto {
  @ApiProperty({ example: 'uuid-of-farmer' })
  @IsUUID()
  @IsOptional()
  farmerId?: string;

  @ApiProperty({ example: 'uuid-of-cultivation', required: false })
  @IsUUID()
  @IsOptional()
  cultivationId?: string;

  @ApiProperty({ example: 'Apply Urea Fertilizer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Time to apply 50kg of Urea', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-09-25' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({ enum: ReminderType, example: ReminderType.FERTILIZER })
  @IsEnum(ReminderType)
  @IsOptional()
  type?: ReminderType;

  @ApiProperty({ enum: ReminderStatus, example: ReminderStatus.PENDING, required: false })
  @IsEnum(ReminderStatus)
  @IsOptional()
  status?: ReminderStatus;
}
