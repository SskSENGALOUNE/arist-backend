import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../../application/application.module';
import { AdminPositionController } from './admin-position.controller';
import { PositionController } from './position.controller';
import {
  CreatePositionHandler,
  UpdatePositionHandler,
  DeletePositionHandler,
} from '../../application/position/commands';
import { GetAllPositionsHandler, GetPositionByIdHandler } from '../../application/position/queries';

const CommandHandlers = [CreatePositionHandler, UpdatePositionHandler, DeletePositionHandler];
const QueryHandlers = [GetAllPositionsHandler, GetPositionByIdHandler];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AdminPositionController, PositionController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class PositionModule {}
