import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../domain/user/user.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { BusinessTripResponseDto } from './dto/business-trip-response.dto';
import { RejectBusinessTripDto } from './dto/reject-business-trip.dto';
import {
  VerifyBusinessTripCommand,
  RejectBusinessTripCommand,
} from '../../application/business-trip/commands';
import {
  GetBusinessTripByIdQuery,
  GetAllBusinessTripsQuery,
} from '../../application/business-trip/queries';

@ApiTags('admin-business-trips')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin/business-trips', version: '1' })
export class AdminBusinessTripController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all business trips (paginated)' })
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
  @ApiOperation({ summary: 'Get a business trip by ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessTripResponseDto> {
    return this.queryBus.execute(new GetBusinessTripByIdQuery(id));
  }

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify a business trip (admin marks as correct)' })
  @ApiResponse({ status: 200, description: 'Trip verified.' })
  async verify(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessTripResponseDto> {
    return this.commandBus.execute(
      new VerifyBusinessTripCommand(id, admin.id),
    );
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a business trip with reason' })
  @ApiResponse({ status: 200, description: 'Trip rejected.' })
  async reject(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectBusinessTripDto,
  ): Promise<BusinessTripResponseDto> {
    return this.commandBus.execute(
      new RejectBusinessTripCommand(id, admin.id, dto.rejectionReason),
    );
  }
}
