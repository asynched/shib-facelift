import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { cls } from '@/utils/classes'
import { useObservable } from '@/hooks/common'
import { queriesStore } from '@/stores/queries'
import { getQueries, removeQuery } from '@/services/storage/queries'
import { getExecutedQueries, type ExecutedQuery } from '@/services/api/queries'

import {
  ArrowPathIcon,
  BookmarkIcon,
  ClipboardIcon,
  XMarkIcon,
  FolderArrowDownIcon,
} from '@heroicons/react/24/outline'
import QueryResultModal from '@/components/QueryResultModal'
import QueryHighlighter from '@/components/QueryHighlighter'
import { formatDate } from '@/utils/dates'
import { When } from './utils/When'

export default function QueryNavbar() {
  const { saved, history } = useObservable(queriesStore)
  const [showModal, setShowModal] = useState(false)
  const [query, setQuery] = useState<ExecutedQuery | null>(null)
  const [tab, setTab] = useState<'history' | 'saved'>('history')

  const { data: queryHistory } = useQuery(
    ['queries'],
    () => getExecutedQueries(history.map((q) => q.id)),
    {
      refetchInterval: 10_000,
      initialData: [],
    },
  )

  const handleCopyToClipBoard = (query: string) => {
    navigator.clipboard.writeText(query)
    toast.success('Successfully copied query to clipboard')
  }

  const handleDeleteQuery = (id: string) => {
    removeQuery(id)
    queriesStore.update({
      saved: getQueries(),
    })
  }

  return (
    <>
      {showModal && query && (
        <QueryResultModal query={query} onClose={() => setShowModal(false)} />
      )}
      <nav className="w-[24rem] border-l border-zinc-800 p-4 max-h-screen overflow-y-auto">
        <h1 className="pr-1 text-4xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 to-pink-600 bg-clip-text text-transparent">
          Your queries
        </h1>
        <p className="mb-4">Check your queries here.</p>
        <div className="text-gray-400 mb-4 flex gap-2">
          <button
            onClick={() => setTab('history')}
            className={cls('flex items-center gap-1', {
              'text-white': tab === 'history',
            })}
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>History</span>
          </button>
          <button
            onClick={() => setTab('saved')}
            className={cls('flex items-center gap-1', {
              'text-white': tab === 'saved',
            })}
          >
            <BookmarkIcon className="w-5 h-5" />
            <span>Saved</span>
          </button>
        </div>
        <When value={tab === 'history'}>
          <When
            value={queryHistory.length > 0}
            fallback={<EmptyPlaceholder text="You don't have any history" />}
          >
            <ul className="grid gap-4">
              {queryHistory.map((query) => (
                <li
                  className="relative py-2 px-3 flex flex-col bg-zinc-800 rounded text-sm text-zinc-300"
                  key={query.id}
                >
                  <QueryHighlighter query={query.query} width="max-w-[38ch]" />
                  <When value={query.results[0]}>
                    {(result) => (
                      <span className="mt-1 text-sm text-gray-400">
                        Execution: {formatDate(result.executedAt)}.
                      </span>
                    )}
                  </When>
                  <button
                    onClick={() => {
                      setShowModal(true)
                      setQuery(query)
                    }}
                    title="Download"
                    className="absolute top-2 right-2"
                  >
                    <FolderArrowDownIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </When>
        </When>
        <When value={tab === 'saved'}>
          <When
            value={saved.length > 0}
            fallback={
              <EmptyPlaceholder text="You don't have any saved queries" />
            }
          >
            <ul className="grid gap-4">
              {saved.map((query) => (
                <li
                  className="py-2 px-3 text-sm flex items-start justify-between bg-zinc-800 rounded text-zinc-300 relative"
                  key={query.id}
                >
                  <QueryHighlighter query={query.query} />
                  <div className="flex items-center absolute top-3 right-3">
                    <button
                      onClick={() => handleCopyToClipBoard(query.query)}
                      title="Copy"
                    >
                      <ClipboardIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuery(query.id)}
                      title="Delete"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </When>
        </When>
      </nav>
    </>
  )
}

type EmptyPlaceholderProps = {
  text: string
}

function EmptyPlaceholder({ text }: EmptyPlaceholderProps) {
  return (
    <div className="py-4 px-4 text-sm text-zinc-400 border-2 border-zinc-800 border-dashed grid place-items-center">
      <p>{text} </p>
    </div>
  )
}
