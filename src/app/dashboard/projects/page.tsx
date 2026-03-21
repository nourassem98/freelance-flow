'use client'

import { useState } from 'react'
import { Plus, Trash2, FolderKanban, ChevronRight } from 'lucide-react'
import { FormModal } from '@/components/FormModal'
import { StatusBadge } from '@/components/StatusBadge'
import { sampleProjects } from '@/lib/crm-data'
import type { Project, Task, ProjectStatus, TaskStatus } from '@/lib/crm-types'

const TASK_STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Done']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [selectedId, setSelectedId] = useState<string>(sampleProjects[0]?.id ?? '')
  const [projectModal, setProjectModal] = useState(false)
  const [taskModal, setTaskModal] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: '',
    client: '',
    deadline: '',
    status: 'Active' as ProjectStatus,
  })
  const [taskForm, setTaskForm] = useState({ title: '', status: 'Todo' as TaskStatus })

  const selected = projects.find((p) => p.id === selectedId)

  const addProject = () => {
    if (!projectForm.name) return
    const p: Project = { id: `p${Date.now()}`, ...projectForm, tasks: [] }
    setProjects((prev) => [...prev, p])
    setSelectedId(p.id)
    setProjectModal(false)
    setProjectForm({ name: '', client: '', deadline: '', status: 'Active' })
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    if (selectedId === id)
      setSelectedId(projects.find((p) => p.id !== id)?.id ?? '')
  }

  const addTask = () => {
    if (!taskForm.title || !selectedId) return
    const t: Task = {
      id: `t${Date.now()}`,
      title: taskForm.title,
      status: taskForm.status,
      projectId: selectedId,
    }
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, tasks: [...p.tasks, t] } : p))
    )
    setTaskModal(false)
    setTaskForm({ title: '', status: 'Todo' })
  }

  const moveTask = (taskId: string, status: TaskStatus) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) }
          : p
      )
    )

  const deleteTask = (taskId: string) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
          : p
      )
    )

  const field =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage projects and tasks for each client.
          </p>
        </div>
        <button
          onClick={() => setProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project list */}
        <div className="lg:col-span-1 space-y-3">
          {projects.map((p) => {
            const done = p.tasks.filter((t) => t.status === 'Done').length
            const pct = p.tasks.length
              ? Math.round((done / p.tasks.length) * 100)
              : 0
            return (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedId === p.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {p.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{p.client}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge status={p.status} showIcon={false} />
                      <span className="text-xs text-gray-400">{p.tasks.length} tasks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {selectedId === p.id && (
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProject(p.id)
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {p.tasks.length > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Due {p.deadline}</p>
              </div>
            )
          })}
        </div>

        {/* Task board */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selected.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selected.client} · Due {selected.deadline}
                  </p>
                </div>
                <button
                  onClick={() => setTaskModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Task
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {TASK_STATUSES.map((status) => (
                  <div
                    key={status}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {status}
                      </h3>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {selected.tasks.filter((t) => t.status === status).length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {selected.tasks
                        .filter((t) => t.status === status)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm"
                          >
                            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                              {task.title}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <select
                                value={task.status}
                                onChange={(e) =>
                                  moveTask(task.id, e.target.value as TaskStatus)
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none"
                              >
                                {TASK_STATUSES.map((s) => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
              <FolderKanban className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-500">Select a project to view its tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      <FormModal
        isOpen={projectModal}
        onClose={() => setProjectModal(false)}
        title="New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
            </label>
            <input
              className={field}
              value={projectForm.name}
              onChange={(e) => setProjectForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Website Redesign"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client
            </label>
            <input
              className={field}
              value={projectForm.client}
              onChange={(e) => setProjectForm((f) => ({ ...f, client: e.target.value }))}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              className={field}
              value={projectForm.deadline}
              onChange={(e) =>
                setProjectForm((f) => ({ ...f, deadline: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              className={field}
              value={projectForm.status}
              onChange={(e) =>
                setProjectForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))
              }
            >
              <option>Active</option>
              <option>On Hold</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setProjectModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addProject}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Project
            </button>
          </div>
        </div>
      </FormModal>

      {/* New Task Modal */}
      <FormModal
        isOpen={taskModal}
        onClose={() => setTaskModal(false)}
        title="Add Task"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Title
            </label>
            <input
              className={field}
              value={taskForm.title}
              onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Design homepage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Status
            </label>
            <select
              className={field}
              value={taskForm.status}
              onChange={(e) =>
                setTaskForm((f) => ({ ...f, status: e.target.value as TaskStatus }))
              }
            >
              {TASK_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setTaskModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addTask}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Task
            </button>
          </div>
        </div>
      </FormModal>
    </>
  )
}
