import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllPositionsQuery, GetPositionByIdQuery } from '../../application/position/queries';

@ApiTags('positions')
@ApiBearerAuth()
@Controller({ path: 'positions', version: '1' })
export class PositionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'List active positions' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  findAll(@Query('activeOnly') activeOnly?: string) {
    return this.queryBus.execute(new GetAllPositionsQuery(activeOnly !== 'false'));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get position by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetPositionByIdQuery(id));
  }
}
