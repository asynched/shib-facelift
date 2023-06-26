import { createObservable } from '@/hooks/common'
import { ExecutedQuery } from '@/services/api/queries'
import { getHistory } from '@/services/storage/history'
import { getQueries } from '@/services/storage/queries'

export const queriesStore = createObservable({
  saved: getQueries(),
  history: getHistory(),
  apiHistory: [] as ExecutedQuery[],
})
