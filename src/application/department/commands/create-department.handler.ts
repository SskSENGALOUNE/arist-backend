import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateDepartmentCommand } from './create-department.command';
import { DEPARTMENT_REPOSITORY } from '../../../domain/department/department.repository';
import type { IDepartmentRepository } from '../../../domain/department/department.repository';
import { ConflictDomainException } from '../../../domain/exceptions';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateDepartmentCommand)
export class CreateDepartmentHandler
  implements ICommandHandler<CreateDepartmentCommand, BaseCommandResult>
{
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly repo: IDepartmentRepository,
  ) {}

  async execute(command: CreateDepartmentCommand): Promise<BaseCommandResult> {
    const existing = await this.repo.findByName(command.name);
    if (existing) throw new ConflictDomainException('Department name already exists');

    const dept = await this.repo.create({
      name: command.name,
      createdBy: command.createdBy,
      updatedBy: command.createdBy,
    });
    return { id: dept.id };
  }
}
