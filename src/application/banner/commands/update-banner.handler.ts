import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateBannerCommand } from './update-banner.command';
import type { IBannerRepository } from '../../../domain/banner/banner.repository';
import { BANNER_REPOSITORY } from '../../../domain/banner/banner.repository';
import { Banner } from '../../../domain/banner/banner.entity';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(UpdateBannerCommand)
export class UpdateBannerHandler
  implements ICommandHandler<UpdateBannerCommand>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly repository: IBannerRepository,
  ) {}

  async execute(command: UpdateBannerCommand) {
    const existing = await this.repository.findById(command.id);

    if (!existing) {
      throw NotFoundDomainException.forResource('Banner', command.id);
    }

    const banner = Banner.reconstitute(
      existing.id,
      existing.title,
      existing.subtitle,
      existing.imageUrl,
      existing.isActive,
      existing.sortOrder,
      existing.createdAt,
      existing.createdBy,
      existing.updatedAt,
      existing.updatedBy,
    );

    const updateData = banner.update(
      {
        title: command.title,
        subtitle: command.subtitle,
        imageUrl: command.imageUrl,
        isActive: command.isActive,
        sortOrder: command.sortOrder,
      },
      command.updatedBy,
    );

    return this.repository.update(command.id, updateData);
  }
}
