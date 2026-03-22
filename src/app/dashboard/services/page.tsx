'use client'

import { useState } from 'react'
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Clock,
  Tag,
  ToggleLeft,
  ToggleRight,
  Layers,
  Zap,
} from 'lucide-react'
import { FormModal } from '@/components/FormModal'
import { useCRMStore } from '@/lib/store/index'
import type { Service, PriceType } from '@/lib/types'

// ── Helpers ──────────────────────────────────────────────────

const field =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

const CATEGORY_PRESETS = ['Design', 'Development', 'Marketing', 'Retainer', 'Consulting']

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Design:      { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  Development: { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-400' },
  Marketing:   { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-400' },
  Retainer:    { bg: 'bg-indigo-100 dark:bg-indigo-900/30',text: 'text-indigo-700 dark:text-indigo-400' },
  Consulting:  { bg: 'bg-orange-100 dark:bg-orange-900/30',text: 'text-orange-700 dark:text-orange-400' },
}

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <Tag className="h-2.5 w-2.5" />
      {category}
    </span>
  )
}

function formatPrice(price: number, type: PriceType): string {
  const formatted = `$${price.toLocaleString()}`
  if (type === 'hourly') return `${formatted}/hr`
  if (type === 'monthly') return `${formatted}/mo`
  return formatted
}

// ── Form state ────────────────────────────────────────────────

interface ServiceForm {
  name: string
  category: string
  description: string
  defaultPrice: string
  priceType: PriceType
  estimatedHours: string
  active: boolean
}

const emptyForm = (): ServiceForm => ({
  name: '',
  category: 'Development',
  description: '',
  defaultPrice: '',
  priceType: 'fixed',
  estimatedHours: '',
  active: true,
})

function formFromService(s: Service): ServiceForm {
  return {
    name: s.name,
    category: s.category,
    description: s.description,
    defaultPrice: String(s.defaultPrice),
    priceType: s.priceType,
    estimatedHours: s.estimatedHours != null ? String(s.estimatedHours) : '',
    active: s.active,
  }
}

// ── Quick Invoice Modal ───────────────────────────────────────

interface QuickInvoiceState {
  service: Service
  clientName: string
  quantity: string
}

// ── Page ──────────────────────────────────────────────────────

