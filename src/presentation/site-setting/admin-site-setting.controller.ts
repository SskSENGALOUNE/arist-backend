import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createMemoryUploadOptions } from '../common/upload/memory-upload.config';
import { SupabaseStorageService } from '../../infrastructure/supabase/supabase-storage.service';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../domain/user/user.entity';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';
import { SiteSettingResponseDto } from './dto/site-setting-response.dto';
import { UpdateSiteSettingCommand } from '../../application/site-setting/commands';
import { GetSiteSettingQuery } from '../../application/site-setting/queries';

@ApiTags('admin-site-settings')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin/site-settings', version: '1' })
export class AdminSiteSettingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly storageService: SupabaseStorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get the current site settings' })
  async get(): Promise<SiteSettingResponseDto> {
    return this.queryBus.execute(new GetSiteSettingQuery());
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload a logo image to Supabase Storage, returns its public URL',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded.' })
  @UseInterceptors(FileInterceptor('file', createMemoryUploadOptions()))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded. Use field name "file".');
    }
    const url = await this.storageService.upload('site', file);
    return { url };
  }

  @Patch()
  @ApiOperation({ summary: 'Update the site settings' })
  async update(
    @Body() dto: UpdateSiteSettingDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SiteSettingResponseDto> {
    return this.commandBus.execute(
      new UpdateSiteSettingCommand(dto, user.id),
    );
  }
}
