import { Body, Controller, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileCommand } from '../../application/user/commands';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('me')
@ApiBearerAuth()
@Controller({ path: 'me', version: '1' })
export class MeController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
