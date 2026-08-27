import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaddyField } from './entities/paddy-field.entity';
import { PaddyFieldsController } from './paddy-fields.controller';
import { PaddyFieldsService } from './paddy-fields.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaddyField])],
  controllers: [PaddyFieldsController],
  providers: [PaddyFieldsService],
  exports: [PaddyFieldsService],
})
export class PaddyFieldsModule {}
