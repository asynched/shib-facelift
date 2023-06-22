import { createObservable } from '@/hooks/common'
import { RunningQuery } from '@/services/api/queries'
import { getHistory } from '@/services/storage/history'
import { getQueries } from '@/services/storage/queries'

export const queriesStore = createObservable({
  saved: getQueries(),
  history: getHistory(),
  apiHistory: [] as RunningQuery[],
})
