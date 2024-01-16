import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './public'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // pega o contexto (decorators)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      // verifica se tem o decorator isPublic.
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true // Se tem o isPublic, então pode acessar a rota
    }

    return super.canActivate(context) // se não tem o isPublic, vai para o AuthGuard (classe pai) e verifica se existe um token para liberar a rota
  }
}
