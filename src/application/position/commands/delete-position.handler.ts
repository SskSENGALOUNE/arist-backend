import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeletePositionCommand } from './delete-position.command';
import { POSITION_REPOSITORY } from '../../../domain/position/position.repository';
import type { IPositionRepository } from '../../../domain/position/position.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(DeletePositionCommand)
export class DeletePositionHandler
  implements ICommandHandler<DeletePositionCommand, void>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repo: IPositionRepository,
  ) {}

  async execute(command: DeletePositionCommand): Promise<void> {
    const pos = await this.repo.findById(command.id);
    if (!pos) throw new NotFoundDomainException('Position not found');
    await this.repo.delete(command.id);
  }
}
