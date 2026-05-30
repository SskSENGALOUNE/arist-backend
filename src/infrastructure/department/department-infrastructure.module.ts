import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DepartmentRepositoryImpl } from '../prisma/repositories/department.repository.impl';
import { DEPARTMENT_REPOSITORY } from '../../domain/department/department.repository';

@Module({
  imports: [PrismaModule],
  providers: [{ provide: DEPARTMENT_REPOSITORY, useClass: DepartmentRepositoryImpl }],
  exports: [DEPARTMENT_REPOSITORY],
})
export class DepartmentInfrastructureModule {}
