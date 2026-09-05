import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaddyField } from './entities/paddy-field.entity';
import { PaddyFieldsController } from './paddy-fields.controller';
import { PaddyFieldsService } from './paddy-fields.service';
import { Farmer } from '../farmers/entities/farmer.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaddyField, Farmer, User])],
  controllers: [PaddyFieldsController],
  providers: [PaddyFieldsService],
  exports: [PaddyFieldsService],
})
export class PaddyFieldsModule {}
