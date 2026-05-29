import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UpdateBusinessTripCommand } from './update-business-trip.command';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
} from '../../../domain/business-trip/business-trip.repository';
import { BusinessTrip } from '../../../domain/business-trip/business-trip.entity';
import { NotFoundDomainException } from '../../../domain/exceptions';
import { TripStatus, TripType } from '@prisma/client';

@CommandHandler(UpdateBusinessTripCommand)
export class UpdateBusinessTripHandler
  implements ICommandHandler<UpdateBusinessTripCommand>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(command: UpdateBusinessTripCommand) {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw NotFoundDomainException.forResource('BusinessTrip', command.id);
    }

    if (existing.userId !== command.userId) {
      throw new ForbiddenException('You can only update your own business trip');
    }

    if (existing.status === TripStatus.VERIFIED) {
      throw new BadRequestException('Cannot update a verified business trip');
    }

    const trip = BusinessTrip.reconstitute(
      existing.id,
      existing.title,
      existing.tripType,
      existing.destinationProvince,
      existing.destinationCountry,
      existing.departureDate,
      existing.returnDate,
      existing.status,
      existing.submittedAt,
      existing.verifiedAt,
      existing.verifiedById,
      existing.rejectionReason,
      existing.userId,
      existing.createdAt,
      existing.updatedAt,
    );

    const patch = trip.update({
      title: command.title,
      tripType: command.tripType,
      destinationProvince: command.destinationProvince,
      destinationCountry: command.destinationCountry,
      departureDate: command.departureDate,
      returnDate: command.returnDate,
    });

    const finalTripType = patch.tripType ?? existing.tripType;
    const finalProvince =
      patch.destinationProvince !== undefined
        ? patch.destinationProvince
        : existing.destinationProvince;
    const finalCountry =
      patch.destinationCountry !== undefined
        ? patch.destinationCountry
        : existing.destinationCountry;

    if (finalTripType === TripType.DOMESTIC) {
      if (!finalProvince) {
        throw new BadRequestException(
          'destinationProvince is required when tripType is DOMESTIC',
        );
      }
      if (finalCountry) {
        throw new BadRequestException(
          'destinationCountry must be null when tripType is DOMESTIC',
        );
      }
    } else {
      if (!finalCountry) {
        throw new BadRequestException(
          'destinationCountry is required when tripType is INTERNATIONAL',
        );
      }
      if (finalProvince) {
        throw new BadRequestException(
          'destinationProvince must be null when tripType is INTERNATIONAL',
        );
      }
    }

    const finalDeparture = patch.departureDate ?? existing.departureDate;
    const finalReturn = patch.returnDate ?? existing.returnDate;
    if (finalReturn < finalDeparture) {
      throw new BadRequestException(
        'returnDate must be on or after departureDate',
      );
    }

    return this.repository.update(command.id, patch);
  }
}
