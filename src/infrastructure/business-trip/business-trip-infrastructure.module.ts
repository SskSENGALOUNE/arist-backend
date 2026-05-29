import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BusinessTripRepositoryImpl } from '../prisma/repositories/business-trip.repository.impl';
import { BUSINESS_TRIP_REPOSITORY } from '../../domain/business-trip/business-trip.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: BUSINESS_TRIP_REPOSITORY,
      useClass: BusinessTripRepositoryImpl,
    },
  ],
  exports: [BUSINESS_TRIP_REPOSITORY],
})
export class BusinessTripInfrastructureModule {}
