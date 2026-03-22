'use client'

import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Inbox } from 'lucide-react'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  emptyMessage?: string
  searchable?: boolean
  searchKeys?: (keyof T)[]
  loading?: boolean
  actions?: (row: T) => React.ReactNode
  pagination?: boolean
  rowClassName?: (row: T) => string
}

const PAGE_SIZE = 10

function getCellValue<T>(row: T, key: keyof T | string): unknown {
  return (row as Record<string, unknown>)[key as string]
}

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data found.',
  searchable = false,
  searchKeys = [],
  loading = false,
  actions,
  pagination = false,
  rowClassName,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!searchable || !search.trim()) return data
    const q = search.toLowerCase()
    return data.filter((row) =>
      searchKeys.some((k) => {
        const val = getCellValue(row, k as string)
        return String(val ?? '').toLowerCase().includes(q)
      })
    )
  }, [data, search, searchable, searchKeys])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const av = getCellValue(a, sortKey)
      const bv = getCellValue(b, sortKey)
      const aStr = String(av ?? '')
      const bStr = String(bv ?? '')
      const aNum = Number(av)
      const bNum = Number(bv)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDir === 'asc' ? aNum - bNum : bNum - aNum
      }
      return sortDir === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = pagination ? Math.max(1, Math.ceil(sorted.length / PAGE_SIZE)) : 1
  const paginated = pagination ? sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : sorted

  function handleSort(key: keyof T | string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  const hasActions = Boolean(actions)

  return (
    <div className="flex flex-col gap-3">
      {searchable && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap select-none ${
                    col.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200' : ''
                  }`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="text-gray-400 dark:text-gray-600">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-px whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-4 py-3">
                      <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </td>
                  )}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                    <Inbox className="h-8 w-8" />
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const extra = rowClassName ? rowClassName(row) : ''
                return (
                  <tr
                    key={i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${extra}`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key as string}
                        className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(row)
                          : String(getCellValue(row, col.key) ?? '')}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        {actions!(row)}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && !loading && sorted.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {sorted.length === 0
              ? 'No results'
              : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)} of ${sorted.length}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Previous
            </button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
