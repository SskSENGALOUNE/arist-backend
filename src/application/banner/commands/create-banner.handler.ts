import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateBannerCommand } from './create-banner.command';
import type { IBannerRepository } from '../../../domain/banner/banner.repository';
import { BANNER_REPOSITORY } from '../../../domain/banner/banner.repository';
import { Banner } from '../../../domain/banner/banner.entity';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateBannerCommand)
export class CreateBannerHandler
  implements ICommandHandler<CreateBannerCommand>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly repository: IBannerRepository,
  ) {}

  async execute(command: CreateBannerCommand): Promise<BaseCommandResult> {
    const banner = Banner.create(
      {
        title: command.title,
        subtitle: command.subtitle,
        imageUrl: command.imageUrl,
        isActive: command.isActive,
        sortOrder: command.sortOrder,
      },
      command.createdBy,
    );

    const created = await this.repository.create(banner);

    return { id: created.id };
  }
}
