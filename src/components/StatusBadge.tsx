import { CheckCircle, Clock, AlertCircle, XCircle, Circle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Config {
  bg: string
  text: string
  Icon: LucideIcon
}

const config: Record<string, Config> = {
  // Invoice statuses
  Paid:          { bg: 'bg-green-100 dark:bg-green-900/30',   text: 'text-green-800 dark:text-green-400',   Icon: CheckCircle },
  Pending:       { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', Icon: Clock },
  Overdue:       { bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-800 dark:text-red-400',       Icon: AlertCircle },
  // Project statuses
  Active:        { bg: 'bg-blue-100 dark:bg-blue-900/30',     text: 'text-blue-800 dark:text-blue-400',     Icon: CheckCircle },
  Completed:     { bg: 'bg-green-100 dark:bg-green-900/30',   text: 'text-green-800 dark:text-green-400',   Icon: CheckCircle },
  'On Hold':     { bg: 'bg-gray-100 dark:bg-gray-800',        text: 'text-gray-700 dark:text-gray-300',     Icon: Circle },
  // Task statuses
  Todo:          { bg: 'bg-gray-100 dark:bg-gray-800',        text: 'text-gray-700 dark:text-gray-300',     Icon: Circle },
  'In Progress': { bg: 'bg-blue-100 dark:bg-blue-900/30',     text: 'text-blue-800 dark:text-blue-400',     Icon: Clock },
  Done:          { bg: 'bg-green-100 dark:bg-green-900/30',   text: 'text-green-800 dark:text-green-400',   Icon: CheckCircle },
  // Deal stages
  'New Lead':    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-400', Icon: Circle },
  Contacted:     { bg: 'bg-sky-100 dark:bg-sky-900/30',       text: 'text-sky-800 dark:text-sky-400',       Icon: Clock },
  Negotiation:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-400', Icon: Clock },
  Won:           { bg: 'bg-green-100 dark:bg-green-900/30',   text: 'text-green-800 dark:text-green-400',   Icon: CheckCircle },
  Lost:          { bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-800 dark:text-red-400',       Icon: XCircle },
}

export function StatusBadge({
  status,
  showIcon = true,
}: {
  status: string
  showIcon?: boolean
}) {
  const c = config[status] ?? config.Pending
  const { bg, text, Icon } = c
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {status}
    </span>
  )
}
