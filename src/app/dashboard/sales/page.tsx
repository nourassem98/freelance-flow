'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronRight, ChevronLeft, DollarSign } from 'lucide-react'
import { FormModal } from '@/components/FormModal'
import { StatusBadge } from '@/components/StatusBadge'
import { sampleDeals } from '@/lib/crm-data'
import type { Deal, DealStage } from '@/lib/crm-types'

const STAGES: DealStage[] = ['New Lead', 'Contacted', 'Negotiation', 'Won', 'Lost']

const stageBorder: Record<DealStage, string> = {
  'New Lead':    'border-t-purple-500',
  'Contacted':   'border-t-sky-500',
  'Negotiation': 'border-t-orange-500',
  'Won':         'border-t-green-500',
  'Lost':        'border-t-red-500',
}

type FormState = { client: string; value: string; notes: string; stage: DealStage }
const emptyForm: FormState = { client: '', value: '', notes: '', stage: 'New Lead' }

export default function SalesPage() {
  const [deals, setDeals] = useState<Deal[]>(sampleDeals)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Deal | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const totalPipeline = deals
    .filter((d) => d.stage !== 'Lost')
    .reduce((s, d) => s + d.value, 0)
  const totalWon = deals
    .filter((d) => d.stage === 'Won')
    .reduce((s, d) => s + d.value, 0)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (deal: Deal) => {
    setEditing(deal)
    setForm({
      client: deal.client,
      value: String(deal.value),
      notes: deal.notes,
      stage: deal.stage,
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.client) return
    if (editing) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === editing.id
            ? {
                ...d,
                client: form.client,
                value: parseFloat(form.value) || 0,
                notes: form.notes,
                stage: form.stage,
              }
            : d
        )
      )
    } else {
      setDeals((prev) => [
        ...prev,
        {
          id: `d${Date.now()}`,
          client: form.client,
          value: parseFloat(form.value) || 0,
          notes: form.notes,
          stage: form.stage,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ])
    }
    setModalOpen(false)
  }

  const moveStage = (deal: Deal, dir: 1 | -1) => {
    const idx = STAGES.indexOf(deal.stage)
    const next = STAGES[idx + dir]
    if (next)
      setDeals((prev) => prev.map((d) => (d.id === deal.id ? { ...d, stage: next } : d)))
  }

  const deleteDeal = (id: string) => setDeals((prev) => prev.filter((d) => d.id !== id))

  const field =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Sales Pipeline
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track leads and deals through your pipeline.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Deal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Deals',    value: deals.length,                   color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Pipeline Value', value: `$${totalPipeline.toLocaleString()}`, color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Revenue Won',    value: `$${totalWon.toLocaleString()}`, color: 'text-green-600 dark:text-green-400' },
        ].map((s) => (
          <div
            key={s.label}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`h-5 w-5 ${s.color}`} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {s.label}
              </span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage)
          return (
            <div key={stage} className="flex-shrink-0 w-64">
              <div
                className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-t-4 ${stageBorder[stage]} shadow-sm`}
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {stage}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <StatusBadge status={stage} showIcon={false} />
                </div>

                <div className="p-3 space-y-3 min-h-32">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {deal.client}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {deal.notes}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2">
                        ${deal.value.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveStage(deal, -1)}
                            disabled={STAGES.indexOf(deal.stage) === 0}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition-colors"
                            title="Move back"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveStage(deal, 1)}
                            disabled={STAGES.indexOf(deal.stage) === STAGES.length - 1}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition-colors"
                            title="Move forward"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(deal)}
                            className="p-1 rounded text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDeal(deal.id)}
                            className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Deal' : 'New Deal'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Name
            </label>
            <input
              className={field}
              value={form.client}
              onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deal Value ($)
            </label>
            <input
              type="number"
              className={field}
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stage
            </label>
            <select
              className={field}
              value={form.stage}
              onChange={(e) =>
                setForm((f) => ({ ...f, stage: e.target.value as DealStage }))
              }
            >
              {STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className={`${field} resize-none h-24`}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Add notes about this deal..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editing ? 'Save Changes' : 'Add Deal'}
            </button>
          </div>
        </div>
      </FormModal>
    </>
  )
}
