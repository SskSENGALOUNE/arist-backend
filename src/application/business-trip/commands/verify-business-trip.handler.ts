import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { VerifyBusinessTripCommand } from './verify-business-trip.command';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
} from '../../../domain/business-trip/business-trip.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';
import { TripStatus } from '@prisma/client';

@CommandHandler(VerifyBusinessTripCommand)
export class VerifyBusinessTripHandler
  implements ICommandHandler<VerifyBusinessTripCommand>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(command: VerifyBusinessTripCommand) {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw NotFoundDomainException.forResource('BusinessTrip', command.id);
    }

    if (existing.status === TripStatus.VERIFIED) {
      throw new BadRequestException('Business trip is already verified');
    }

    return this.repository.verify(command.id, command.verifiedById);
  }
}
