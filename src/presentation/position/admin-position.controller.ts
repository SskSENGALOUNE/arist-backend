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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../domain/user/user.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {
  CreatePositionCommand,
  UpdatePositionCommand,
  DeletePositionCommand,
} from '../../application/position/commands';
import {
  GetAllPositionsQuery,
  GetPositionByIdQuery,
} from '../../application/position/queries';

@ApiTags('admin-positions')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin/positions', version: '1' })
export class AdminPositionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a position' })
  create(@Body() dto: CreatePositionDto, @CurrentUser() user: AuthenticatedUser) {
    return this.commandBus.execute(new CreatePositionCommand(dto.name, user.id));
  }

  @Get()
  @ApiOperation({ summary: 'List all positions' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  findAll(@Query('activeOnly') activeOnly?: string) {
    return this.queryBus.execute(new GetAllPositionsQuery(activeOnly === 'true'));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get position by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetPositionByIdQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a position' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePositionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(
      new UpdatePositionCommand(id, user.id, dto.name, dto.isActive),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a position' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commandBus.execute(new DeletePositionCommand(id));
  }
}
