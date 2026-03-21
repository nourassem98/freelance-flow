'use client'

import { useState } from 'react'
import {
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Milestone,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type DeadlineType = 'deadline' | 'meeting' | 'milestone'
interface Deadline { id: string; title: string; client: string; time: string; type: DeadlineType }
interface Todo { id: string; text: string; completed: boolean }
interface DayData { todos: Todo[]; deadlines: Deadline[] }

const initialData: Record<string, DayData> = {
  '2026-03-15': {
    todos: [
      { id: '1', text: 'Review project proposal', completed: false },
      { id: '2', text: 'Send invoice to Acme Corp', completed: true },
      { id: '3', text: 'Update portfolio website', completed: false },
    ],
    deadlines: [
      { id: '1', title: 'Website Redesign Delivery', client: 'TechStart Inc',   time: '5:00 PM', type: 'deadline' },
      { id: '2', title: 'Client Meeting',            client: 'Global Solutions', time: '2:00 PM', type: 'meeting'  },
    ],
  },
  '2026-03-18': {
    todos: [{ id: '4', text: 'Complete brand guidelines', completed: false }],
    deadlines: [
      { id: '3', title: 'Brand Identity Milestone', client: 'StartupXYZ', time: '12:00 PM', type: 'milestone' },
    ],
  },
  '2026-03-22': {
    todos: [
      { id: '5', text: 'Prepare presentation', completed: false },
      { id: '6', text: 'Review contract terms', completed: false },
    ],
    deadlines: [
      { id: '5', title: 'Project Kickoff Meeting', client: 'New Client Inc', time: '10:00 AM', type: 'meeting' },
    ],
  },
}

const deadlineColor: Record<DeadlineType, string> = {
  deadline:  'bg-red-500/20 text-red-400 border-red-500/30',
  meeting:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
  milestone: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

const deadlineIcon = (type: DeadlineType) => {
  if (type === 'meeting')   return <User className="h-4 w-4" />
  if (type === 'milestone') return <Milestone className="h-4 w-4" />
  return <Clock className="h-4 w-4" />
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 15))
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 2, 15))
  const [calendarData, setCalendarData] = useState<Record<string, DayData>>(initialData)
  const [newTodo, setNewTodo] = useState('')

  const fmtKey = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const getDays = (date: Date) => {
    const y = date.getFullYear(), m = date.getMonth()
    const firstDay = new Date(y, m, 1).getDay()
    const total = new Date(y, m + 1, 0).getDate()
    const days: (number | null)[] = Array(firstDay).fill(null)
    for (let i = 1; i <= total; i++) days.push(i)
    return days
  }

  const hasEvents = (day: number) => {
    const key = fmtKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    const d = calendarData[key]
    return d && (d.todos.length > 0 || d.deadlines.length > 0)
  }

  const selectedKey = fmtKey(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  )
  const selectedData = calendarData[selectedKey] ?? { todos: [], deadlines: [] }

  const addTodo = () => {
    if (!newTodo.trim()) return
    const cur = calendarData[selectedKey] ?? { todos: [], deadlines: [] }
    setCalendarData((prev) => ({
      ...prev,
      [selectedKey]: {
        ...cur,
        todos: [...cur.todos, { id: Date.now().toString(), text: newTodo, completed: false }],
      },
    }))
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setCalendarData((prev) => ({
      ...prev,
      [selectedKey]: {
        ...prev[selectedKey],
        todos: prev[selectedKey].todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      },
    }))
  }

  const deleteTodo = (id: string) => {
    setCalendarData((prev) => ({
      ...prev,
      [selectedKey]: {
        ...prev[selectedKey],
        todos: prev[selectedKey].todos.filter((t) => t.id !== id),
      },
    }))
  }

  const isSelected = (day: number) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentDate.getMonth() &&
    selectedDate.getFullYear() === currentDate.getFullYear()

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage deadlines, meetings, and to-do lists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month grid */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
                  }
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() =>
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
                  }
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDays(currentDate).map((day, i) => (
                <div key={i} className="aspect-square">
                  {day !== null && (
                    <button
                      onClick={() =>
                        setSelectedDate(
                          new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                        )
                      }
                      className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                        isSelected(day)
                          ? 'bg-indigo-600 text-white'
                          : hasEvents(day)
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="font-medium">{day}</span>
                      {hasEvents(day) && !isSelected(day) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-0.5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day detail panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()},{' '}
              {selectedDate.getFullYear()}
            </h3>

            {/* Deadlines & meetings */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Deadlines & Meetings
              </h4>
              {selectedData.deadlines.length > 0 ? (
                <div className="space-y-2">
                  {selectedData.deadlines.map((d) => (
                    <div
                      key={d.id}
                      className={`p-3 rounded-lg border ${deadlineColor[d.type]}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {deadlineIcon(d.type)}
                          <div>
                            <p className="font-medium text-sm">{d.title}</p>
                            <p className="text-xs opacity-75 mt-0.5">{d.client}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium">{d.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No deadlines scheduled
                </p>
              )}
            </div>

            {/* To-do list */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> To-Do List
              </h4>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="Add a task..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
                <button
                  onClick={addTodo}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {selectedData.todos.length > 0 ? (
                <div className="space-y-2">
                  {selectedData.todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
                    >
                      <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0">
                        {todo.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          todo.completed
                            ? 'text-gray-400 dark:text-gray-500 line-through'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No tasks for this day
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
