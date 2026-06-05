import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BusinessTripInfrastructureModule } from '../../infrastructure/business-trip/business-trip-infrastructure.module';
import {
  CreateBusinessTripHandler,
  UpdateBusinessTripHandler,
  DeleteBusinessTripHandler,
  VerifyBusinessTripHandler,
  RejectBusinessTripHandler,
} from './commands';
import {
  GetBusinessTripByIdHandler,
  GetMyBusinessTripsHandler,
  GetAllBusinessTripsHandler,
  GetBusinessTripStatsHandler,
  GetDestinationStatsHandler,
  GetTopTravelersHandler,
} from './queries';

const CommandHandlers = [
  CreateBusinessTripHandler,
  UpdateBusinessTripHandler,
  DeleteBusinessTripHandler,
  VerifyBusinessTripHandler,
  RejectBusinessTripHandler,
];

const QueryHandlers = [
  GetBusinessTripByIdHandler,
  GetMyBusinessTripsHandler,
  GetAllBusinessTripsHandler,
  GetBusinessTripStatsHandler,
  GetDestinationStatsHandler,
  GetTopTravelersHandler,
];

@Module({
  imports: [CqrsModule, BusinessTripInfrastructureModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule, BusinessTripInfrastructureModule],
})
export class BusinessTripApplicationModule {}
