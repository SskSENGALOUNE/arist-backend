import { Module } from '@nestjs/common';
import { ExTableModule } from './ex-module/ex-table.module';
import { ApplicationModule } from '../application/application.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CqrsModule,
    ApplicationModule,
    AuthModule,
    UserModule,
    ExTableModule,
    TransactionModule,
  ],
  exports: [ExTableModule, AuthModule, UserModule],
})
export class PresentationModule {}
