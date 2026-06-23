import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOtpDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email!: string;
}
