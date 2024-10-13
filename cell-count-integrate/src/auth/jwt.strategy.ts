import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../cellcountintegrate/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    "jwt" // nome da estratégia (usada no guard), por padrão é jwt, porém para legibilidade é bom deixar explícito
) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // como o token é passado na requisição
            secretOrKey: process.env.JWT_SECRET_KEY, // chave secreta para descriptografar o token
        });
    }
    
    // método que é chamado após a descriptografia do token, parametro payload é o conteúdo do token
    async validate(payload: { sub: string, email: string }) {
        
        // buscar o usuário no banco de dados
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        delete user.password;
        return user;
    }
}
