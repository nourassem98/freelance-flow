'use client'

import { useState } from 'react'
import {
  Plus,
  Send,
  Download,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { FormModal } from '@/components/FormModal'
import { StatusBadge } from '@/components/StatusBadge'
import { sampleInvoices } from '@/lib/crm-data'
import type { Invoice, InvoiceStatus } from '@/lib/crm-types'

type FormState = {
  client: string
  description: string
  amount: string
  status: InvoiceStatus
  dueDate: string
}

const emptyForm: FormState = {
  client: '',
  description: '',
  amount: '',
  status: 'Pending',
  dueDate: '',
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Invoice | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const totalPaid = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((s, i) => s + i.amount, 0)
  const totalOutstanding = invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((s, i) => s + i.amount, 0)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (inv: Invoice) => {
    setEditing(inv)
    setForm({
      client: inv.client,
      description: inv.items[0]?.description ?? '',
      amount: String(inv.amount),
      status: inv.status,
      dueDate: inv.dueDate,
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.client || !form.amount) return
    const amount = parseFloat(form.amount)
    if (editing) {
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === editing.id
            ? {
                ...i,
                client: form.client,
                items: [{ description: form.description, qty: 1, unitPrice: amount }],
                amount,
                status: form.status,
                dueDate: form.dueDate,
              }
            : i
        )
      )
    } else {
      const newInv: Invoice = {
        id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
        client: form.client,
        items: [{ description: form.description, qty: 1, unitPrice: amount }],
        amount,
        status: form.status,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: form.dueDate,
      }
      setInvoices((prev) => [newInv, ...prev])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) =>
    setInvoices((prev) => prev.filter((i) => i.id !== id))

  const field =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Invoices
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Create, send, and track client invoices.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: 'Total Invoices',
            value: invoices.length,
            icon: <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Total Paid',
            value: `$${totalPaid.toLocaleString()}`,
            icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
            bg: 'bg-green-50 dark:bg-green-900/20',
          },
          {
            label: 'Outstanding',
            value: `$${totalOutstanding.toLocaleString()}`,
            icon: <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            All Invoices
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Invoice', 'Client', 'Amount', 'Status', 'Issued', 'Due Date', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 px-6 font-mono text-sm text-gray-900 dark:text-gray-100">
                    {inv.id}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {inv.client}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {inv.issueDate}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {inv.dueDate}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(inv)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Send"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Invoice' : 'New Invoice'}
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
              Service / Description
            </label>
            <input
              className={field}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Website Redesign"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              className={field}
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              className={field}
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as InvoiceStatus }))
              }
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              className={field}
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
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
              {editing ? 'Save Changes' : 'Create Invoice'}
            </button>
          </div>
        </div>
      </FormModal>
    </>
  )
}
