import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteBannerCommand } from './delete-banner.command';
import type { IBannerRepository } from '../../../domain/banner/banner.repository';
import { BANNER_REPOSITORY } from '../../../domain/banner/banner.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(DeleteBannerCommand)
export class DeleteBannerHandler
  implements ICommandHandler<DeleteBannerCommand>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly repository: IBannerRepository,
  ) {}

  async execute(command: DeleteBannerCommand) {
    const existing = await this.repository.findById(command.id);

    if (!existing) {
      throw NotFoundDomainException.forResource('Banner', command.id);
    }

    await this.repository.delete(command.id);
  }
}
