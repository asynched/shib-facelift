import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { QueriesService } from '@/queries/queries.service'
import { AuthToken } from '@/auth/auth.decorators'
import { AuthGuard } from '@/auth/auth.guard'

@Controller('queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Get()
  async getRunningQueries(
    @AuthToken() token: string,
    @Query('ids') data: string,
  ) {
    return await this.queriesService.getRunningQueries(token, data.split(','))
  }

  @Get('results')
  @UseGuards(AuthGuard)
  async getResults(@AuthToken() token: string, @Query('ids') ids: string) {
    return await this.queriesService.getResults(token, ids.split(','))
  }

  @Get('running')
  @UseGuards(AuthGuard)
  async getRunnings() {
    return await this.queriesService.getRunnings()
  }

  @Get('tables')
  @UseGuards(AuthGuard)
  async getTables() {
    return await this.queriesService.getTables()
  }

  @Get('tables/:tableName/columns')
  @UseGuards(AuthGuard)
  async getTableColumns(
    @AuthToken() token: string,
    @Param('tableName') tableName: string,
  ) {
    return await this.queriesService.getTableColumns(tableName)
  }

  @Get('results/:resultId')
  @UseGuards(AuthGuard)
  async getPreview(@Param('resultId') resultId: string) {
    return await this.queriesService.getQueryPreview(resultId)
  }

  @Post('execute')
  @UseGuards(AuthGuard)
  async executeQuery(@AuthToken() token: string, @Body('query') query: string) {
    return await this.queriesService.executeQuery(token, query)
  }
}
