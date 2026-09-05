import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendAdvisorEmailDto {
  @ApiProperty({ description: 'Recipient Advisor Email' })
  @IsNotEmpty()
  @IsEmail()
  advisorEmail: string;

  @ApiProperty({ description: 'Advisor Name' })
  @IsNotEmpty()
  @IsString()
  advisorName: string;

  @ApiPropertyOptional({ description: 'Advisor Role/Designation' })
  @IsOptional()
  @IsString()
  advisorRole?: string;

  @ApiPropertyOptional({ description: 'Advisor Avatar URL' })
  @IsOptional()
  @IsString()
  advisorAvatar?: string;

  @ApiProperty({ description: 'Email Subject' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Email Message Content' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Attachment File Name or URL' })
  @IsOptional()
  @IsString()
  attachmentName?: string;
}
