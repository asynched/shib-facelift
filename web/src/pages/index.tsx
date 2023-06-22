import { useState } from 'react'
import { sql } from '@codemirror/lang-sql'
import { getQueries, saveQuery } from '@/services/storage/queries'
import { queriesStore } from '@/stores/queries'

import CodeMirror from '@uiw/react-codemirror'
import { PlayIcon, BookmarkIcon, BeakerIcon } from '@heroicons/react/24/outline'
import QueriesNavbar from '@/components/QueriesNavbar'
import TablesNavbar from '@/components/TablesNavbar'

export default function Home() {
  const [query, setQuery] = useState('SELECT * FROM users')

  const handleSaveQuery = () => {
    saveQuery(query)

    queriesStore.update({
      saved: getQueries(),
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
            <button className="flex items-center gap-1">
              <PlayIcon className="w-5 h-5 text-green-500" />
              <span>Run</span>
            </button>
            <div className="flex items-center gap-1">
              <BeakerIcon className="w-5 h-5" />
              <span>Idle</span>
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
      <QueriesNavbar />
    </div>
  )
}