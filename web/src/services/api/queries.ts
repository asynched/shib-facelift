import { httpClient } from '@/services/api/client'

export const getTables = async () => {
  const { data } = await httpClient.get<string[]>('/queries/tables')

  return data
}

type Column = {
  name: string
  type: string
}

type Running = {
  id: string
  runtime: string
}

export type RunningQuery = {
  db: string
  engine: string
  id: string
  query: string
  results: {
    id: string
    executedAt: string
  }[]
}

export const getTableColumns = async (table: string) => {
  const { data } = await httpClient.get<Column[]>(
    `/queries/tables/${table}/columns`,
  )

  return data
}

export const executeQuery = async (query: string) => {
  const { data } = await httpClient.post<string>('/queries/execute', {
    query,
  })

  return data
}

export const getRunnings = async () => {
  const { data } = await httpClient.get<Running[]>('/queries/running')

  return data
}

export const getRunningQueries = async (ids: string[]) => {
  if (ids.length === 0) {
    return []
  }

  const { data } = await httpClient.get<RunningQuery[]>('/queries', {
    params: {
      ids: ids.join(','),
    },
  })

  return data
}

export const getPreview = async (resultId: string) => {
  const { data } = await httpClient.get<string>(`/queries/results/${resultId}`)

  return data
}
