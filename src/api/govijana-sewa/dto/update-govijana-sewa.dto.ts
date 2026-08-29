import { PartialType } from '@nestjs/swagger';
import { CreateGovijanaSewaDto } from './create-govijana-sewa.dto';

export class UpdateGovijanaSewaDto extends PartialType(CreateGovijanaSewaDto) {}
