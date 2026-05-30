import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";

import { ExModuleInfrastructureModule } from "./ex-module/ex-module-infrastructure.module";
import { UserInfrastructureModule } from "./user/user-infrastructure.module";
import { BusinessTripInfrastructureModule } from "./business-trip/business-trip-infrastructure.module";
import { BannerInfrastructureModule } from "./banner/banner-infrastructure.module";

@Module({
  imports: [
    PrismaModule,
    // KafkaModule,
    ExModuleInfrastructureModule,
    UserInfrastructureModule,
    BusinessTripInfrastructureModule,
    BannerInfrastructureModule,
  ],
  exports: [
    PrismaModule,
    ExModuleInfrastructureModule,
    UserInfrastructureModule,
    BusinessTripInfrastructureModule,
    BannerInfrastructureModule,
  ],
})
export class InfrastructureModule {}
