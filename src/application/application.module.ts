import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserApplicationModule } from "./user/user-application.module";
import { BusinessTripApplicationModule } from "./business-trip/business-trip-application.module";
import { BannerApplicationModule } from "./banner/banner-application.module";

@Module({
  imports: [
    CqrsModule,
    UserApplicationModule,
    BusinessTripApplicationModule,
    BannerApplicationModule,
  ],
  exports: [
    CqrsModule,
    UserApplicationModule,
    BusinessTripApplicationModule,
    BannerApplicationModule,
  ],
})
export class ApplicationModule {}
