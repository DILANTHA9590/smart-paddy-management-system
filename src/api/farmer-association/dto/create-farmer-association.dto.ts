import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateFarmersAssociationDto {
  @ApiProperty({
    example: 'Kandy Farmers Association',
    description: 'Unique name of the farmers association',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  name!: string;

  @IsString()
  @IsOptional()
  associationCode!: string;
  @ApiProperty({
    example: 'Kandy',
    description: 'District where the farmers association is located',
  })
  @IsString()
  @IsNotEmpty()
  district!: string;

  @ApiProperty({
    example: 'Peradeniya',
    description: 'Village where the farmers association is located',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  village!: string;
}
