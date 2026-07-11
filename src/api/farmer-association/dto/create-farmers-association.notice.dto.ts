import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateFarmersAssociationNoticeDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  description!: string;

  @IsUUID()
  associationId!: string;

  @IsString()
  image?: string;

  @IsOptional()
  @IsDateString()
  displayStartDate?: Date;

  @IsDateString()
  displayEndDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}