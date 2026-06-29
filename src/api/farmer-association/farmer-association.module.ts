import { Module } from '@nestjs/common';
import { FarmerAssociationService } from './farmer-association.service';
import { FarmerAssociationController } from './farmer-association.controller';

@Module({
  controllers: [FarmerAssociationController],
  providers: [FarmerAssociationService],
})
export class FarmerAssociationModule {}
