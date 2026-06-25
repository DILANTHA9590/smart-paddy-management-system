import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address used during registration',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP sent to the user email',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp!: string;
}