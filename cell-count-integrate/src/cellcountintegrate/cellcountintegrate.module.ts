import { Module } from "@nestjs/common";
import { AuthController } from "./adapter/controller/auth.controller";
import { AuthService } from "./domain/service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { DI_ENVIRONMENT, env } from "../configs";
import { JwtStrategy } from "../auth";

@Module({
	imports: [JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, {provide: DI_ENVIRONMENT, useValue: env}, JwtStrategy],
})
export class CellCountIntegrateModule {}