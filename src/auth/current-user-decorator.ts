import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { TokenSchema } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  // const a ser usada para pegar dados do usuario mais facilmente
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as TokenSchema
  },
)
