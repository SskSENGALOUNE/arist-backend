import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteDepartmentCommand } from './delete-department.command';
import { DEPARTMENT_REPOSITORY } from '../../../domain/department/department.repository';
import type { IDepartmentRepository } from '../../../domain/department/department.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(DeleteDepartmentCommand)
export class DeleteDepartmentHandler
  implements ICommandHandler<DeleteDepartmentCommand, void>
{
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly repo: IDepartmentRepository,
  ) {}

  async execute(command: DeleteDepartmentCommand): Promise<void> {
    const dept = await this.repo.findById(command.id);
    if (!dept) throw new NotFoundDomainException('Department not found');
    await this.repo.delete(command.id);
  }
}
