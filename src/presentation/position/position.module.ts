import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../../application/application.module';
import { AdminPositionController } from './admin-position.controller';
import { PositionController } from './position.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AdminPositionController, PositionController],
})
export class PositionModule {}
