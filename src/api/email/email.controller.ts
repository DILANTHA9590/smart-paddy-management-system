import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendAdvisorEmailDto } from './dto/send-advisor-email.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Email & Agricultural Advisory')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('advisors')
  @ApiOperation({ summary: 'Get list of available agricultural advisors' })
  getAdvisors() {
    return this.emailService.getAdvisorsList();
  }

  @Post('send-advisor')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send email to an agricultural advisor and save to history' })
  sendAdvisorEmail(@Req() req: any, @Body() dto: SendAdvisorEmailDto) {
    return this.emailService.sendAdvisorEmail(req.user, dto);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get email inquiry history for logged in user' })
  getEmailHistory(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.emailService.getFarmerEmailHistory(req.user?.id, status, search);
  }
}
