import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthModule } from '@/auth/auth.module'
import { QueriesModule } from '@/queries/queries.module'
import { LoggerMiddleware } from '@/middlewares/logger.middleware'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    AuthModule,
    QueriesModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
