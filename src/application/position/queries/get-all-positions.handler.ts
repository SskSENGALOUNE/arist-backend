import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllPositionsQuery } from './get-all-positions.query';
import { POSITION_REPOSITORY } from '../../../domain/position/position.repository';
import type { IPositionRepository, PositionData } from '../../../domain/position/position.repository';

@QueryHandler(GetAllPositionsQuery)
export class GetAllPositionsHandler
  implements IQueryHandler<GetAllPositionsQuery, PositionData[]>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repo: IPositionRepository,
  ) {}

  execute(query: GetAllPositionsQuery): Promise<PositionData[]> {
    return this.repo.findAll(query.activeOnly);
  }
}
