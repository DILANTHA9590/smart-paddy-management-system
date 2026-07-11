import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export class CreateFarmerDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @ApiProperty({
    example: '200012345678',
    description: 'National Identity Card Number',
  })
  @IsString()
  @Length(10, 12)
  nic!: string;

  @ApiProperty({
    example: '+94771234567',
    description: 'Farmer phone number',
  })
  @IsPhoneNumber()
  phoneNumber!: string;

  @ApiProperty({
    example: 'No. 25, Main Street',
    description: 'Residential address',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    example: 'Kandy',
  })
  @IsString()
  district!: string;

  @ApiProperty({
    example: 'Central',
  })
  @IsString()
  province!: string;

  @ApiProperty({
    example: 'Galagedara',
  })
  @IsString()
  village!: string;

  @ApiProperty({
    example: '2000-05-20',
    description: 'Date of birth',
  })
  @IsDateString()
  dateOfBirth!: Date;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender!: Gender;
}
