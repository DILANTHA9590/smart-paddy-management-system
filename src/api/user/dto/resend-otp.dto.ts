import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to receive the OTP',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
