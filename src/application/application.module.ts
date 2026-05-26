import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionApplicationModule } from './transaction/transaction-application.module';
import { UserApplicationModule } from './user/user-application.module';

@Module({
  imports: [CqrsModule, TransactionApplicationModule, UserApplicationModule],
  exports: [CqrsModule, TransactionApplicationModule, UserApplicationModule],
})
export class ApplicationModule {}
