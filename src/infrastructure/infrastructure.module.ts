import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './messaging/kafka.module';
import { ExModuleInfrastructureModule } from './ex-module/ex-module-infrastructure.module';
import { TransactionInfrastructureModule } from './transaction/transaction-infrastructure.module';
import { UserInfrastructureModule } from './user/user-infrastructure.module';

@Module({
  imports: [
    PrismaModule,
    // KafkaModule,
    ExModuleInfrastructureModule,
    TransactionInfrastructureModule,
    UserInfrastructureModule,
  ],
  exports: [
    PrismaModule,
    // KafkaModule,
    ExModuleInfrastructureModule,
    TransactionInfrastructureModule,
    UserInfrastructureModule,
  ],
})
export class InfrastructureModule {}
