import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({
			datasources: {
				db: {
					url: process.env.DATABASE_URL,
				},
			},
		});
	}

	// Função para limpar o banco de dados
	public cleanDb() {
		// Transaction é usado para garantir que todas as operações sejam executadas com sucesso
		return this.$transaction([
			this.bookmark.deleteMany(),
			this.user.deleteMany(),
		]);
	}
}
