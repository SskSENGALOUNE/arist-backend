import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { RejectBusinessTripCommand } from './reject-business-trip.command';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
} from '../../../domain/business-trip/business-trip.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';
import { TripStatus } from '@prisma/client';

@CommandHandler(RejectBusinessTripCommand)
export class RejectBusinessTripHandler
  implements ICommandHandler<RejectBusinessTripCommand>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(command: RejectBusinessTripCommand) {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw NotFoundDomainException.forResource('BusinessTrip', command.id);
    }

    if (existing.status === TripStatus.VERIFIED) {
      throw new BadRequestException('Cannot reject a verified business trip');
    }

    if (!command.rejectionReason.trim()) {
      throw new BadRequestException('rejectionReason cannot be empty');
    }

    return this.repository.reject(
      command.id,
      command.verifiedById,
      command.rejectionReason,
    );
  }
}
