import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { AuthModule } from '@/auth/auth.module'
import { QueriesModule } from '@/queries/queries.module'
import { HealthModule } from '@/health/health.module'
import { LoggerMiddleware } from '@/middlewares/logger.middleware'

@Module({
  imports: [
    AuthModule,
    QueriesModule,
    HealthModule,
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
