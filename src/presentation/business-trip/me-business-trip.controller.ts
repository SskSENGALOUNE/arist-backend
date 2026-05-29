import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { CreateBusinessTripDto } from './dto/create-business-trip.dto';
import { UpdateBusinessTripDto } from './dto/update-business-trip.dto';
import { BusinessTripResponseDto } from './dto/business-trip-response.dto';
import {
  CreateBusinessTripCommand,
  UpdateBusinessTripCommand,
  DeleteBusinessTripCommand,
} from '../../application/business-trip/commands';
import {
  GetBusinessTripByIdQuery,
  GetMyBusinessTripsQuery,
} from '../../application/business-trip/queries';

@ApiTags('me-business-trips')
@ApiBearerAuth()
@Controller({ path: 'me/business-trips', version: '1' })
export class MeBusinessTripController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a business trip (employee logs their own trip)' })
  @ApiResponse({ status: 201, description: 'Trip created.' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBusinessTripDto,
  ) {
    return this.commandBus.execute(
      new CreateBusinessTripCommand(
        dto.title,
        dto.tripType,
        dto.destinationProvince ?? null,
        dto.destinationCountry ?? null,
        dto.departureDate,
        dto.returnDate,
        user.id,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'List my business trips (paginated)' })
  async findMine(
    @CurrentUser() user: AuthenticatedUser,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<BusinessTripResponseDto>> {
    const result = await this.queryBus.execute(
      new GetMyBusinessTripsQuery(
        user.id,
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
  @ApiOperation({ summary: 'Get one of my business trips by ID' })
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessTripResponseDto> {
    const trip = await this.queryBus.execute(new GetBusinessTripByIdQuery(id));
    if (trip.userId !== user.id) {
      throw new ForbiddenException('You can only view your own business trip');
    }
    return trip;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one of my business trips' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBusinessTripDto,
  ) {
    return this.commandBus.execute(
      new UpdateBusinessTripCommand(
        id,
        user.id,
        dto.title,
        dto.tripType,
        dto.destinationProvince,
        dto.destinationCountry,
        dto.departureDate,
        dto.returnDate,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one of my business trips' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.commandBus.execute(new DeleteBusinessTripCommand(id, user.id));
  }
}
