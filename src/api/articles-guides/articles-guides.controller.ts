import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ArticlesGuidesService } from './articles-guides.service';
import { CreateArticleGuideDto } from './dto/create-article-guide.dto';
import { UpdateArticleGuideDto } from './dto/update-article-guide.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../roles/entities/role.enum';

@ApiTags('Articles & Guides')
@Controller('articles-guides')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ArticlesGuidesController {
  constructor(private readonly articlesGuidesService: ArticlesGuidesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER)
  @ApiOperation({ summary: 'Create a new article or guide' })
  create(@Body() createArticleGuideDto: CreateArticleGuideDto, @Req() req: any) {
    return this.articlesGuidesService.create(createArticleGuideDto, req.user.role, req.user.farmerId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER, UserRole.FARMER)
  @ApiOperation({ summary: 'Get all relevant articles and guides' })
  findAll(@Req() req: any) {
    return this.articlesGuidesService.findAll(req.user.role, req.user.farmerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER, UserRole.FARMER)
  @ApiOperation({ summary: 'Get a specific article or guide' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.articlesGuidesService.findOne(id, req.user.role, req.user.farmerId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER)
  @ApiOperation({ summary: 'Update an article or guide' })
  update(
    @Param('id') id: string,
    @Body() updateArticleGuideDto: UpdateArticleGuideDto,
    @Req() req: any,
  ) {
    return this.articlesGuidesService.update(id, updateArticleGuideDto, req.user.role, req.user.farmerId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION_MANAGER)
  @ApiOperation({ summary: 'Delete an article or guide' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.articlesGuidesService.remove(id, req.user.role, req.user.farmerId);
  }
}
