import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { stopPropagation } from '@/utils/ui'
import { resolveDownloadUrl } from '@/utils/urls'
import { ExecutedQuery, getPreview } from '@/services/api/queries'

import { XMarkIcon } from '@heroicons/react/24/outline'
import QueryHighlighter from '@/components/QueryHighlighter'

type QueryResultModalProps = {
  query: ExecutedQuery
  onClose: () => unknown
}

export default function QueryResultModal({
  onClose,
  query,
}: QueryResultModalProps) {
  const resultId = useMemo(
    () => query.results.find(Boolean)?.id as string,
    [query],
  )

  const { data: preview } = useQuery(
    ['preview', resultId],
    () => getPreview(resultId),
    {
      initialData: '',
    },
  )

  const handleDownload = (format: 'csv' | 'tsv') => {
    const result = query.results.find(Boolean)

    if (!result) {
      return
    }

    const url = resolveDownloadUrl(format, result.id)

    window.open(url, '_blank')
  }

  return (
    <div
      onClick={onClose}
      className="fixed top-0 left-0 w-full h-screen z-10 bg-black bg-opacity-25 grid place-items-center backdrop-blur-sm whitespace-nowrap"
    >
      <div
        onClick={stopPropagation()}
        className="p-8 bg-zinc-900 border border-zinc-800 rounded relative max-w-[32rem] w-full"
      >
        <button onClick={onClose} className="absolute top-4 right-4">
          <XMarkIcon className="w-6 h-6 text-zinc-500" />
        </button>
        <h1 className="mb-2 text-4xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 to-pink-600 bg-clip-text text-transparent text-center">
          Results
        </h1>
        <p className="mb-4 text-sm text-center text-zinc-400">
          Query ID: {query.id}
        </p>
        <h2 className="mb-2 text-2xl font-bold tracking-tighter">Query</h2>
        <div className="mb-4 bg-zinc-800 p-2 rounded border border-zinc-700 max-h-32 overflow-auto">
          <QueryHighlighter query={query.query} />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tighter">Preview</h2>
        <div className="mb-4 w-full overflow-auto text-xs p-4 border border-zinc-700 bg-zinc-800 rounded whitespace-pre">
          {preview || 'No preview available yet. (ㅠ﹏ㅠ)'}
        </div>
        <p className="mb-2 text-center">
          Download your file in the following formats
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleDownload('csv')}
            className="text-white bg-gradient-to-br from-orange-500 to-pink-600 py-2 px-4 rounded transition ease-in-out hover:shadow-lg hover:shadow-pink-600/25"
          >
            CSV
          </button>
          <button
            onClick={() => handleDownload('tsv')}
            className="text-white bg-gradient-to-br from-orange-500 to-pink-600 py-2 px-4 rounded transition ease-in-out hover:shadow-lg hover:shadow-pink-600/25"
          >
            TSV
          </button>
        </div>
      </div>
    </div>
  )
}
