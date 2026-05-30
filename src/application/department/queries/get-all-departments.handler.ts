import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllDepartmentsQuery } from './get-all-departments.query';
import { DEPARTMENT_REPOSITORY } from '../../../domain/department/department.repository';
import type { IDepartmentRepository, DepartmentData } from '../../../domain/department/department.repository';

@QueryHandler(GetAllDepartmentsQuery)
export class GetAllDepartmentsHandler
  implements IQueryHandler<GetAllDepartmentsQuery, DepartmentData[]>
{
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly repo: IDepartmentRepository,
  ) {}

  execute(query: GetAllDepartmentsQuery): Promise<DepartmentData[]> {
    return this.repo.findAll(query.activeOnly);
  }
}
