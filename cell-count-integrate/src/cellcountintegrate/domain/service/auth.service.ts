import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "../../adapter/dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { env } from "../../../configs";

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    public async signup(dto: AuthDto) {
        //Gerar a hash da senha
        const hash = await argon.hash(dto.password);

        //Bloco try/catch para tratar email já registrado de maneira mais legível
        try {

            //Salvar o novo usuário no banco de dados
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                },
            })

            //Retornar um token de autenticação
            return this.signToken(user.id, user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException("Email já cadastrado");
                }
            }
            throw error;
        }
    }

    public async signin(dto: AuthDto) {

        //Encontrar o email do usuário no banco de dados
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        //Se o email não existir, retornar um erro
        if (!user) {
            throw new ForbiddenException("Email não cadastrado");
        }

        //Se o email existir, comparar a senha com a hash no banco de dados
        const pwMathces = await argon.verify(
            user.password,
            dto.password
        );

        //Se a senha não bater, retornar um erro
        if (!pwMathces) {
            throw new ForbiddenException("Senha incorreta");
        }

        //Se a senha bater, retornar um token de autenticação
        return this.signToken(user.id, user.email);
    }

    public async signToken(
        userID: string,
        email: string
    ): Promise<{ access_token: string }> {
        
        //Payload do token
        const payload = {
            sub: userID,
            email
        };

        //Assinar o token com o payload e a chave secreta
        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: env.JWT_EXPIRES_IN,
                secret: env.JWT_SECRET_KEY,
            },
        );

        return {
            access_token: token,
        }
    }
}
