import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteExTableCommand } from './delete-ex-table.command';
import type { IExTableRepository } from '../../../domain/ex-module/ex-table.repository';
import { EX_TABLE_REPOSITORY } from '../../../domain/ex-module/ex-table.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(DeleteExTableCommand)
export class DeleteExTableHandler
  implements ICommandHandler<DeleteExTableCommand>
{
  constructor(
    @Inject(EX_TABLE_REPOSITORY)
    private readonly repository: IExTableRepository,
  ) {}

  async execute(command: DeleteExTableCommand) {
    const existing = await this.repository.findById(command.id);
    
    if (!existing) {
      throw NotFoundDomainException.forResource('ExTable', command.id);
    }

    await this.repository.delete(command.id);
  }
}
