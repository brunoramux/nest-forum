import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from 'src/env'
import { z } from 'zod'

const tokenSchema = z.object({
  sub: z.string().uuid(),
  role: z.string(),
})

export type TokenSchema = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true }) // na validação de token precisamos apenas da chave pública

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extrai token do cabeçalho
      secretOrKey: Buffer.from(publicKey, 'base64'), // chave publica de validação
      algorithms: ['RS256'], // algoritmo de hash
    })
  }

  async validate(payload: TokenSchema) {
    if (payload.role !== 'ADMIN') {
      return false
    } // validar se o que esta no Token é um 'sub'
    return tokenSchema.parse(payload)
  }
}
