import { Module } from '@nestjs/common'
import { QueriesService } from '@/queries/queries.service'
import { QueriesController } from '@/queries/queries.controller'

@Module({
  controllers: [QueriesController],
  providers: [QueriesService],
})
export class QueriesModule {}
