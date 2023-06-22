import { getQueries, removeQuery } from '@/services/storage/queries'
import { truncate } from '@/utils/string'
import { useObservable } from '@/hooks/common'
import { queriesStore } from '@/stores/queries'
import {
  ArrowPathIcon,
  BookmarkIcon,
  ClipboardIcon,
  XMarkIcon,
  FolderArrowDownIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { RunningQuery, getRunningQueries } from '@/services/api/queries'
import { useQuery } from '@tanstack/react-query'
import DownloadResultModal from './DownloadResultModal'

export default function QueriesNavbar() {
  const [showModal, setShowModal] = useState(false)
  const [query, setQuery] = useState<RunningQuery | null>(null)
  const [tab, setTab] = useState<'history' | 'saved'>('history')
  const { saved, history } = useObservable(queriesStore)
  const { data: queryHistory } = useQuery(
    ['queries'],
    () => getRunningQueries(history.map((q) => q.id)),
    {
      enabled: tab === 'history',
      refetchInterval: 10_000,
      initialData: [],
    },
  )

  const handleCopyToClipBoard = (query: string) => {
    navigator.clipboard.writeText(query)
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
        <DownloadResultModal
          query={query}
          onClose={() => setShowModal(false)}
        />
      )}
      <nav className="w-[20rem] border-l border-zinc-800 p-4">
        <h1 className="pr-1 text-4xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 to-pink-600 bg-clip-text text-transparent">
          Your queries
        </h1>
        <p className="mb-4">Check your queries here.</p>
        <div className="text-gray-400 mb-4 flex gap-2">
          <button
            onClick={() => setTab('history')}
            className={`flex items-center gap-1 ${
              tab === 'history' && 'text-white'
            }`}
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>History</span>
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`flex items-center gap-1 ${
              tab === 'saved' && 'text-white'
            }`}
          >
            <BookmarkIcon className="w-5 h-5" />
            <span>Saved</span>
          </button>
        </div>
        {tab === 'history' && (
          <div>
            {queryHistory.length > 0 ? (
              <ul className="grid gap-2">
                {queryHistory.map((query) => (
                  <li
                    className="flex items-center justify-between py-1 px-2 bg-zinc-800 rounded text-sm text-zinc-300"
                    key={query.id}
                  >
                    <p>{truncate(query.query, 28)}</p>
                    <button
                      onClick={() => {
                        setShowModal(true)
                        setQuery(query)
                      }}
                      title="Download"
                    >
                      <FolderArrowDownIcon className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-4 px-4 text-sm text-zinc-400 border-2 border-zinc-800 border-dashed grid place-items-center">
                <p>Your history is empty</p>
              </div>
            )}
          </div>
        )}
        {tab === 'saved' && (
          <div>
            {saved.length > 0 ? (
              <ul className="grid gap-2">
                {saved.map((query) => (
                  <li
                    className="text-sm flex items-center justify-between py-1 px-2 bg-zinc-800 rounded text-zinc-300"
                    key={query.id}
                  >
                    <span title={query.query}>{truncate(query.query, 28)}</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleCopyToClipBoard(query.query)}
                        title="Copy"
                      >
                        <ClipboardIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuery(query.id)}
                        title="Delete"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-4 px-4 text-sm text-zinc-400 border-2 border-zinc-800 border-dashed grid place-items-center">
                <p>You don't have any queires saved</p>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
