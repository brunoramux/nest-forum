import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'

const tokenSchema = z.object({
  sub: z.string().uuid(),
})

export type TokenSchema = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY') // na validação de token precisamos apenas da chave pública

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extrai token do cabeçalho
      secretOrKey: Buffer.from(publicKey, 'base64'), // chave publica de validação
      algorithms: ['RS256'], // algoritmo de hash
    })
  }

  async validate(payload: TokenSchema) {
    return tokenSchema.parse(payload)
  }
}
