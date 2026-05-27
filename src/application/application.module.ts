import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserApplicationModule } from "./user/user-application.module";

@Module({
  imports: [CqrsModule, UserApplicationModule],
  exports: [CqrsModule, UserApplicationModule],
})
export class ApplicationModule {}
