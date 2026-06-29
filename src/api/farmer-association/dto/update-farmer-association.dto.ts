import { PartialType } from '@nestjs/swagger';
import { CreateFarmerAssociationDto } from './create-farmer-association.dto';

export class UpdateFarmerAssociationDto extends PartialType(CreateFarmerAssociationDto) {}
