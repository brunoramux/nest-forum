import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from 'src/env'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService], // usando um serviço no registro de um modulo. Usamos aqui o ConfigService para pegar variaveis ambiente
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        // "true" informa que nos garantimos a verificacao da tipagem onde pode ser undefined
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true }) // pegamos o secret de dentro do env
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true }) // pegamos o secret de dentro do env

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [JwtStrategy], // injeta a strategy que criamos
})
export class AuthModule {}
