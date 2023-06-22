import { httpClient } from '@/services/api/client'

export const getTables = async () => {
  const { data } = await httpClient.get<string[]>('/queries/tables')

  return data
}

type TableType = {
  name: string
  type: string
}

export const getTableColumns = async (table: string) => {
  const { data } = await httpClient.get<TableType[]>(
    `/queries/tables/${table}/columns`,
  )

  return data
}
