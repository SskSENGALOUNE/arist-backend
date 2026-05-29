import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateBusinessTripCommand } from './create-business-trip.command';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
} from '../../../domain/business-trip/business-trip.repository';
import { BusinessTrip } from '../../../domain/business-trip/business-trip.entity';
import { BaseCommandResult } from '../../common/base-command-result';
import { TripType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateBusinessTripCommand)
export class CreateBusinessTripHandler
  implements ICommandHandler<CreateBusinessTripCommand>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(command: CreateBusinessTripCommand): Promise<BaseCommandResult> {
    this.validateDestination(command);
    this.validateDates(command);

    const tripData = BusinessTrip.create({
      title: command.title,
      tripType: command.tripType,
      destinationProvince: command.destinationProvince,
      destinationCountry: command.destinationCountry,
      departureDate: command.departureDate,
      returnDate: command.returnDate,
      userId: command.userId,
    });

    const created = await this.repository.create(tripData);

    return { id: created.id };
  }

  private validateDestination(command: CreateBusinessTripCommand): void {
    if (command.tripType === TripType.DOMESTIC) {
      if (!command.destinationProvince) {
        throw new BadRequestException(
          'destinationProvince is required when tripType is DOMESTIC',
        );
      }
      if (command.destinationCountry) {
        throw new BadRequestException(
          'destinationCountry must be null when tripType is DOMESTIC',
        );
      }
    } else {
      if (!command.destinationCountry) {
        throw new BadRequestException(
          'destinationCountry is required when tripType is INTERNATIONAL',
        );
      }
      if (command.destinationProvince) {
        throw new BadRequestException(
          'destinationProvince must be null when tripType is INTERNATIONAL',
        );
      }
    }
  }

  private validateDates(command: CreateBusinessTripCommand): void {
    if (command.returnDate < command.departureDate) {
      throw new BadRequestException(
        'returnDate must be on or after departureDate',
      );
    }
  }
}
