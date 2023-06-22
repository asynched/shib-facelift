import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name)

  use(req: Request, res: Response, next: () => void) {
    const start = Date.now()

    res.on('finish', () => {
      const end = Date.now()
      const time = end - start
      const msg = `${req.method} ${req.originalUrl} ${res.statusCode} (${time}ms)`

      if (res.statusCode >= 400) {
        this.logger.error(msg)
      } else if (time > 3_000) {
        this.logger.warn(msg)
      } else {
        this.logger.log(msg)
      }
    })

    next()
  }
}
