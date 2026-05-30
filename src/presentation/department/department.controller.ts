import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetAllDepartmentsQuery,
  GetDepartmentByIdQuery,
} from '../../application/department/queries';

@ApiTags('departments')
@ApiBearerAuth()
@Controller({ path: 'departments', version: '1' })
export class DepartmentController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'List active departments' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  findAll(@Query('activeOnly') activeOnly?: string) {
    return this.queryBus.execute(new GetAllDepartmentsQuery(activeOnly !== 'false'));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetDepartmentByIdQuery(id));
  }
}
