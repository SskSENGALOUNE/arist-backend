import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerResponseDto } from './dto/banner-response.dto';
import {
  CreateBannerCommand,
  UpdateBannerCommand,
  DeleteBannerCommand,
} from '../../application/banner/commands';
import {
  GetBannerByIdQuery,
  GetAllBannersQuery,
} from '../../application/banner/queries';

@ApiTags('admin-banners')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin/banners', version: '1' })
export class AdminBannerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly storageService: SupabaseStorageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new banner' })
  @ApiResponse({ status: 201, description: 'Banner created.' })
  async create(
    @Body() dto: CreateBannerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(
      new CreateBannerCommand(
        dto.title,
        dto.subtitle ?? null,
        dto.imageUrl ?? null,
        dto.isActive,
        dto.sortOrder,
        user.id,
      ),
    );
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload a banner image to Supabase Storage, returns its public URL',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded.' })
  @UseInterceptors(FileInterceptor('file', createMemoryUploadOptions()))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded. Use field name "file".');
    }
    const url = await this.storageService.upload('banners', file);
    return { url };
  }

  @Get()
  @ApiOperation({ summary: 'List banners (paginated)' })
  async findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<BannerResponseDto>> {
    const result = await this.queryBus.execute(
      new GetAllBannersQuery(
        pagination.page,
        pagination.limit,
        pagination.sortBy,
        pagination.sortOrder,
      ),
    );
    return PaginatedResponse.build(
      result.items,
      result.total,
      pagination.page,
      pagination.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a banner by ID' })
  @ApiParam({ name: 'id', description: 'Banner UUID', type: 'string' })
  @ApiResponse({ status: 404, description: 'Banner not found.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BannerResponseDto> {
    return this.queryBus.execute(new GetBannerByIdQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a banner' })
  @ApiParam({ name: 'id', description: 'Banner UUID', type: 'string' })
  @ApiResponse({ status: 404, description: 'Banner not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBannerDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BannerResponseDto> {
    return this.commandBus.execute(
      new UpdateBannerCommand(
        id,
        dto.title,
        dto.subtitle,
        dto.imageUrl,
        dto.isActive,
        dto.sortOrder,
        user.id,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a banner' })
  @ApiParam({ name: 'id', description: 'Banner UUID', type: 'string' })
  @ApiResponse({ status: 404, description: 'Banner not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.commandBus.execute(new DeleteBannerCommand(id));
  }
}
