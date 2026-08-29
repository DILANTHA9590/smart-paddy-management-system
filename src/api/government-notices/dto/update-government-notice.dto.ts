import { PartialType } from '@nestjs/swagger';
import { CreateGovernmentNoticeDto } from './create-government-notice.dto';

export class UpdateGovernmentNoticeDto extends PartialType(CreateGovernmentNoticeDto) {}
