import { Test, TestingModule } from '@nestjs/testing';
import { GetExTableByIdHandler } from './get-ex-table-by-id.handler';
import { GetExTableByIdQuery } from './get-ex-table-by-id.query';
import {
  EX_TABLE_REPOSITORY,
  ExTableData,
  IExTableRepository,
} from '../../../domain/ex-module/ex-table.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

describe('GetExTableByIdHandler', () => {
  let handler: GetExTableByIdHandler;
  let repository: jest.Mocked<IExTableRepository>;

  const sample: ExTableData = {
    id: 'id-1',
    name: 'Order #1',
    createdAt: new Date('2026-01-01'),
    createdBy: 'user-1',
    updatedAt: new Date('2026-01-01'),
    updatedBy: 'user-1',
  };

  beforeEach(async () => {
    const repoMock: jest.Mocked<IExTableRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GetExTableByIdHandler,
        { provide: EX_TABLE_REPOSITORY, useValue: repoMock },
      ],
    }).compile();

    handler = moduleRef.get(GetExTableByIdHandler);
    repository = moduleRef.get(EX_TABLE_REPOSITORY);
  });

  it('returns the record when found', async () => {
    repository.findById.mockResolvedValue(sample);

    const result = await handler.execute(new GetExTableByIdQuery('id-1'));

    expect(result).toEqual(sample);
    expect(repository.findById).toHaveBeenCalledWith('id-1');
  });

  it('throws NotFoundDomainException when not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new GetExTableByIdQuery('missing')),
    ).rejects.toBeInstanceOf(NotFoundDomainException);
  });
});
