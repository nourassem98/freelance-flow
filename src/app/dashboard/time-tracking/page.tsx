'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Clock, Play, Pause, Plus, Trash2, CheckCircle, Circle,
  DollarSign, Timer, BarChart2, Filter,
} from 'lucide-react'
import { FormModal } from '@/components/FormModal'
import { useCRMStore } from '@/lib/store/index'
import type { TimeEntry, Invoice } from '@/lib/types'

// ─── helpers ────────────────────────────────────────────────────────────────

const field =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

/** Returns ISO date string for a given offset from today (0=today, -1=yesterday, etc.) */
function dateOffset(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

/** Returns day label Mon-Sun for a date string */
function dayLabel(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
}

// ─── component ───────────────────────────────────────────────────────────────

export default function TimeTrackingPage() {
  const {
    timeEntries, addTimeEntry, deleteTimeEntry, markBilled,
    projects, addInvoice,
  } = useCRMStore()

  // ── timer state
  const [timerRunning, setTimerRunning]   = useState(false)
  const [elapsedSecs, setElapsedSecs]     = useState(0)
  const [timerProject, setTimerProject]   = useState('')
  const [timerClient, setTimerClient]     = useState('')
  const [timerDesc, setTimerDesc]         = useState('')
  const [timerBillable, setTimerBillable] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── filters
  const [projectFilter, setProjectFilter] = useState('')
  const [billableFilter, setBillableFilter] = useState<'all' | 'billable' | 'unbillable'>('all')

  // ── selection for convert-to-invoice
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // ── log modal
  const [logOpen, setLogOpen]   = useState(false)
  const [logForm, setLogForm]   = useState({
    projectId:   '',
    projectName: '',
    clientName:  '',
    description: '',
    date:        todayStr(),
    duration:    '',
    billable:    true,
    hourlyRate:  '',
  })

  // ── toast notification
  const [toast, setToast]       = useState<string | null>(null)

  // ── timer effect
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSecs((s) => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerRunning])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // ── start / stop timer
  const handleTimerToggle = () => {
    if (timerRunning) {
      // stop — save entry
      const mins = Math.max(1, Math.round(elapsedSecs / 60))
      const proj = projects.find((p) => p.id === timerProject)
      const newEntry: TimeEntry = {
        id:          `te${Date.now()}`,
        projectId:   timerProject || undefined,
        projectName: timerProject ? (proj?.name ?? timerProject) : undefined,
        clientName:  timerClient || (proj?.client ?? undefined),
        description: timerDesc.trim() || 'Timed session',
        date:        todayStr(),
        duration:    mins,
        billable:    timerBillable,
        hourlyRate:  proj?.hourlyRate ?? 100,
        billed:      false,
        startTime:   new Date(Date.now() - elapsedSecs * 1000).toISOString(),
        endTime:     new Date().toISOString(),
      }
      addTimeEntry(newEntry)
      setTimerRunning(false)
      setElapsedSecs(0)
      setTimerDesc('')
      showToast(`Logged ${formatDuration(mins)} successfully.`)
    } else {
      setTimerRunning(true)
    }
  }

  // ── project selection in timer syncs client
  const handleTimerProjectChange = (projectId: string) => {
    setTimerProject(projectId)
    const proj = projects.find((p) => p.id === projectId)
    setTimerClient(proj?.client ?? '')
  }

  // ── derived stats
  const stats = useMemo(() => {
    const thisWeek = [0, -1, -2, -3, -4, -5, -6].map((o) => dateOffset(o))
    const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

    const weekEntries    = timeEntries.filter((t) => thisWeek.includes(t.date))
    const totalMins      = weekEntries.reduce((s, t) => s + t.duration, 0)
    const billableMins   = weekEntries.filter((t) => t.billable).reduce((s, t) => s + t.duration, 0)
    const unbilledAmount = timeEntries
      .filter((t) => t.billable && !t.billed)
      .reduce((s, t) => s + (t.hourlyRate / 60) * t.duration, 0)
    const billedMonth    = timeEntries
      .filter((t) => t.billed && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + (t.hourlyRate / 60) * t.duration, 0)

    return { totalMins, billableMins, unbilledAmount, billedMonth }
  }, [timeEntries])

  // ── weekly bar chart data (last 7 days, Mon→Sun ordered by date)
  const weeklyData = useMemo(() => {
    return [0, -6, -5, -4, -3, -2, -1].map((o) => {
      const dateStr = dateOffset(o)
      const mins    = timeEntries
        .filter((t) => t.date === dateStr)
        .reduce((s, t) => s + t.duration, 0)
      return { date: dateStr, label: dayLabel(dateStr), hours: mins / 60 }
    }).sort((a, b) => (a.date < b.date ? -1 : 1))
  }, [timeEntries])

  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1)

  // ── filtered entries
  const filtered = useMemo(() => {
    return timeEntries
      .filter((t) => {
        const matchProject  = !projectFilter || t.projectId === projectFilter
        const matchBillable =
          billableFilter === 'all' ||
          (billableFilter === 'billable' && t.billable) ||
          (billableFilter === 'unbillable' && !t.billable)
        return matchProject && matchBillable
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [timeEntries, projectFilter, billableFilter])

  // ── row selection helpers
  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    const selectableIds = filtered
      .filter((t) => t.billable && !t.billed)
      .map((t) => t.id)
    const allSelected = selectableIds.every((id) => selected.has(id))
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        selectableIds.forEach((id) => next.delete(id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        selectableIds.forEach((id) => next.add(id))
        return next
      })
    }
  }

  // ── convert selected to invoices (grouped by client)
  const selectedEntries = filtered.filter((t) => selected.has(t.id) && t.billable && !t.billed)

  const handleConvertToInvoice = () => {
    if (selectedEntries.length === 0) return

    // Group by client
    const byClient: Record<string, TimeEntry[]> = {}
    selectedEntries.forEach((t) => {
      const key = t.clientName ?? 'Unknown Client'
      byClient[key] = [...(byClient[key] ?? []), t]
    })

    const invoiceIds: string[] = []

    Object.entries(byClient).forEach(([client, entries]) => {
      const invoiceId = `INV-TIME-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      invoiceIds.push(invoiceId)

      const items = entries.map((t) => ({
        id:          `li-${t.id}`,
        description: `${t.projectName ? `[${t.projectName}] ` : ''}${t.description} (${formatDuration(t.duration)})`,
        qty:         1,
        unitPrice:   Math.round((t.hourlyRate / 60) * t.duration * 100) / 100,
      }))

      const amount = items.reduce((s, i) => s + i.unitPrice, 0)

      const inv: Invoice = {
        id:              invoiceId,
        client,
        items,
        amount:          Math.round(amount * 100) / 100,
        status:          'Draft',
        issueDate:       todayStr(),
        dueDate:         dateOffset(30),
        fromTimeEntries: entries.map((t) => t.id),
      }
      addInvoice(inv)
      markBilled(entries.map((t) => t.id), invoiceId)
    })

    setSelected(new Set())
    showToast(
      `Created ${invoiceIds.length} invoice${invoiceIds.length > 1 ? 's' : ''} for ${selectedEntries.length} time ${selectedEntries.length > 1 ? 'entries' : 'entry'}.`
    )
  }

  // ── log time form
  const handleLogSave = () => {
    if (!logForm.description.trim() || !logForm.duration) return
    const proj = projects.find((p) => p.id === logForm.projectId)
    const newEntry: TimeEntry = {
      id:          `te${Date.now()}`,
      projectId:   logForm.projectId || undefined,
      projectName: logForm.projectId ? (proj?.name ?? logForm.projectName) : (logForm.projectName || undefined),
      clientName:  logForm.clientName || (proj?.client ?? undefined),
      description: logForm.description.trim(),
      date:        logForm.date,
      duration:    parseInt(logForm.duration, 10) || 60,
      billable:    logForm.billable,
      hourlyRate:  parseFloat(logForm.hourlyRate) || (proj?.hourlyRate ?? 100),
      billed:      false,
    }
    addTimeEntry(newEntry)
    setLogOpen(false)
    setLogForm({
      projectId: '', projectName: '', clientName: '', description: '',
      date: todayStr(), duration: '', billable: true, hourlyRate: '',
    })
    showToast('Time entry logged.')
  }

  const handleLogProjectChange = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId)
    setLogForm((prev) => ({
      ...prev,
      projectId,
      projectName: proj?.name ?? '',
      clientName:  proj?.client ?? '',
      hourlyRate:  proj?.hourlyRate ? String(proj.hourlyRate) : prev.hourlyRate,
    }))
  }

  const selectableCount = filtered.filter((t) => t.billable && !t.billed).length
  const allSelectableSelected =
    selectableCount > 0 && filtered.filter((t) => t.billable && !t.billed).every((t) => selected.has(t.id))

  return (
    <>
      {/* ── Toast ─────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Time Tracking
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Log hours, track billable time, and generate invoices.
          </p>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Log Time
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Hours This Week',
            value: `${(stats.totalMins / 60).toFixed(1)}h`,
            icon:  Clock,
            color: 'text-blue-600 dark:text-blue-400',
            bg:    'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Billable Hours',
            value: `${(stats.billableMins / 60).toFixed(1)}h`,
            icon:  Timer,
            color: 'text-green-600 dark:text-green-400',
            bg:    'bg-green-50 dark:bg-green-900/20',
          },
          {
            label: 'Unbilled Amount',
            value: `$${stats.unbilledAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            icon:  DollarSign,
            color: 'text-orange-600 dark:text-orange-400',
            bg:    'bg-orange-50 dark:bg-orange-900/20',
          },
          {
            label: 'Billed This Month',
            value: `$${stats.billedMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            icon:  BarChart2,
            color: 'text-purple-600 dark:text-purple-400',
            bg:    'bg-purple-50 dark:bg-purple-900/20',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5"
          >
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* ── Active timer ──────────────────────────────────────── */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className={`h-2 w-2 rounded-full ${timerRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Active Timer
            </h2>
            {timerRunning && (
              <span className="ml-auto font-mono text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {formatElapsed(elapsedSecs)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Project</label>
              <select
                className={field}
                value={timerProject}
                onChange={(e) => handleTimerProjectChange(e.target.value)}
                disabled={timerRunning}
              >
                <option value="">— Select project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.client})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input
                className={field}
                placeholder="What are you working on?"
                value={timerDesc}
                onChange={(e) => setTimerDesc(e.target.value)}
                disabled={timerRunning}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                checked={timerBillable}
                onChange={(e) => setTimerBillable(e.target.checked)}
                disabled={timerRunning}
              />
              Billable
            </label>
            <button
              onClick={handleTimerToggle}
              className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                timerRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {timerRunning ? (
                <><Pause className="h-4 w-4" /> Stop &amp; Save</>
              ) : (
                <><Play className="h-4 w-4" /> Start Timer</>
              )}
            </button>
          </div>
        </div>

        {/* ── Weekly bar chart ──────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-4 w-4 text-blue-500" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Weekly Hours
            </h2>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {weeklyData.map((day) => {
              const pct = maxHours > 0 ? (day.hours / maxHours) * 100 : 0
              const isToday = day.date === todayStr()
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="relative group w-full"
                    style={{ height: '80px', display: 'flex', alignItems: 'flex-end' }}
                  >
                    <div
                      style={{ height: `${Math.max(pct, 3)}%` }}
                      className={`w-full rounded-t transition-all ${
                        isToday
                          ? 'bg-blue-500'
                          : 'bg-blue-200 dark:bg-blue-800 group-hover:bg-blue-400 dark:group-hover:bg-blue-600'
                      }`}
                    />
                    {day.hours > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {day.hours.toFixed(1)}h
                      </div>
                    )}
                  </div>
                  <span className={`text-xs ${isToday ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {day.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{(stats.totalMins / 60).toFixed(1)}h total</span>
            <span>{(stats.billableMins / 60).toFixed(1)}h billable</span>
          </div>
        </div>
      </div>

      {/* ── Convert-to-invoice banner ──────────────────────────── */}
      {selectedEntries.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              {selectedEntries.length} entr{selectedEntries.length === 1 ? 'y' : 'ies'} selected
              {' — '}
              <strong>
                ${selectedEntries
                  .reduce((s, t) => s + (t.hourlyRate / 60) * t.duration, 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
            </span>
          </div>
          <button
            onClick={handleConvertToInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <DollarSign className="h-4 w-4" />
            Convert to Invoice
          </button>
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {([
            { key: 'all',         label: 'All' },
            { key: 'billable',    label: 'Billable' },
            { key: 'unbillable',  label: 'Non-billable' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setBillableFilter(key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                billableFilter === key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Time entries table ────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="pl-4 pr-2 py-3 text-left w-10">
                  {selectableCount > 0 && (
                    <button onClick={toggleAll} className="text-gray-400 hover:text-blue-600 transition-colors">
                      {allSelectableSelected
                        ? <CheckCircle className="h-4 w-4 text-blue-600" />
                        : <Circle className="h-4 w-4" />
                      }
                    </button>
                  )}
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Date</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Project</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide hidden md:table-cell">Client</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Description</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Duration</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide hidden sm:table-cell">Billable</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide hidden lg:table-cell">Rate</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Amount</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">Billed</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No time entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const amount = (entry.hourlyRate / 60) * entry.duration
                  const isSelectable = entry.billable && !entry.billed
                  const isSelected   = selected.has(entry.id)

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/10'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <td className="pl-4 pr-2 py-3">
                        {isSelectable ? (
                          <button
                            onClick={() => toggleRow(entry.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {isSelected
                              ? <CheckCircle className="h-4 w-4 text-blue-600" />
                              : <Circle className="h-4 w-4" />
                            }
                          </button>
                        ) : (
                          <span className="block w-4 h-4" />
                        )}
                      </td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {entry.projectName ?? <span className="text-gray-400 italic">No project</span>}
                      </td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                        {entry.clientName ?? '—'}
                      </td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                        {entry.description}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatDuration(entry.duration)}
                      </td>
                      <td className="px-3 py-3 text-center hidden sm:table-cell">
                        {entry.billable
                          ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          : <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600 mx-auto" />
                        }
                      </td>
                      <td className="px-3 py-3 text-right text-gray-600 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                        ${entry.hourlyRate}/h
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {entry.billable
                          ? `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : <span className="text-gray-400">—</span>
                        }
                      </td>
                      <td className="px-3 py-3 text-center">
                        {entry.billed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                            <CheckCircle className="h-3 w-3" /> Billed
                          </span>
                        ) : entry.billable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-full font-medium">
                            Unbilled
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => {
                            if (confirm('Delete this time entry?')) deleteTimeEntry(entry.id)
                          }}
                          className="p-1.5 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer summary */}
        {filtered.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30">
            <span>
              {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
            </span>
            <span>
              {formatDuration(filtered.reduce((s, t) => s + t.duration, 0))} total
            </span>
            <span className="ml-auto font-semibold text-gray-900 dark:text-gray-100">
              ${filtered
                .filter((t) => t.billable)
                .reduce((s, t) => s + (t.hourlyRate / 60) * t.duration, 0)
                .toLocaleString(undefined, { maximumFractionDigits: 0 })} billable
            </span>
          </div>
        )}
      </div>

      {/* ── Log Time modal ────────────────────────────────────── */}
      <FormModal
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
        title="Log Time"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                className={field}
                value={logForm.date}
                onChange={(e) => setLogForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Duration (minutes)</label>
              <input
                type="number"
                min={1}
                className={field}
                placeholder="e.g. 90"
                value={logForm.duration}
                onChange={(e) => setLogForm((f) => ({ ...f, duration: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Project</label>
            <select
              className={field}
              value={logForm.projectId}
              onChange={(e) => handleLogProjectChange(e.target.value)}
            >
              <option value="">— None —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.client})
                </option>
              ))}
            </select>
          </div>

          {!logForm.projectId && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Project Name</label>
                <input
                  className={field}
                  placeholder="My Project"
                  value={logForm.projectName}
                  onChange={(e) => setLogForm((f) => ({ ...f, projectName: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Client Name</label>
                <input
                  className={field}
                  placeholder="Client"
                  value={logForm.clientName}
                  onChange={(e) => setLogForm((f) => ({ ...f, clientName: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Description *</label>
            <input
              className={field}
              placeholder="What did you work on?"
              value={logForm.description}
              onChange={(e) => setLogForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Hourly Rate ($)</label>
              <input
                type="number"
                min={0}
                className={field}
                placeholder="100"
                value={logForm.hourlyRate}
                onChange={(e) => setLogForm((f) => ({ ...f, hourlyRate: e.target.value }))}
              />
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none mt-auto mb-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  checked={logForm.billable}
                  onChange={(e) => setLogForm((f) => ({ ...f, billable: e.target.checked }))}
                />
                Billable
              </label>
            </div>
          </div>

          {/* Preview amount */}
          {logForm.duration && logForm.hourlyRate && logForm.billable && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2.5 flex justify-between text-sm">
              <span className="text-green-700 dark:text-green-400">Billable amount</span>
              <span className="font-semibold text-green-700 dark:text-green-400">
                ${((parseFloat(logForm.hourlyRate) / 60) * parseInt(logForm.duration, 10)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setLogOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogSave}
              disabled={!logForm.description.trim() || !logForm.duration}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Time
            </button>
          </div>
        </div>
      </FormModal>
    </>
  )
}
