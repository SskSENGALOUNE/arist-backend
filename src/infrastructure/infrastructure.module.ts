import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { SupabaseModule } from "./supabase/supabase.module";

import { ExModuleInfrastructureModule } from "./ex-module/ex-module-infrastructure.module";
import { UserInfrastructureModule } from "./user/user-infrastructure.module";
import { BusinessTripInfrastructureModule } from "./business-trip/business-trip-infrastructure.module";
import { BannerInfrastructureModule } from "./banner/banner-infrastructure.module";
import { DepartmentInfrastructureModule } from "./department/department-infrastructure.module";
import { PositionInfrastructureModule } from "./position/position-infrastructure.module";
import { SiteSettingInfrastructureModule } from "./site-setting/site-setting-infrastructure.module";

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    // KafkaModule,
    ExModuleInfrastructureModule,
    UserInfrastructureModule,
    BusinessTripInfrastructureModule,
    BannerInfrastructureModule,
    DepartmentInfrastructureModule,
    PositionInfrastructureModule,
    SiteSettingInfrastructureModule,
  ],
  exports: [
    PrismaModule,
    SupabaseModule,
    ExModuleInfrastructureModule,
    UserInfrastructureModule,
    BusinessTripInfrastructureModule,
    BannerInfrastructureModule,
    DepartmentInfrastructureModule,
    PositionInfrastructureModule,
    SiteSettingInfrastructureModule,
  ],
})
export class InfrastructureModule {}
