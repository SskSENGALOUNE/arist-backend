import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MeBusinessTripController } from './me-business-trip.controller';
import { AdminBusinessTripController } from './admin-business-trip.controller';
import { BusinessTripApplicationModule } from '../../application/business-trip/business-trip-application.module';

@Module({
  imports: [CqrsModule, BusinessTripApplicationModule],
  controllers: [MeBusinessTripController, AdminBusinessTripController],
})
export class BusinessTripModule {}
