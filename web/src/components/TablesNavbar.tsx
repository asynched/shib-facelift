import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cls } from '@/utils/classes'
import { truncate } from '@/utils/string'
import { getTableColumns, getTables } from '@/services/api/queries'

import { TableCellsIcon } from '@heroicons/react/24/outline'

export default function TablesNavbar() {
  const [filter, setFilter] = useState('')
  const { data: tables } = useQuery(['tables'], getTables, {
    initialData: [],
  })

  const filteredTables = useMemo(
    () =>
      tables
        .sort((a, b) => a.localeCompare(b))
        .filter((table) => table.startsWith(filter)),
    [tables, filter],
  )

  return (
    <nav className="p-4 border-r border-zinc-800 w-[20rem] h-screen overflow-auto">
      <h1 className="text-center text-4xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 to-pink-600 bg-clip-text text-transparent">
        New shib
      </h1>
      <p className="text-center mb-4">Query your hive!</p>
      <h2 className="mb-4 text-2xl font-bold tracking-tighter">Tables</h2>
      <form className="mb-4">
        <input
          type="text"
          placeholder="Filter tables..."
          className="bg-zinc-800 w-full bg-transparent py-2 px-4 border border-zinc-700 text-sm rounded outline-none transition ease-in-out focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </form>
      <ul className="grid gap-1">
        {filteredTables.map((table) => (
          <li key={table} title={table}>
            <TableDescription table={table} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

type TableDescriptionProps = {
  table: string
}

function TableDescription({ table }: TableDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: columns } = useQuery(
    ['tables', table, 'columns'],
    () => getTableColumns(table),
    {
      enabled: isOpen,
      initialData: [],
    },
  )

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={cls(
          'py-1 px-2 flex gap-1 items-center rounded transition ease-in-out hover:bg-zinc-800',
          {
            'bg-zinc-800': isOpen,
          },
        )}
      >
        <TableCellsIcon className="w-4 h-4 transition ease-in-out text-orange-500" />
        <span>{truncate(table, 24)}</span>
      </button>
      {isOpen && (
        <ul className="ml-6 mt-1 grid gap-[.3rem]">
          {columns.map((column) => (
            <li
              key={column.name}
              className="text-sm flex items-center justify-between"
            >
              <span>{column.name}</span>
              <span
                className="py-[.125rem] text-xs bg-zinc-800 rounded px-2"
                title={column.type}
              >
                {truncate(column.type, 16)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
