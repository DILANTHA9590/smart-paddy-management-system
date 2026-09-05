import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScanDiseaseDto {
  @ApiProperty({ example: 'uuid-of-cultivation' })
  @IsString()
  @IsNotEmpty()
  cultivationId: string;

  @ApiProperty({ example: 'data:image/jpeg;base64,...' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 'blast', required: false })
  @IsString()
  @IsOptional()
  sampleType?: string;

  @ApiProperty({ example: 'AIzaSy...', required: false })
  @IsString()
  @IsOptional()
  apiKey?: string;
}
