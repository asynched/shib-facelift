import { createObservable } from '@/hooks/common'
import { getQueries } from '@/services/storage/queries'

export const queriesStore = createObservable({
  saved: getQueries(),
  history: [],
})
