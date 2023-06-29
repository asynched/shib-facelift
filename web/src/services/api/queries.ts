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

export type ExecutedQuery = {
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

export const getExecutedQueries = async (ids: string[]) => {
  if (ids.length === 0) {
    return []
  }

  const { data } = await httpClient.get<ExecutedQuery[]>('/queries', {
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

// TODO: Fix this in the back-end, as it results in
// shib giving 5xx errors.
// export const getResults = async (_ids: string[]) => {
//   return []

//   // if (ids.length === 0) {
//   //   return []
//   // }

//   // const { data } = await httpClient.get<any[]>(`/queries/results`, {
//   //   params: {
//   //     ids: ids.join(','),
//   //   },
//   // })

//   // return []
// }
