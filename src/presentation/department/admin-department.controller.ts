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
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  CreateDepartmentCommand,
  UpdateDepartmentCommand,
  DeleteDepartmentCommand,
} from '../../application/department/commands';
import {
  GetAllDepartmentsQuery,
  GetDepartmentByIdQuery,
} from '../../application/department/queries';

@ApiTags('admin-departments')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin/departments', version: '1' })
export class AdminDepartmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a department' })
  create(@Body() dto: CreateDepartmentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.commandBus.execute(new CreateDepartmentCommand(dto.name, user.id));
  }

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  findAll(@Query('activeOnly') activeOnly?: string) {
    return this.queryBus.execute(new GetAllDepartmentsQuery(activeOnly === 'true'));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetDepartmentByIdQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDepartmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(
      new UpdateDepartmentCommand(id, user.id, dto.name, dto.isActive),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a department' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commandBus.execute(new DeleteDepartmentCommand(id));
  }
}
