import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPositionByIdQuery } from './get-position-by-id.query';
import { POSITION_REPOSITORY } from '../../../domain/position/position.repository';
import type { IPositionRepository, PositionData } from '../../../domain/position/position.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@QueryHandler(GetPositionByIdQuery)
export class GetPositionByIdHandler
  implements IQueryHandler<GetPositionByIdQuery, PositionData>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly repo: IPositionRepository,
  ) {}

  async execute(query: GetPositionByIdQuery): Promise<PositionData> {
    const pos = await this.repo.findById(query.id);
    if (!pos) throw new NotFoundDomainException('Position not found');
    return pos;
  }
}
