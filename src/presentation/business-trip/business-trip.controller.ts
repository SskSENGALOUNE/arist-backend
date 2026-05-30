import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { BusinessTripResponseDto } from './dto/business-trip-response.dto';
import {
  GetBusinessTripByIdQuery,
  GetAllBusinessTripsQuery,
} from '../../application/business-trip/queries';

@ApiTags('business-trips')
@ApiBearerAuth()
@Controller({ path: 'business-trips', version: '1' })
export class BusinessTripController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: "List all employees' business trips (read-only, paginated)",
  })
  async findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<BusinessTripResponseDto>> {
    const result = await this.queryBus.execute(
      new GetAllBusinessTripsQuery(
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
  @ApiOperation({ summary: 'Get any business trip by ID (read-only)' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessTripResponseDto> {
    return this.queryBus.execute(new GetBusinessTripByIdQuery(id));
  }
}
