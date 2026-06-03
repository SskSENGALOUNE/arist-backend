import {
  Body,
  Controller,
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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileCommand } from '../../application/user/commands';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SupabaseStorageService } from '../../infrastructure/supabase/supabase-storage.service';
import { createMemoryUploadOptions } from '../common/upload/memory-upload.config';

@ApiTags('me')
@ApiBearerAuth()
@Controller({ path: 'me', version: '1' })
export class MeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly storageService: SupabaseStorageService,
  ) {}

  @Patch('profile')
  @ApiOperation({ summary: 'Update own HR profile' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.commandBus.execute(
      new UpdateProfileCommand(user.id, {
        ...dto,
        passportExpiry: dto.passportExpiry ? new Date(dto.passportExpiry) : undefined,
      }),
    );
  }

  @Post('photo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload profile photo to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { photo: { type: 'string', format: 'binary' } },
      required: ['photo'],
    },
  })
  @UseInterceptors(FileInterceptor('photo', createMemoryUploadOptions()))
  async uploadPhoto(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoUrl = await this.storageService.upload('profiles', file);
    await this.commandBus.execute(
      new UpdateProfileCommand(user.id, { photoUrl }),
    );
    return { photoUrl };
  }
}
