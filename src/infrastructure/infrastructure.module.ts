import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";

import { ExModuleInfrastructureModule } from "./ex-module/ex-module-infrastructure.module";
import { UserInfrastructureModule } from "./user/user-infrastructure.module";

@Module({
  imports: [
    PrismaModule,
    // KafkaModule,
    ExModuleInfrastructureModule,
    UserInfrastructureModule,
  ],
  exports: [
    PrismaModule,
    ExModuleInfrastructureModule,
    UserInfrastructureModule,
  ],
})
export class InfrastructureModule {}
