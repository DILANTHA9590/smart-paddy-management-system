import { PartialType } from '@nestjs/swagger';
import { CreateFarmersAssociationDto } from './create-farmer-association.dto';


export class UpdateFarmerAssociationDto extends PartialType(CreateFarmersAssociationDto) {}
