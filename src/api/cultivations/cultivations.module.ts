import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivation } from './entities/cultivation.entity';
import { CultivationsController } from './cultivations.controller';
import { CultivationsService } from './cultivations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivation])],
  controllers: [CultivationsController],
  providers: [CultivationsService],
  exports: [CultivationsService],
})
export class CultivationsModule {}
