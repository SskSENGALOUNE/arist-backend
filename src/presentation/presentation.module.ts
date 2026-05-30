import { Module } from "@nestjs/common";
import { ExTableModule } from "./ex-module/ex-table.module";
import { ApplicationModule } from "../application/application.module";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BusinessTripModule } from "./business-trip/business-trip.module";
import { BannerModule } from "./banner/banner.module";

@Module({
  imports: [
    CqrsModule,
    ApplicationModule,
    AuthModule,
    UserModule,
    ExTableModule,
    BusinessTripModule,
    BannerModule,
  ],
  exports: [
    ExTableModule,
    AuthModule,
    UserModule,
    BusinessTripModule,
    BannerModule,
  ],
})
export class PresentationModule {}
