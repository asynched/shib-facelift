import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>()
    const auth = req.headers.authorization

    if (!auth) {
      return false
    }

    if (!auth.startsWith('Bearer')) {
      return false
    }

    return true
  }
}
