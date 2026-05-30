import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDepartmentByIdQuery } from './get-department-by-id.query';
import { DEPARTMENT_REPOSITORY } from '../../../domain/department/department.repository';
import type { IDepartmentRepository, DepartmentData } from '../../../domain/department/department.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@QueryHandler(GetDepartmentByIdQuery)
export class GetDepartmentByIdHandler
  implements IQueryHandler<GetDepartmentByIdQuery, DepartmentData>
{
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly repo: IDepartmentRepository,
  ) {}

  async execute(query: GetDepartmentByIdQuery): Promise<DepartmentData> {
    const dept = await this.repo.findById(query.id);
    if (!dept) throw new NotFoundDomainException('Department not found');
    return dept;
  }
}
