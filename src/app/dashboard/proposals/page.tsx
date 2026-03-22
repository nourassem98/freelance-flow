'use client'

import { useState } from 'react'
import {
  FileText,
  Plus,
  Send,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  FolderKanban,
  Copy,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { FormModal } from '@/components/FormModal'
import { useCRMStore } from '@/lib/store/index'
import { sampleTemplates } from '@/lib/sample-data'
import type { Proposal, ProposalStatus, ProposalItem, ProposalTemplate } from '@/lib/types'

// ── Helpers ──────────────────────────────────────────────────

const field =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

const STATUS_COLORS: Record<ProposalStatus, string> = {
  Draft:    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  Sent:     'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  Viewed:   'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  Accepted: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  Rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  Expired:  'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400',
}

const CATEGORY_COLORS: Record<string, string> = {
  Development: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Design:      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Marketing:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Retainer:    'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  Consulting:  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
}

function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? STATUS_COLORS.Draft}`}>
      {status}
    </span>
  )
}

function newItemId() {
  return `pi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ── Form state ────────────────────────────────────────────────

type LineItem = { id: string; description: string; qty: string; unitPrice: string }

interface ProposalForm {
  title: string
  clientName: string
  validUntil: string
  notes: string
  terms: string
  status: ProposalStatus
  items: LineItem[]
}

const emptyForm = (): ProposalForm => ({
  title: '',
  clientName: '',
  validUntil: '',
  notes: '',
  terms: '',
  status: 'Draft',
  items: [{ id: newItemId(), description: '', qty: '1', unitPrice: '' }],
})

function formFromProposal(p: Proposal): ProposalForm {
  return {
    title: p.title,
    clientName: p.clientName,
    validUntil: p.validUntil,
    notes: p.notes ?? '',
    terms: p.terms ?? '',
    status: p.status,
    items: p.items.map((item) => ({
      id: item.id,
      description: item.description,
      qty: String(item.qty),
      unitPrice: String(item.unitPrice),
    })),
  }
}

function formFromTemplate(t: ProposalTemplate): ProposalForm {
  return {
    title: t.name,
    clientName: '',
    validUntil: '',
    notes: '',
    terms: t.terms ?? '',
    status: 'Draft',
    items: t.items.map((item) => ({
      id: newItemId(),
      description: item.description,
      qty: String(item.qty),
      unitPrice: String(item.unitPrice),
    })),
  }
}

function lineItemTotal(item: LineItem): number {
  const qty = parseFloat(item.qty) || 0
  const price = parseFloat(item.unitPrice) || 0
  return qty * price
}

function formTotal(items: LineItem[]): number {
  return items.reduce((sum, i) => sum + lineItemTotal(i), 0)
}

// ── Filter tabs ───────────────────────────────────────────────

const STATUS_FILTERS: Array<ProposalStatus | 'All'> = [
  'All', 'Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected',
]

// ── Page ──────────────────────────────────────────────────────

