import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Omit the password hash from all query results by default so it can
    // never leak through API responses. Auth flows that need to verify a
    // password use the dedicated *WithPassword repository methods, which
    // override this with `omit: { password: false }`.
    super({ omit: { user: { password: true } } });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
