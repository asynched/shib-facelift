import axios from 'axios'
import { load } from 'cheerio'
import { Agent } from 'https'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { type Cache } from 'cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GetRunningQueriesDto } from '@/queries/queries.dto'
import { unique } from '@/utils/arrays'

type RunningsResponse = [string, string][]
type ExecuteQueryResponse = {
  dbname: string
  engine: string
  queryid: string
  querystring: string
}

type TableDescriptionResponse = [
  {
    title: string
  },
]

type ResultsResponse = {
  bytes: number | null
  completed_at: string
  error: string
  executed_at: string
  lines: number | null
  resultid: string
  state: 'done' | 'waiting' | 'error'
  schema: { type: string; name: string }[]
}

type RunningQueriesResponse = {
  queries: {
    queryid: string
    dbname: string
    engine: string
    querystring: string
    results: {
      resultid: string
      executed_at: string
    }[]
  }[]
}

type RunningQuery = {
  id: string
  db: string
  engine: string
  query: string
  results: {
    id: string
    executedAt: Date
  }[]
}

const ONE_DAY = 60 * 60 * 24 * 1000

@Injectable()
export class QueriesService {
  private readonly httpClient = axios.create({
    baseURL: process.env.NEST_ENV_SHIB_API_URL,
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  })

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getRunnings() {
    const { data } = await this.httpClient.get<RunningsResponse>('/runnings')

    return data.map(([id, runtime]) => ({
      id,
      runtime,
    }))
  }

  async executeQuery(token: string, query: string) {
    const form = new URLSearchParams()

    form.append('engineLabel', 'default')
    form.append('dbname', 'default')
    form.append('querystring', query)
    form.append('authInfo', token)

    const { data } = await this.httpClient.post<ExecuteQueryResponse>(
      '/execute',
      form.toString(),
      {
        headers: {
          'X-Shib-Authinfo': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 3000,
      },
    )

    return data.queryid
  }

  async getTables() {
    const cachedTables = await this.cacheManager.get<string[]>('tables')

    if (cachedTables) {
      return cachedTables
    }

    const { data } = await this.httpClient.get<string[]>('/tables', {
      params: {
        engine: 'default',
        db: 'default',
      },
    })

    await this.cacheManager.set('tables', data, ONE_DAY)

    return data
  }

  async getTableColumns(tableName: string) {
    const cachedColumns = await this.cacheManager.get<
      { name: string; type: string }[]
    >(`tables/${tableName}`)

    if (cachedColumns) {
      return cachedColumns
    }

    const { data } = await this.httpClient.get<TableDescriptionResponse>(
      '/describe',
      {
        params: {
          engine: 'default',
          db: 'default',
          key: tableName,
          _: Date.now(),
        },
      },
    )

    if (!data[0]) {
      throw new NotFoundException(`Table ${tableName} not found`)
    }

    const html = data[0]
    const parser = load(html.title)
    const columns = Array.from(
      parser('tr').map((_, el) => ({
        name: parser(el).find('td').eq(0).text(),
        type: parser(el).find('td').eq(1).text(),
      })),
    )

    const filteredColumns = columns.filter(
      (column) => Boolean(column.name) && Boolean(column.type),
    )

    await this.cacheManager.set(`tables/${tableName}`, filteredColumns, ONE_DAY)

    return filteredColumns
  }

  async getRunningQueries(token: string, dto: GetRunningQueriesDto) {
    const params = new URLSearchParams()

    dto.forEach((id) => params.append('ids', id))

    const { data } = await this.httpClient.post<RunningQueriesResponse>(
      '/queries',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Shib-Authinfo': token,
        },
      },
    )

    const parsedQueries = data.queries.map((query) => ({
      id: query.queryid,
      db: query.dbname,
      engine: query.engine,
      query: query.querystring,
      results: query.results.map((result) => ({
        id: result.resultid,
        executedAt: new Date(result.executed_at),
      })),
    }))

    const cachedQueries = await this.cacheManager.get<RunningQuery[]>(
      `queries/${token}/running`,
    )

    const queries = unique(
      parsedQueries.concat(cachedQueries || []),
      (q) => q.id,
    ).sort(
      (a, b) =>
        b.results[0].executedAt.getTime() - a.results[0].executedAt.getTime(),
    )

    await this.cacheManager.set(`queries/${token}/running`, queries, ONE_DAY)

    return queries
  }

  async getQueryPreview(resultId: string) {
    const cachedResult = await this.cacheManager.get<string>(
      `results/${resultId}`,
    )

    if (cachedResult) {
      return cachedResult
    }

    const { data } = await this.httpClient.get<string>(
      `/show/head/${resultId}`,
      {
        responseType: 'document',
      },
    )

    if (data) {
      await this.cacheManager.set(`results/${resultId}`, data, ONE_DAY)
    }

    return data
  }

  async getResults(token: string, ids: string[]) {
    const params = new URLSearchParams()

    ids.forEach((id) => params.append('ids', id))

    const { data } = await this.httpClient.post<ResultsResponse[]>(
      '/results',
      params.toString(),
      {
        headers: {
          'X-Shib-Authinfo': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    return data.map((result) => ({
      id: result.resultid,
      lines: result.lines,
      bytes: result.bytes,
      executedAt: new Date(result.executed_at),
      state: result.state,
      error: result.error,
    }))
  }
}