export default function ProposalsPage() {
  const { proposals, addProposal, updateProposal, deleteProposal, addInvoice, addProject } = useCRMStore()

  const [filter, setFilter] = useState<ProposalStatus | 'All'>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Proposal | null>(null)
  const [form, setForm] = useState<ProposalForm>(emptyForm())
  const [previewProposal, setPreviewProposal] = useState<Proposal | null>(null)

  // ── Stats ──────────────────────────────────────────────────
  const total = proposals.length
  const sent = proposals.filter((p) => p.status === 'Sent' || p.status === 'Viewed' || p.status === 'Accepted' || p.status === 'Rejected' || p.status === 'Expired').length
  const accepted = proposals.filter((p) => p.status === 'Accepted').length
  const conversionRate = sent > 0 ? Math.round((accepted / sent) * 100) : 0

  // ── Filtered list ─────────────────────────────────────────
  const filtered = filter === 'All' ? proposals : proposals.filter((p) => p.status === filter)

  // ── Modal helpers ─────────────────────────────────────────
  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  const openEdit = (p: Proposal) => {
    setEditing(p)
    setForm(formFromProposal(p))
    setModalOpen(true)
  }

  const openFromTemplate = (t: ProposalTemplate) => {
    setEditing(null)
    setForm(formFromTemplate(t))
    setModalOpen(true)
  }

  // ── Line item handlers ────────────────────────────────────
  const addLineItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: newItemId(), description: '', qty: '1', unitPrice: '' }],
    }))

  const removeLineItem = (id: string) =>
    setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }))

  const updateLineItem = (id: string, field: keyof LineItem, value: string) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }))

  // ── Save ──────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.title || !form.clientName) return
    const total = formTotal(form.items)
    const items: ProposalItem[] = form.items.map((i) => ({
      id: i.id,
      description: i.description,
      qty: parseFloat(i.qty) || 1,
      unitPrice: parseFloat(i.unitPrice) || 0,
    }))

    if (editing) {
      updateProposal(editing.id, {
        title: form.title,
        clientName: form.clientName,
        validUntil: form.validUntil,
        notes: form.notes,
        terms: form.terms,
        status: form.status,
        items,
        total,
      })
    } else {
      const newProposal: Proposal = {
        id: `prop-${Date.now()}`,
        title: form.title,
        clientName: form.clientName,
        status: form.status,
        items,
        total,
        validUntil: form.validUntil,
        createdAt: new Date().toISOString().slice(0, 10),
        notes: form.notes,
        terms: form.terms,
      }
      addProposal(newProposal)
    }
    setModalOpen(false)
  }

  // ── Convert to Invoice ────────────────────────────────────
  const handleConvertToInvoice = (p: Proposal) => {
    const invoiceId = `INV-${Date.now()}`
    addInvoice({
      id: invoiceId,
      client: p.clientName,
      items: p.items,
      amount: p.total,
      status: 'Pending',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: p.validUntil,
      fromProposalId: p.id,
    })
    updateProposal(p.id, { convertedToInvoiceId: invoiceId })
    alert(`Invoice ${invoiceId} created for ${p.clientName}.`)
  }

  // ── Convert to Project ────────────────────────────────────
  const handleConvertToProject = (p: Proposal) => {
    const projectId = `proj-${Date.now()}`
    addProject({
      id: projectId,
      name: p.title,
      client: p.clientName,
      status: 'Active',
      deadline: p.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      budget: p.total,
      tasks: [],
      fromProposalId: p.id,
    })
    updateProposal(p.id, { convertedToProjectId: projectId })
    alert(`Project "${p.title}" created.`)
  }

  // ── Send ──────────────────────────────────────────────────
  const handleSend = (p: Proposal) => {
    updateProposal(p.id, {
      status: 'Sent',
      sentAt: new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Proposals & Contracts
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create, send, and track client proposals.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          New Proposal
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Proposals',
            value: total,
            icon: <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Sent',
            value: sent,
            icon: <Send className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          },
          {
            label: 'Accepted',
            value: accepted,
            icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
            bg: 'bg-green-50 dark:bg-green-900/20',
          },
          {
            label: 'Conversion Rate',
            value: `${conversionRate}%`,
            icon: <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {s}
            {s !== 'All' && (
              <span className="ml-1.5 text-xs opacity-75">
                {proposals.filter((p) => p.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Proposals list */}
      <div className="space-y-4 mb-12">
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
            <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No proposals found.</p>
          </div>
        )}
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {p.title}
                  </h3>
                  <ProposalStatusBadge status={p.status} />
                  {p.convertedToInvoiceId && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                      Invoice created
                    </span>
                  )}
                  {p.convertedToProjectId && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
                      Project created
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{p.clientName}</span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {p.total.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Created {p.createdAt}
                  </span>
                  {p.validUntil && (
                    <span>Valid until {p.validUntil}</span>
                  )}
                </div>
                {/* Item summary */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.items.slice(0, 3).map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {item.description}
                    </span>
                  ))}
                  {p.items.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      +{p.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setPreviewProposal(p)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                {p.status === 'Draft' && (
                  <button
                    onClick={() => handleSend(p)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" /> Send
                  </button>
                )}
                {p.status === 'Accepted' && !p.convertedToInvoiceId && (
                  <button
                    onClick={() => handleConvertToInvoice(p)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <DollarSign className="h-3.5 w-3.5" /> To Invoice
                  </button>
                )}
                {p.status === 'Accepted' && !p.convertedToProjectId && (
                  <button
                    onClick={() => handleConvertToProject(p)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <FolderKanban className="h-3.5 w-3.5" /> To Project
                  </button>
                )}
                <button
                  onClick={() => deleteProposal(p.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Gallery */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Template Gallery
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleTemplates.map((t) => {
            const templateTotal = t.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)
            const catColor = CATEGORY_COLORS[t.category] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
            return (
              <div
                key={t.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</h3>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Copy className="h-3.5 w-3.5" />
                    {t.items.length} items
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {templateTotal.toLocaleString()} total
                  </span>
                </div>
                <button
                  onClick={() => openFromTemplate(t)}
                  className="mt-auto flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use Template <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* New / Edit Proposal Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Proposal' : 'New Proposal'}
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proposal Title <span className="text-red-500">*</span>
            </label>
            <input
              className={field}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Website Redesign Proposal"
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              className={field}
              value={form.clientName}
              onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
              placeholder="e.g. Acme Corp"
            />
          </div>

          {/* Valid until + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                className={field}
                value={form.validUntil}
                onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                className={field}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProposalStatus }))}
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Viewed">Viewed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Line Items
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add item
              </button>
            </div>
            <div className="space-y-2">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
                <span className="col-span-6">Description</span>
                <span className="col-span-2">Qty</span>
                <span className="col-span-3">Unit Price</span>
                <span className="col-span-1" />
              </div>
              {form.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-1.5 items-center">
                  <input
                    className={`col-span-6 ${field}`}
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    className={`col-span-2 ${field}`}
                    value={item.qty}
                    min="1"
                    onChange={(e) => updateLineItem(item.id, 'qty', e.target.value)}
                  />
                  <input
                    type="number"
                    className={`col-span-3 ${field}`}
                    value={item.unitPrice}
                    placeholder="0"
                    onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    disabled={form.items.length === 1}
                    className="col-span-1 p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="mt-3 flex justify-end">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total: </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  ${formTotal(form.items).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className={`${field} resize-none`}
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Additional notes for the client..."
            />
          </div>

          {/* Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Terms & Conditions
            </label>
            <textarea
              className={`${field} resize-none`}
              rows={2}
              value={form.terms}
              onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
              placeholder="e.g. Net 30. 50% upfront required."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title || !form.clientName}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {editing ? 'Save Changes' : 'Create Proposal'}
            </button>
          </div>
        </div>
      </FormModal>

      {/* Preview Modal */}
      <FormModal
        isOpen={!!previewProposal}
        onClose={() => setPreviewProposal(null)}
        title="Proposal Preview"
      >
        {previewProposal && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Proposal</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {previewProposal.title}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Client</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{previewProposal.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <ProposalStatusBadge status={previewProposal.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-gray-700 dark:text-gray-300">{previewProposal.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Valid Until</p>
                <p className="text-gray-700 dark:text-gray-300">{previewProposal.validUntil || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Line Items</p>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Description</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Qty</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Price</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewProposal.items.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.description}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{item.qty}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-gray-100">${(item.qty * item.unitPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <td colSpan={3} className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Total</td>
                      <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-gray-100">${previewProposal.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {previewProposal.notes && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">{previewProposal.notes}</p>
              </div>
            )}
            {previewProposal.terms && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Terms</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">{previewProposal.terms}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPreviewProposal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  openEdit(previewProposal)
                  setPreviewProposal(null)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </FormModal>
    </>
  )
}
