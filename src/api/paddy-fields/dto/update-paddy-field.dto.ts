import { PartialType } from '@nestjs/swagger';
import { CreatePaddyFieldDto } from './create-paddy-field.dto';

export class UpdatePaddyFieldDto extends PartialType(CreatePaddyFieldDto) {}
