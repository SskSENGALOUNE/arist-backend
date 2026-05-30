import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../../application/application.module';
import { AdminDepartmentController } from './admin-department.controller';
import { DepartmentController } from './department.controller';
import {
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
} from '../../application/department/commands';
import { GetAllDepartmentsHandler, GetDepartmentByIdHandler } from '../../application/department/queries';

const CommandHandlers = [CreateDepartmentHandler, UpdateDepartmentHandler, DeleteDepartmentHandler];
const QueryHandlers = [GetAllDepartmentsHandler, GetDepartmentByIdHandler];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AdminDepartmentController, DepartmentController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class DepartmentModule {}
