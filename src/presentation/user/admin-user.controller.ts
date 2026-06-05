import {
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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../domain/user/user.entity';
import {
  CreateUserCommand,
  DeleteUserCommand,
  ResetPasswordCommand,
  UpdateUserCommand,
} from '../../application/user/commands';
import {
  GetUserByIdQuery,
  ListUsersQuery,
  GetUserStatsQuery,
} from '../../application/user/queries';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserStatsResponseDto } from './dto/user-stats-response.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';

@ApiTags('admin-users')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin/users', version: '1' })
export class AdminUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user (admin)' })
  async create(
    @CurrentUser() admin: AuthenticatedUser,
    @Body() dto: CreateUserDto,
  ) {
    return this.commandBus.execute(
      new CreateUserCommand(
        dto.username,
        dto.email,
        dto.password,
        dto.role,
        dto.firstName,
        dto.lastName,
        admin.id,
        dto.gender,
        dto.departmentId,
        dto.positionId,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'List users (paginated)' })
  async list(
    @Query() q: ListUsersQueryDto,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    const result = await this.queryBus.execute(
      new ListUsersQuery(q.page, q.limit, q.role, q.search, q.sortBy, q.sortOrder),
    );
    return PaginatedResponse.build(result.items, result.total, q.page, q.limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user counts (total / active / inactive / admins)' })
  @ApiResponse({ status: 200, type: UserStatsResponseDto })
  async stats(): Promise<UserStatsResponseDto> {
    return this.queryBus.execute(new GetUserStatsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: AuthenticatedUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, admin.id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }

  @Post(':id/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Reset a user's password (forces change on next login)" })
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    await this.commandBus.execute(new ResetPasswordCommand(id, dto.newPassword));
  }
}
