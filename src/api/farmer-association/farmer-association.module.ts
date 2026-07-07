import { Module } from '@nestjs/common';
import { FarmerAssociationService } from './farmer-association.service';
import { FarmerAssociationController } from './farmer-association.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmersAssociation } from './entities/farmer-association.entity';
import { Farmer } from '../farmers/entities/farmer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FarmersAssociation,Farmer]),],
  controllers: [FarmerAssociationController],
  providers: [FarmerAssociationService],

  
})
export class FarmerAssociationModule {}
