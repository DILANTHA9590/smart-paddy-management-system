import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../gender.enum";

export class CreateFarmerDto {

  @PrimaryGeneratedColumn() 
  @IsOptional()
  @IsString() 
  id!:string

  @IsString()
  @IsNotEmpty()
  nic!: string;

  @IsString()
  @IsNotEmpty()
  phone_number!: string;

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

  @Type(() => Date)
  @IsDate()
  date_of_birth!: Date;

 @IsEnum(Gender)
 gender!: Gender;

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  organization_id?: number;
}