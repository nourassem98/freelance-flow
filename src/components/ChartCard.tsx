'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ChartCardProps {
  title: string
  subtitle?: string
  value?: string | number
  change?: string
  trend?: 'up' | 'down' | 'stable'
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
}

export default function ChartCard({
  title,
  subtitle,
  value,
  change,
  trend,
  children,
  className = '',
  actions,
  footer,
}: ChartCardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  const trendColor =
    trend === 'up'
      ? 'text-emerald-500 dark:text-emerald-400'
      : trend === 'down'
      ? 'text-red-500 dark:text-red-400'
      : 'text-gray-400 dark:text-gray-500'

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="shrink-0 flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Big value + trend */}
      {(value !== undefined || change) && (
        <div className="flex items-end gap-3 px-5 pb-3">
          {value !== undefined && (
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none">
              {value}
            </span>
          )}
          {(change || trend) && (
            <span className={`inline-flex items-center gap-1 text-sm font-medium mb-0.5 ${trendColor}`}>
              {trend && <TrendIcon className="h-4 w-4" />}
              {change && <span>{change}</span>}
            </span>
          )}
        </div>
      )}

      {/* Chart area */}
      <div className="flex-1 px-5 pb-4">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-3 text-xs text-gray-500 dark:text-gray-400">
          {footer}
        </div>
      )}
    </div>
  )
}
