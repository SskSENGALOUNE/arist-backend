import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateDepartmentCommand } from './update-department.command';
import { DEPARTMENT_REPOSITORY } from '../../../domain/department/department.repository';
import type { IDepartmentRepository, DepartmentData } from '../../../domain/department/department.repository';
import { NotFoundDomainException, ConflictDomainException } from '../../../domain/exceptions';

@CommandHandler(UpdateDepartmentCommand)
export class UpdateDepartmentHandler
  implements ICommandHandler<UpdateDepartmentCommand, DepartmentData>
{
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly repo: IDepartmentRepository,
  ) {}

  async execute(command: UpdateDepartmentCommand): Promise<DepartmentData> {
    const dept = await this.repo.findById(command.id);
    if (!dept) throw new NotFoundDomainException('Department not found');

    if (command.name && command.name !== dept.name) {
      const existing = await this.repo.findByName(command.name);
      if (existing) throw new ConflictDomainException('Department name already exists');
    }

    return this.repo.update(command.id, {
      name: command.name,
      isActive: command.isActive,
      updatedBy: command.updatedBy,
    });
  }
}
