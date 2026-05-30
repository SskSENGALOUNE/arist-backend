import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreatePositionCommand } from './create-position.command';
import { POSITION_REPOSITORY } from '../../../domain/position/position.repository';
import type { IPositionRepository } from '../../../domain/position/position.repository';
import { ConflictDomainException } from '../../../domain/exceptions';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreatePositionCommand)
export class CreatePositionHandler
  implements ICommandHandler<CreatePositionCommand, BaseCommandResult>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repo: IPositionRepository,
  ) {}

  async execute(command: CreatePositionCommand): Promise<BaseCommandResult> {
    const existing = await this.repo.findByName(command.name);
    if (existing) throw new ConflictDomainException('Position name already exists');

    const pos = await this.repo.create({
      name: command.name,
      createdBy: command.createdBy,
      updatedBy: command.createdBy,
    });
    return { id: pos.id };
  }
}
