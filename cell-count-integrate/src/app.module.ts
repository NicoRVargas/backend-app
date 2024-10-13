import { Module } from "@nestjs/common";
import { CellCountIntegrateModule } from "./cellcountintegrate/cellcountintegrate.module";
import { PrismaModule } from "./cellcountintegrate/prisma/prisma.module";
import { PrismaService } from "./cellcountintegrate/prisma/prisma.service";
import { UserController } from './cellcountintegrate/adapter/controller/user.controller';

@Module({
	imports: [CellCountIntegrateModule, PrismaModule],
	providers: [PrismaService],
	controllers: [UserController],
})
export class AppModule {}
