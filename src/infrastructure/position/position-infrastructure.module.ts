import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PositionRepositoryImpl } from '../prisma/repositories/position.repository.impl';
import { POSITION_REPOSITORY } from '../../domain/position/position.repository';

@Module({
  imports: [PrismaModule],
  providers: [{ provide: POSITION_REPOSITORY, useClass: PositionRepositoryImpl }],
  exports: [POSITION_REPOSITORY],
})
export class PositionInfrastructureModule {}
