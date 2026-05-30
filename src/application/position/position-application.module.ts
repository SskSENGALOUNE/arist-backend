import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import {
  CreatePositionHandler,
  UpdatePositionHandler,
  DeletePositionHandler,
} from './commands';
import { GetAllPositionsHandler, GetPositionByIdHandler } from './queries';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreatePositionHandler,
    UpdatePositionHandler,
    DeletePositionHandler,
    GetAllPositionsHandler,
    GetPositionByIdHandler,
  ],
  exports: [
    CreatePositionHandler,
    UpdatePositionHandler,
    DeletePositionHandler,
    GetAllPositionsHandler,
    GetPositionByIdHandler,
  ],
})
export class PositionApplicationModule {}
