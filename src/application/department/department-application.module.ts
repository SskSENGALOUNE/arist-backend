import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import {
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
} from './commands';
import { GetAllDepartmentsHandler, GetDepartmentByIdHandler } from './queries';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateDepartmentHandler,
    UpdateDepartmentHandler,
    DeleteDepartmentHandler,
    GetAllDepartmentsHandler,
    GetDepartmentByIdHandler,
  ],
  exports: [
    CreateDepartmentHandler,
    UpdateDepartmentHandler,
    DeleteDepartmentHandler,
    GetAllDepartmentsHandler,
    GetDepartmentByIdHandler,
  ],
})
export class DepartmentApplicationModule {}
