import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { Gender } from '../entities/farmer.entity';

export class CreateFarmerFullDto {
  // User Fields
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  userName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  roleId!: string;

  // Farmer Fields
  @IsString()
  @IsNotEmpty()
  nic!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  province!: string;

  @IsString()
  @IsNotEmpty()
  village!: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  // Association Fields (Optional)
  @IsString()
  @IsOptional()
  associationId?: string;
}
