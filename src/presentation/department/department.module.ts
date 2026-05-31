import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../../application/application.module';
import { AdminDepartmentController } from './admin-department.controller';
import { DepartmentController } from './department.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AdminDepartmentController, DepartmentController],
})
export class DepartmentModule {}
