import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdatePositionCommand } from './update-position.command';
import { POSITION_REPOSITORY } from '../../../domain/position/position.repository';
import type { IPositionRepository, PositionData } from '../../../domain/position/position.repository';
import { NotFoundDomainException, ConflictDomainException } from '../../../domain/exceptions';

@CommandHandler(UpdatePositionCommand)
export class UpdatePositionHandler
  implements ICommandHandler<UpdatePositionCommand, PositionData>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repo: IPositionRepository,
  ) {}

  async execute(command: UpdatePositionCommand): Promise<PositionData> {
    const pos = await this.repo.findById(command.id);
    if (!pos) throw new NotFoundDomainException('Position not found');

    if (command.name && command.name !== pos.name) {
      const existing = await this.repo.findByName(command.name);
      if (existing) throw new ConflictDomainException('Position name already exists');
    }

    return this.repo.update(command.id, {
      name: command.name,
      isActive: command.isActive,
      updatedBy: command.updatedBy,
    });
  }
}
