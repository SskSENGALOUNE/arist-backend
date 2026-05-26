import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllExTablesQuery } from './get-all-ex-tables.query';
import type { IExTableRepository } from '../../../domain/ex-module/ex-table.repository';
import { EX_TABLE_REPOSITORY } from '../../../domain/ex-module/ex-table.repository';
import type { ExTableData, PaginatedResult } from '../../../domain/ex-module/ex-table.repository';

@QueryHandler(GetAllExTablesQuery)
export class GetAllExTablesHandler
  implements IQueryHandler<GetAllExTablesQuery>
{
  constructor(
    @Inject(EX_TABLE_REPOSITORY)
    private readonly repository: IExTableRepository,
  ) {}

  async execute(query: GetAllExTablesQuery): Promise<PaginatedResult<ExTableData>> {
    return this.repository.findPaginated({
      skip: query.skip,
      take: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }
}
