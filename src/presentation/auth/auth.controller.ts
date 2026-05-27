import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Request } from 'express';
import {
  ChangePasswordCommand,
  CompleteInitialPasswordCommand,
  LoginCommand,
  LogoutCommand,
  RefreshTokenCommand,
} from '../../application/auth/commands';
import type {
  LoginResult,
  RefreshTokenResult,
} from '../../application/auth/commands';
import { GetUserByIdQuery } from '../../application/user/queries';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CompleteInitialPasswordDto } from './dto/complete-initial-password.dto';
import { LogoutDto } from './dto/logout.dto';
import {
  AuthUserResponseDto,
  LoginResponseDto,
  RefreshResponseDto,
} from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const result = await this.commandBus.execute<LoginCommand, LoginResult>(
      new LoginCommand(
        dto.username,
        dto.password,
        req.headers['user-agent'],
        req.ip,
      ),
    );
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a refresh token for a new access token' })
  @ApiResponse({ status: 200, type: RefreshResponseDto })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<RefreshResponseDto> {
    return this.commandBus.execute<RefreshTokenCommand, RefreshTokenResult>(
      new RefreshTokenCommand(
        dto.refreshToken,
        req.headers['user-agent'],
        req.ip,
      ),
    );
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout (revoke refresh token)' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogoutDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new LogoutCommand(user.id, dto.refreshToken, dto.allDevices ?? false),
    );
  }

  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Change own password' })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new ChangePasswordCommand(user.id, dto.currentPassword, dto.newPassword),
    );
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get currently authenticated user' })
  @ApiResponse({ status: 200, type: AuthUserResponseDto })
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.queryBus.execute(new GetUserByIdQuery(user.id));
  }

  @ApiBearerAuth()
  @Post('complete-initial-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Set a new password on first login (only when mustChangePassword is true)',
  })
  async completeInitialPassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CompleteInitialPasswordDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new CompleteInitialPasswordCommand(user.id, dto.newPassword),
    );
  }
}
