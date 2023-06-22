import axios from 'axios'
import { load } from 'cheerio'
import { Agent } from 'https'
import { Injectable, NotFoundException } from '@nestjs/common'

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

@Injectable()
export class QueriesService {
  private readonly httpClient = axios.create({
    baseURL: process.env.NEST_ENV_SHIB_API_URL,
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  })

  async getRunnings() {
    const { data } = await this.httpClient.get<RunningsResponse>('/runnings')

    return data.map(([id, runtime]) => ({
      id,
      runtime,
    }))
  }

  async executeQuery(token: string, query: string) {
    const { data } = await this.httpClient.post<ExecuteQueryResponse>(
      '/execute',
      {
        engineLabel: 'default',
        dbname: 'default',
        querystring: query,
        authInfo: token,
      },
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
    const { data } = await this.httpClient.get<string[]>('/tables', {
      params: {
        engine: 'default',
        db: 'default',
      },
    })

    return data
  }

  async getTableColumns(tableName: string) {
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

    return columns.filter(
      (column) => Boolean(column.name) && Boolean(column.type),
    )
  }
}
