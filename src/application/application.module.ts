import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserApplicationModule } from "./user/user-application.module";
import { BusinessTripApplicationModule } from "./business-trip/business-trip-application.module";

@Module({
  imports: [CqrsModule, UserApplicationModule, BusinessTripApplicationModule],
  exports: [CqrsModule, UserApplicationModule, BusinessTripApplicationModule],
})
export class ApplicationModule {}
