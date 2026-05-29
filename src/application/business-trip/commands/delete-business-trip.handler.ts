import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DeleteBusinessTripCommand } from './delete-business-trip.command';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
} from '../../../domain/business-trip/business-trip.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';
import { TripStatus } from '@prisma/client';

@CommandHandler(DeleteBusinessTripCommand)
export class DeleteBusinessTripHandler
  implements ICommandHandler<DeleteBusinessTripCommand>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(command: DeleteBusinessTripCommand) {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw NotFoundDomainException.forResource('BusinessTrip', command.id);
    }

    if (existing.userId !== command.userId) {
      throw new ForbiddenException('You can only delete your own business trip');
    }

    if (existing.status === TripStatus.VERIFIED) {
      throw new BadRequestException('Cannot delete a verified business trip');
    }

    await this.repository.delete(command.id);
  }
}
