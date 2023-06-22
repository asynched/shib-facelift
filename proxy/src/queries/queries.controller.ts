import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { QueriesService } from '@/queries/queries.service'
import { AuthToken } from '@/auth/auth.decorators'
import { AuthGuard } from '@/auth/auth.guard'

@Controller('queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

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

  @Post('execute')
  @UseGuards(AuthGuard)
  async executeQuery(@AuthToken() token: string, @Body('query') query: string) {
    return await this.queriesService.executeQuery(token, query)
  }
}
