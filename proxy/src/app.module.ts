import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthModule } from '@/auth/auth.module'
import { QueriesModule } from '@/queries/queries.module'
import { LoggerMiddleware } from '@/middlewares/logger.middleware'

@Module({
  imports: [AuthModule, QueriesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
