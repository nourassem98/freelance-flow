'use client'

import { useState } from 'react'
import {
  Zap,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Mail,
  Bell,
  CheckCircle,
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Play,
  Settings,
} from 'lucide-react'
import { useCRMStore } from '@/lib/store/index'
import type { Automation, TriggerType, AutomationActionType, AutomationActionConfig } from '@/lib/types'

// ── Label / colour maps ────────────────────────────────────────

const TRIGGER_LABELS: Record<TriggerType, string> = {
  deal_won:           'Deal Marked as Won',
  deal_lost:          'Deal Marked as Lost',
  invoice_overdue:    'Invoice Becomes Overdue',
  invoice_paid:       'Invoice is Paid',
  new_lead:           'New Lead Created',
  project_completed:  'Project Completed',
  time_logged:        'Time Logged',
  proposal_accepted:  'Proposal Accepted',
  proposal_rejected:  'Proposal Rejected',
}

const TRIGGER_COLORS: Record<TriggerType, string> = {
  deal_won:          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  deal_lost:         'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  invoice_overdue:   'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  invoice_paid:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  new_lead:          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  project_completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  time_logged:       'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  proposal_accepted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  proposal_rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

const ACTION_TYPE_LABELS: Record<AutomationActionType, string> = {
  create_project: 'Create Project',
  create_invoice: 'Create Invoice',
  send_email:     'Send Email',
  create_task:    'Create Task',
  add_tag:        'Add Tag',
  move_deal:      'Move Deal',
  create_deal:    'Create Deal',
  notify:         'Send Notification',
  send_reminder:  'Send Reminder',
}

const ACTION_ICON: Record<AutomationActionType, React.ReactNode> = {
  create_project: <Settings className="h-3 w-3" />,
  create_invoice: <TrendingUp className="h-3 w-3" />,
  send_email:     <Mail className="h-3 w-3" />,
  create_task:    <CheckCircle className="h-3 w-3" />,
  add_tag:        <Sparkles className="h-3 w-3" />,
  move_deal:      <ArrowRight className="h-3 w-3" />,
  create_deal:    <TrendingUp className="h-3 w-3" />,
  notify:         <Bell className="h-3 w-3" />,
  send_reminder:  <AlertCircle className="h-3 w-3" />,
}

// ── Email templates (mock) ────────────────────────────────────

const EMAIL_TEMPLATES = [
  {
    id: 'et1',
    name: 'New Lead Welcome',
    subject: 'Welcome — Let\'s talk about your project',
    preview: 'Hi {{name}}, thanks for reaching out! I\'d love to learn more about what you\'re building...',
    trigger: 'new_lead' as TriggerType,
  },
  {
    id: 'et2',
    name: 'Payment Reminder',
    subject: 'Friendly reminder: Invoice {{invoice_id}} is due',
    preview: 'Hi {{name}}, just a quick reminder that invoice {{invoice_id}} for ${{amount}} is due on {{due_date}}...',
    trigger: 'invoice_overdue' as TriggerType,
  },
  {
    id: 'et3',
    name: 'Testimonial Request',
    subject: 'How did we do? Would love your feedback',
    preview: 'Hi {{name}}, now that {{project_name}} is wrapped up, I\'d really appreciate a few words about your experience...',
    trigger: 'project_completed' as TriggerType,
  },
]

// ── Suggested built-in automations ───────────────────────────

const SUGGESTED_WORKFLOWS: Omit<Automation, 'id' | 'runCount' | 'lastRun' | 'createdAt'>[] = [
  {
    name: 'Invoice Paid → Thank You Email',
    description: 'Automatically send a thank-you email when an invoice is marked paid.',
    trigger: 'invoice_paid',
    conditions: [],
    enabled: false,
    actions: [
      { type: 'send_email', label: 'Send thank-you email', params: { template: 'payment_thanks' } },
    ],
  },
  {
    name: 'Deal Lost → Follow-up Task',
    description: 'Create a follow-up task 30 days after a deal is lost to reconnect.',
    trigger: 'deal_lost',
    conditions: [],
    enabled: false,
    actions: [
      { type: 'create_task', label: 'Create reconnect task', params: { title: 'Reconnect with lost lead', dueIn: 30 } },
      { type: 'add_tag', label: 'Tag as churned', params: { tag: 'churned' } },
    ],
  },
  {
    name: 'Proposal Rejected → Move Deal to Lost',
    description: 'Automatically move the associated deal to "Lost" when a proposal is rejected.',
    trigger: 'proposal_rejected',
    conditions: [],
    enabled: false,
    actions: [
      { type: 'move_deal', label: 'Move deal to Lost', params: { stage: 'Lost' } },
      { type: 'notify', label: 'Notify via Slack', params: { channel: 'sales' } },
    ],
  },
]

// ── Form types ────────────────────────────────────────────────

type NewWorkflowForm = {
  name: string
  description: string
  trigger: TriggerType
  actions: { type: AutomationActionType; label: string }[]
}

const emptyForm: NewWorkflowForm = {
  name: '',
  description: '',
  trigger: 'deal_won',
  actions: [{ type: 'send_email', label: '' }],
}

// ── Field class ────────────────────────────────────────────────

const field =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

// ─────────────────────────────────────────────────────────────

export default function AutomationPage() {
  const { automations, addAutomation, toggleAutomation, deleteAutomation } = useCRMStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<NewWorkflowForm>(emptyForm)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  // ── Derived stats ────────────────────────────────────────────
  const activeCount = automations.filter((a) => a.enabled).length
  const totalRuns   = automations.reduce((sum, a) => sum + a.runCount, 0)
  const totalMinutes = totalRuns * 15
  const hours   = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const timeSaved = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  // ── Form helpers ─────────────────────────────────────────────
  const updateAction = (idx: number, updates: Partial<{ type: AutomationActionType; label: string }>) => {
    setForm((f) => {
      const actions = [...f.actions]
      actions[idx] = { ...actions[idx], ...updates }
      return { ...f, actions }
    })
  }

  const addAction = () =>
    setForm((f) => ({ ...f, actions: [...f.actions, { type: 'send_email', label: '' }] }))

  const removeAction = (idx: number) =>
    setForm((f) => ({ ...f, actions: f.actions.filter((_, i) => i !== idx) }))

  const handleSave = () => {
    if (!form.name.trim()) return
    const built: AutomationActionConfig[] = form.actions.map((a) => ({
      type: a.type,
      label: a.label || ACTION_TYPE_LABELS[a.type],
      params: {},
    }))
    const newAuto: Automation = {
      id:          `auto-${Date.now()}`,
      name:        form.name,
      description: form.description,
      trigger:     form.trigger,
      conditions:  [],
      actions:     built,
      enabled:     true,
      runCount:    0,
      createdAt:   new Date().toISOString().slice(0, 10),
    }
    addAutomation(newAuto)
    setForm(emptyForm)
    setModalOpen(false)
  }

  const enableSuggested = (suggested: typeof SUGGESTED_WORKFLOWS[number]) => {
    const newAuto: Automation = {
      id:          `auto-${Date.now()}`,
      name:        suggested.name,
      description: suggested.description,
      trigger:     suggested.trigger,
      conditions:  suggested.conditions,
      actions:     suggested.actions as AutomationActionConfig[],
      enabled:     true,
      runCount:    0,
      createdAt:   new Date().toISOString().slice(0, 10),
    }
    addAutomation(newAuto)
  }

  const suggestedNames = new Set(SUGGESTED_WORKFLOWS.map((s) => s.name))
  const alreadyAdded = new Set(automations.map((a) => a.name))

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Automation</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Build workflows that run automatically so you can focus on client work.
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Workflow
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: 'Active Workflows',
            value: activeCount,
            icon: <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            bg:   'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Total Runs',
            value: totalRuns,
            icon: <Play className="h-5 w-5 text-green-600 dark:text-green-400" />,
            bg:   'bg-green-50 dark:bg-green-900/20',
          },
          {
            label: 'Est. Time Saved',
            value: timeSaved,
            icon: <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            bg:   'bg-purple-50 dark:bg-purple-900/20',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Workflow list ───────────────────────────────────── */}
      <div className="space-y-4 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Workflows</h2>

        {automations.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-10 text-center text-gray-500 dark:text-gray-400">
            No workflows yet. Click &quot;New Workflow&quot; to get started.
          </div>
        )}

        {automations.map((auto) => (
          <div
            key={auto.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{auto.name}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TRIGGER_COLORS[auto.trigger]}`}>
                    {TRIGGER_LABELS[auto.trigger]}
                  </span>
                </div>
                {auto.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{auto.description}</p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {auto.actions.map((action, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {ACTION_ICON[action.type]}
                      {action.label || ACTION_TYPE_LABELS[action.type]}
                    </span>
                  ))}
                </div>

                {/* Run stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {auto.runCount} run{auto.runCount !== 1 ? 's' : ''}
                  </span>
                  {auto.lastRun && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last run {auto.lastRun}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: toggle + delete */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => toggleAutomation(auto.id)}
                  className={`transition-colors ${
                    auto.enabled
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                  title={auto.enabled ? 'Disable workflow' : 'Enable workflow'}
                >
                  {auto.enabled
                    ? <ToggleRight className="h-8 w-8" />
                    : <ToggleLeft className="h-8 w-8" />}
                </button>
                <button
                  onClick={() => deleteAutomation(auto.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete workflow"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Email sequences ─────────────────────────────────── */}
      <div className="mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Sequences</h2>
          </div>
          <div className="space-y-4">
            {EMAIL_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{tpl.name}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TRIGGER_COLORS[tpl.trigger]}`}>
                      {TRIGGER_LABELS[tpl.trigger]}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">Subject: {tpl.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{tpl.preview}</p>
                </div>
                <button
                  onClick={() => setPreviewTemplate(previewTemplate === tpl.id ? null : tpl.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex-shrink-0"
                >
                  <Mail className="h-3 w-3" />
                  {previewTemplate === tpl.id ? 'Close' : 'Preview'}
                </button>
              </div>
            ))}
            {previewTemplate && (() => {
              const tpl = EMAIL_TEMPLATES.find((t) => t.id === previewTemplate)!
              return (
                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-gray-100 mb-3">{tpl.subject}</p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Body preview:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tpl.preview}</p>
                  <p className="text-xs text-gray-400 mt-3">Variables in &#123;&#123;double braces&#125;&#125; are replaced automatically at send time.</p>
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* ── Suggested workflows ─────────────────────────────── */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Suggested Workflows</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">One-click to enable</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUGGESTED_WORKFLOWS.map((sw) => {
              const added = alreadyAdded.has(sw.name)
              return (
                <div
                  key={sw.name}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col gap-3"
                >
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{sw.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">{sw.description}</p>
                  </div>
                  <span className={`inline-flex self-start items-center px-2 py-0.5 rounded-full text-xs font-medium ${TRIGGER_COLORS[sw.trigger]}`}>
                    {TRIGGER_LABELS[sw.trigger]}
                  </span>
                  <button
                    onClick={() => !added && enableSuggested(sw)}
                    disabled={added}
                    className={`mt-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      added
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {added ? (
                      <><CheckCircle className="h-3 w-3" /> Added</>
                    ) : (
                      <><Plus className="h-3 w-3" /> Enable Workflow</>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── New Workflow Modal ──────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New Workflow</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workflow Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={field}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Deal Won → Onboard Client"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className={`${field} resize-none h-20`}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe what this workflow does..."
                />
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trigger
                </label>
                <select
                  className={field}
                  value={form.trigger}
                  onChange={(e) => setForm((f) => ({ ...f, trigger: e.target.value as TriggerType }))}
                >
                  {(Object.entries(TRIGGER_LABELS) as [TriggerType, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Actions</label>
                  <button
                    onClick={addAction}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Add action
                  </button>
                </div>
                <div className="space-y-3">
                  {form.actions.map((action, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-shrink-0 mt-2.5 w-5 text-center text-xs text-gray-400 font-mono">{idx + 1}</div>
                      <div className="flex-1 flex gap-2">
                        <select
                          className={`${field} flex-1`}
                          value={action.type}
                          onChange={(e) => updateAction(idx, { type: e.target.value as AutomationActionType })}
                        >
                          {(Object.entries(ACTION_TYPE_LABELS) as [AutomationActionType, string][]).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                        <input
                          className={`${field} flex-1`}
                          value={action.label}
                          onChange={(e) => updateAction(idx, { label: e.target.value })}
                          placeholder="Custom label (optional)"
                        />
                      </div>
                      {form.actions.length > 1 && (
                        <button
                          onClick={() => removeAction(idx)}
                          className="mt-2.5 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
