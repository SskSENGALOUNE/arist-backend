import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import request from 'supertest';
import { App } from 'supertest/types';
import { ExTableController } from '../src/presentation/ex-module/ex-table.controller';
import { GlobalExceptionFilter } from '../src/presentation/filters/global-exception.filter';
import { BaseResponseInterceptor } from '../src/presentation/interceptors/base-response.interceptor';
import {
  EX_TABLE_REPOSITORY,
  ExTableData,
  IExTableRepository,
  PaginatedResult,
  PaginationParams,
} from '../src/domain/ex-module/ex-table.repository';
import { GetExTableByIdHandler } from '../src/application/ex-module/queries/get-ex-table-by-id.handler';
import { GetAllExTablesHandler } from '../src/application/ex-module/queries/get-all-ex-tables.handler';
import { CreateExTableHandler } from '../src/application/ex-module/commands/create-ex-table.handler';
import { UpdateExTableHandler } from '../src/application/ex-module/commands/update-ex-table.handler';
import { DeleteExTableHandler } from '../src/application/ex-module/commands/delete-ex-table.handler';

class InMemoryExTableRepository implements IExTableRepository {
  private store = new Map<string, ExTableData>();

  reset(seed: ExTableData[] = []) {
    this.store.clear();
    seed.forEach((row) => this.store.set(row.id, row));
  }

  async create(data: {
    name: string;
    createdBy: string;
    updatedBy: string;
  }): Promise<ExTableData> {
    const row: ExTableData = {
      id: `id-${this.store.size + 1}`,
      name: data.name,
      createdAt: new Date(),
      createdBy: data.createdBy,
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    };
    this.store.set(row.id, row);
    return row;
  }

  async findById(id: string): Promise<ExTableData | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<ExTableData[]> {
    return Array.from(this.store.values());
  }

  async findPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<ExTableData>> {
    const all = Array.from(this.store.values());
    return {
      items: all.slice(params.skip, params.skip + params.take),
      total: all.length,
    };
  }

  async update(
    id: string,
    data: { name?: string; updatedBy: string },
  ): Promise<ExTableData> {
    const existing = this.store.get(id)!;
    const updated: ExTableData = {
      ...existing,
      name: data.name ?? existing.name,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}

describe('ExTableController (e2e)', () => {
  let app: INestApplication<App>;
  let repo: InMemoryExTableRepository;

  beforeAll(async () => {
    repo = new InMemoryExTableRepository();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [ExTableController],
      providers: [
        GetExTableByIdHandler,
        GetAllExTablesHandler,
        CreateExTableHandler,
        UpdateExTableHandler,
        DeleteExTableHandler,
        { provide: EX_TABLE_REPOSITORY, useValue: repo },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(new BaseResponseInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  beforeEach(() => {
    repo.reset([
      {
        id: 'seed-1',
        name: 'Seed',
        createdAt: new Date('2026-01-01'),
        createdBy: 'system',
        updatedAt: new Date('2026-01-01'),
        updatedBy: 'system',
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/ex-tables returns paginated payload wrapped in BaseResponse', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/ex-tables')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.pagination).toMatchObject({
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('GET /api/v1/ex-tables/:id returns 404 with structured error when missing', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/ex-tables/does-not-exist')
      .expect(404);

    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'NOT_FOUND' },
    });
    expect(res.body.meta).toHaveProperty('traceId');
    expect(res.body.meta).toHaveProperty('timestamp');
  });

  it('POST /api/v1/ex-tables validates body (whitelist)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/ex-tables')
      .send({ unexpected: 'field' })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});
