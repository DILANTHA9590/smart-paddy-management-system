import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovijanaSewaService } from './govijana-sewa.service';
import { GovijanaSewaController } from './govijana-sewa.controller';
import { GovijanaSewa } from './entities/govijana-sewa.entity';
import { FarmersAssociation } from '../farmer-association/entities/farmer-association.entity';
import { FarmersAssociationMember } from '../farmer-association/entities/farmers-association-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GovijanaSewa, FarmersAssociation, FarmersAssociationMember])],
  controllers: [GovijanaSewaController],
  providers: [GovijanaSewaService],
  exports: [GovijanaSewaService],
})
export class GovijanaSewaModule {}