export default function ServicesPage() {
  const { services, addService, updateService, deleteService, addInvoice } = useCRMStore()

  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceForm>(emptyForm())
  const [quickInvoice, setQuickInvoice] = useState<QuickInvoiceState | null>(null)

  // ── Derived data ──────────────────────────────────────────
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category))).sort()]
  const activeCount = services.filter((s) => s.active).length
  const categoryCount = new Set(services.map((s) => s.category)).size

  const filtered =
    categoryFilter === 'All' ? services : services.filter((s) => s.category === categoryFilter)

  // ── Modal helpers ─────────────────────────────────────────
  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  const openEdit = (s: Service) => {
    setEditing(s)
    setForm(formFromService(s))
    setModalOpen(true)
  }

  // ── Save ──────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.name || !form.defaultPrice) return
    const data: Omit<Service, 'id'> = {
      name: form.name,
      category: form.category,
      description: form.description,
      defaultPrice: parseFloat(form.defaultPrice) || 0,
      priceType: form.priceType,
      estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : undefined,
      active: form.active,
    }
    if (editing) {
      updateService(editing.id, data)
    } else {
      addService({ id: `svc-${Date.now()}`, ...data })
    }
    setModalOpen(false)
  }

  // ── Toggle active ─────────────────────────────────────────
  const handleToggle = (s: Service) => {
    updateService(s.id, { active: !s.active })
  }

  // ── Quick Invoice ─────────────────────────────────────────
  const openQuickInvoice = (s: Service) => {
    setQuickInvoice({ service: s, clientName: '', quantity: '1' })
  }

  const handleCreateInvoice = () => {
    if (!quickInvoice || !quickInvoice.clientName) return
    const { service, clientName, quantity } = quickInvoice
    const qty = parseFloat(quantity) || 1
    const unitPrice = service.defaultPrice
    const amount = qty * unitPrice

    const invoiceId = `INV-${Date.now()}`
    addInvoice({
      id: invoiceId,
      client: clientName,
      items: [
        {
          id: `li-${Date.now()}`,
          description: service.name,
          qty,
          unitPrice,
        },
      ],
      amount,
      status: 'Pending',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    })
    setQuickInvoice(null)
    alert(`Invoice ${invoiceId} created for ${clientName} — $${amount.toLocaleString()}.`)
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Service Catalog
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your services and pricing.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Services',
            value: services.length,
            icon: <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Active Services',
            value: activeCount,
            icon: <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />,
            bg: 'bg-green-50 dark:bg-green-900/20',
          },
          {
            label: 'Categories',
            value: categoryCount,
            icon: <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            bg: 'bg-purple-50 dark:bg-purple-900/20',
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

      {/* Category filter tabs */}
      <div className="flex items-center gap-1 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 text-xs opacity-75">
                {services.filter((s) => s.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Services grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
          <Package className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No services found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onEdit={() => openEdit(s)}
              onDelete={() => deleteService(s.id)}
              onToggle={() => handleToggle(s)}
              onAddToInvoice={() => openQuickInvoice(s)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Service' : 'Add Service'}
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              className={field}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Website Design"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CATEGORY_PRESETS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    form.category === cat
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              className={field}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Or type a custom category"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className={`${field} resize-none`}
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description of this service..."
            />
          </div>

          {/* Price + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={field}
                value={form.defaultPrice}
                onChange={(e) => setForm((f) => ({ ...f, defaultPrice: e.target.value }))}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Type
              </label>
              <select
                className={field}
                value={form.priceType}
                onChange={(e) => setForm((f) => ({ ...f, priceType: e.target.value as PriceType }))}
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Estimated Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estimated Hours (optional)
            </label>
            <input
              type="number"
              className={field}
              value={form.estimatedHours}
              onChange={(e) => setForm((f) => ({ ...f, estimatedHours: e.target.value }))}
              placeholder="e.g. 20"
              min="0"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Show in service catalog</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className="transition-colors"
            >
              {form.active ? (
                <ToggleRight className="h-8 w-8 text-blue-600" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-gray-400" />
              )}
            </button>
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
              disabled={!form.name || !form.defaultPrice}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {editing ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </div>
      </FormModal>

      {/* Quick Invoice Modal */}
      <FormModal
        isOpen={!!quickInvoice}
        onClose={() => setQuickInvoice(null)}
        title="Add to Invoice"
      >
        {quickInvoice && (
          <div className="space-y-4">
            {/* Service summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {quickInvoice.service.name}
                </p>
                <CategoryBadge category={quickInvoice.service.category} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatPrice(quickInvoice.service.defaultPrice, quickInvoice.service.priceType)}
              </p>
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                className={field}
                value={quickInvoice.clientName}
                onChange={(e) =>
                  setQuickInvoice((q) => q ? { ...q, clientName: e.target.value } : null)
                }
                placeholder="e.g. Acme Corp"
              />
            </div>

            {/* Quantity */}
            {quickInvoice.service.priceType !== 'fixed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {quickInvoice.service.priceType === 'hourly' ? 'Hours' : 'Months'}
                </label>
                <input
                  type="number"
                  className={field}
                  value={quickInvoice.quantity}
                  min="1"
                  onChange={(e) =>
                    setQuickInvoice((q) => q ? { ...q, quantity: e.target.value } : null)
                  }
                />
              </div>
            )}

            {/* Total preview */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-400">Invoice Total</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                ${(
                  quickInvoice.service.defaultPrice * (parseFloat(quickInvoice.quantity) || 1)
                ).toLocaleString()}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setQuickInvoice(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={!quickInvoice.clientName}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                Create Invoice
              </button>
            </div>
          </div>
        )}
      </FormModal>
    </>
  )
}

// ── ServiceCard component ─────────────────────────────────────

interface ServiceCardProps {
  service: Service
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
  onAddToInvoice: () => void
}

function ServiceCard({ service, onEdit, onDelete, onToggle, onAddToInvoice }: ServiceCardProps) {
  const catColors = CATEGORY_COLORS[service.category] ?? {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-400',
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-5 flex flex-col gap-4 transition-opacity ${
        service.active
          ? 'border-gray-200 dark:border-gray-800'
          : 'border-gray-100 dark:border-gray-800 opacity-60'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg ${catColors.bg}`}>
              <Package className={`h-4 w-4 ${catColors.text}`} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {service.name}
            </h3>
          </div>
          <CategoryBadge category={service.category} />
        </div>
        {/* Active toggle */}
        <button
          onClick={onToggle}
          title={service.active ? 'Deactivate' : 'Activate'}
          className="flex-shrink-0 transition-colors"
        >
          {service.active ? (
            <ToggleRight className="h-7 w-7 text-blue-600" />
          ) : (
            <ToggleLeft className="h-7 w-7 text-gray-400" />
          )}
        </button>
      </div>

      {/* Description */}
      {service.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {service.description}
        </p>
      )}

      {/* Price + hours */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(service.defaultPrice, service.priceType)}
          </span>
        </div>
        {service.estimatedHours != null && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {service.estimatedHours}h est.
          </div>
        )}
      </div>

      {/* Price type pill */}
      <div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
          {service.priceType}
        </span>
        {!service.active && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Inactive
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={onAddToInvoice}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <DollarSign className="h-3.5 w-3.5" /> Add to Invoice
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
