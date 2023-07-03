// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import parser from 'js-sql-parser'
import { useMemo, useState } from 'react'
import { sql } from '@codemirror/lang-sql'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useObservable } from '@/hooks/common'
import { queriesStore } from '@/stores/queries'
import { getQueries, saveQuery } from '@/services/storage/queries'
import { executeQuery, getRunnings } from '@/services/api/queries'
import { getHistory, saveHistory } from '@/services/storage/history'

import { PlayIcon, BookmarkIcon, BeakerIcon } from '@heroicons/react/24/outline'
import { BeakerIcon as BeakerSolid } from '@heroicons/react/24/solid'
import CodeMirror from '@uiw/react-codemirror'
import QueryNavbar from '@/components/QueryNavbar'
import TablesNavbar from '@/components/TablesNavbar'
import { When } from '@/components/utils/When'

const defaultQuery = `-- name: Select all users\nSELECT * FROM users\n\n\n\n`

export default function Home() {
  const { history } = useObservable(queriesStore)
  const [query, setQuery] = useState(defaultQuery)
  const { data: runnings } = useQuery(['runnings'], getRunnings, {
    initialData: [],
    refetchInterval: 1_000,
  })

  const queryStatus = useMemo(() => {
    const lastHistory = history[history.length - 1]

    if (!lastHistory) return 'Idle'

    return runnings.some((running) => running.id === lastHistory.id)
      ? 'Running'
      : 'Idle'
  }, [history, runnings])

  const handleSaveQuery = () => {
    saveQuery(query)

    queriesStore.update({
      saved: getQueries(),
    })
  }

  const parseAndValidateQuery = (query: string) => {
    try {
      parser.parse(query)
      return null
    } catch (err) {
      return (err as Error).message
    }
  }

  const handleExecuteQuery = () => {
    const err = parseAndValidateQuery(query)

    if (err) {
      toast.error(err)
      return
    }

    executeQuery(query)
      .then((id) => {
        saveHistory(id)
        queriesStore.update({
          history: getHistory(),
        })

        toast.success('Query is now being executed')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Query failed to execute, check your query.')
      })
  }

  return (
    <div className="h-screen flex text-white">
      <TablesNavbar />
      <div className="p-4 flex flex-col flex-1 h-screen overflow-auto justify-start">
        <h1 className="pr-1 text-4xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 to-pink-600 bg-clip-text text-transparent">
          New query
        </h1>
        <p className="mb-4">Execute a new query.</p>
        <div className="relative">
          <div className="z-10 absolute top-0 right-0 flex gap-2">
            <button
              onClick={handleSaveQuery}
              className="flex items-center gap-1"
            >
              <BookmarkIcon className="w-5 h-5" />
              <span>Save</span>
            </button>
            <button
              onClick={handleExecuteQuery}
              className="flex items-center gap-1"
            >
              <PlayIcon className="w-5 h-5 text-green-500" />
              <span>Run</span>
            </button>
            <div className="flex items-center gap-1">
              <When
                value={queryStatus === 'Running'}
                fallback={<BeakerIcon className="w-5 h-5" />}
              >
                <BeakerSolid className="w-5 h-5" />
              </When>
              <span>{queryStatus}</span>
            </div>
          </div>
          <CodeMirror
            className="flex-1"
            value={query}
            onChange={(value) => setQuery(value)}
            extensions={[sql()]}
            theme="dark"
          />
        </div>
      </div>
      <QueryNavbar />
    </div>
  )
}
