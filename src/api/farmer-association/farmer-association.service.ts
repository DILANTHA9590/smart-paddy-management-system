import { Injectable } from '@nestjs/common';
import { CreateFarmerAssociationDto } from './dto/create-farmer-association.dto';
import { UpdateFarmerAssociationDto } from './dto/update-farmer-association.dto';

@Injectable()
export class FarmerAssociationService {
  create(createFarmerAssociationDto: CreateFarmerAssociationDto) {
    return 'This action adds a new farmerAssociation';
  }

  findAll() {
    return `This action returns all farmerAssociation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} farmerAssociation`;
  }

  update(id: number, updateFarmerAssociationDto: UpdateFarmerAssociationDto) {
    return `This action updates a #${id} farmerAssociation`;
  }

  remove(id: number) {
    return `This action removes a #${id} farmerAssociation`;
  }
}
