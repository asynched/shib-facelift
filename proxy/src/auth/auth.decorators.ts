import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const AuthToken = createParamDecorator(
  (_data: unknown[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>()

    return req.headers.authorization?.replace('Bearer ', '')
  },
)
