import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserApplicationModule } from "./user/user-application.module";
import { BusinessTripApplicationModule } from "./business-trip/business-trip-application.module";
import { BannerApplicationModule } from "./banner/banner-application.module";
import { DepartmentApplicationModule } from "./department/department-application.module";
import { PositionApplicationModule } from "./position/position-application.module";
import { SiteSettingApplicationModule } from "./site-setting/site-setting-application.module";

@Module({
  imports: [
    CqrsModule,
    UserApplicationModule,
    BusinessTripApplicationModule,
    BannerApplicationModule,
    DepartmentApplicationModule,
    PositionApplicationModule,
    SiteSettingApplicationModule,
  ],
  exports: [
    CqrsModule,
    UserApplicationModule,
    BusinessTripApplicationModule,
    BannerApplicationModule,
    DepartmentApplicationModule,
    PositionApplicationModule,
    SiteSettingApplicationModule,
  ],
})
export class ApplicationModule {}
