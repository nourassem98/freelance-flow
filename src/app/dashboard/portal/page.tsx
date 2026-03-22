'use client'

import { useState } from 'react'
import {
  Globe,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Users,
  FileText,
  FolderKanban,
  MessageSquare,
  CheckCircle,
  Clock,
  Share2,
  Lock,
  Unlock,
} from 'lucide-react'
import { useCRMStore } from '@/lib/store/index'
import type { Contact, Invoice, Project, TimelineEvent } from '@/lib/types'

// ── Helpers ────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function generateToken(contactId: string): string {
  // Deterministic mock token derived from id
  return btoa(contactId + '-portal').replace(/[=+/]/g, '').slice(0, 16).toLowerCase()
}

function invoiceStatusColor(status: string): string {
  switch (status) {
    case 'Paid':    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}

function projectStatusColor(status: string): string {
  switch (status) {
    case 'Active':    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'On Hold':   return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    default:          return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}

function timelineIcon(type: TimelineEvent['type']): React.ReactNode {
  switch (type) {
    case 'email':   return <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
    case 'call':    return <Share2 className="h-3.5 w-3.5 text-green-500" />
    case 'meeting': return <Users className="h-3.5 w-3.5 text-purple-500" />
    case 'invoice': return <FileText className="h-3.5 w-3.5 text-emerald-500" />
    case 'deal':    return <CheckCircle className="h-3.5 w-3.5 text-yellow-500" />
    default:        return <Clock className="h-3.5 w-3.5 text-gray-400" />
  }
}

// ── Mock last-viewed dates ─────────────────────────────────────

const MOCK_LAST_VIEWED: Record<string, string> = {
  c1: '2026-03-20',
  c2: '2026-03-19',
  c3: '2026-03-17',
  c4: '2026-03-14',
  c5: '2026-03-21',
  c6: '2026-03-18',
  c8: '2026-03-10',
}

// ── PortalDrawer component ─────────────────────────────────────

interface PortalDrawerProps {
  contact: Contact
  invoices: Invoice[]
  projects: Project[]
  onClose: () => void
}

function PortalDrawer({ contact, invoices, projects, onClose }: PortalDrawerProps) {
  const clientInvoices = invoices.filter((inv) => inv.contactId === contact.id)
  const clientProjects = projects.filter((p) => p.contactId === contact.id)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative ml-auto w-full max-w-3xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(contact.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{contact.name}</h2>
              {contact.company && (
                <p className="text-blue-100 text-sm">{contact.company}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Invoices section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Invoices</h3>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({clientInvoices.length})</span>
            </div>
            {clientInvoices.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                No invoices for this client.
              </p>
            ) : (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                      {['Invoice ID', 'Amount', 'Status', 'Due Date', ''].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clientInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">{inv.id}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                          ${inv.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${invoiceStatusColor(inv.status)}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{inv.dueDate}</td>
                        <td className="py-3 px-4">
                          <button className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                            <FileText className="h-3 w-3" /> Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Projects section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Projects</h3>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({clientProjects.length})</span>
            </div>
            {clientProjects.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                No projects for this client.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clientProjects.map((proj) => {
                  const doneTasks  = proj.tasks.filter((t) => t.status === 'Done').length
                  const totalTasks = proj.tasks.length
                  const pct        = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
                  return (
                    <div
                      key={proj.id}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{proj.name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${projectStatusColor(proj.status)}`}>
                          {proj.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {doneTasks}/{totalTasks} tasks
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        Deadline: {proj.deadline}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Communication history */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Communication History</h3>
            </div>
            {contact.timeline.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                No communication history yet.
              </p>
            ) : (
              <div className="space-y-3">
                {contact.timeline.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1 h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      {timelineIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800/60 rounded-xl rounded-tl-sm px-4 py-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.title}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{event.date}</span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────

export default function PortalPage() {
  const { contacts, invoices, projects } = useCRMStore()

  // Only show Active contacts
  const portalContacts = contacts.filter((c) => c.status === 'Active')

  // Per-contact portal enabled state (local)
  const [portalEnabled, setPortalEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(portalContacts.map((c) => [c.id, true]))
  )

  const [viewingContact, setViewingContact] = useState<Contact | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const togglePortal = (contactId: string) =>
    setPortalEnabled((prev) => ({ ...prev, [contactId]: !prev[contactId] }))

  const handleCopy = (contactId: string) => {
    const token   = generateToken(contactId)
    const url     = `https://app.freelanceflow.io/portal/${token}`
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiedId(contactId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // ── Derived stats ─────────────────────────────────────────
  const activePortals = Object.values(portalEnabled).filter(Boolean).length

  const portalContactIds = new Set(portalContacts.map((c) => c.id))
  const openInvoices = invoices.filter(
    (inv) =>
      inv.contactId &&
      portalContactIds.has(inv.contactId) &&
      (inv.status === 'Pending' || inv.status === 'Overdue')
  ).length

  const activeProjects = projects.filter(
    (p) =>
      p.contactId &&
      portalContactIds.has(p.contactId) &&
      p.status === 'Active'
  ).length

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Client Portal</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Give clients a dedicated view of their projects and invoices.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">app.freelanceflow.io/portal</span>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: 'Active Portals',
            value: activePortals,
            icon:  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            bg:    'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Open Invoices',
            value: openInvoices,
            icon:  <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
            bg:    'bg-yellow-50 dark:bg-yellow-900/20',
          },
          {
            label: 'Active Projects',
            value: activeProjects,
            icon:  <FolderKanban className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
            bg:    'bg-indigo-50 dark:bg-indigo-900/20',
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

      {/* ── Portal list ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Client Portals</h2>
          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">({portalContacts.length} active clients)</span>
        </div>

        {portalContacts.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            No active clients found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {portalContacts.map((contact) => {
              const enabled   = portalEnabled[contact.id] ?? true
              const token     = generateToken(contact.id)
              const portalUrl = `https://app.freelanceflow.io/portal/${token}`
              const lastViewed = MOCK_LAST_VIEWED[contact.id]

              const clientInvoiceCount = invoices.filter((inv) => inv.contactId === contact.id).length
              const clientProjectCount = projects.filter((p) => p.contactId === contact.id).length

              return (
                <div
                  key={contact.id}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    !enabled ? 'opacity-60' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(contact.name)}
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{contact.name}</span>
                      {contact.company && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">{contact.company}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {clientInvoiceCount} invoice{clientInvoiceCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FolderKanban className="h-3 w-3" /> {clientProjectCount} project{clientProjectCount !== 1 ? 's' : ''}
                      </span>
                      {lastViewed && enabled && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Eye className="h-3 w-3" /> Last viewed {lastViewed}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Portal link */}
                  {enabled && (
                    <div className="hidden md:flex items-center gap-1 max-w-xs">
                      <span className="text-xs font-mono text-gray-400 dark:text-gray-500 truncate">
                        {portalUrl}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Copy link */}
                    <button
                      onClick={() => handleCopy(contact.id)}
                      disabled={!enabled}
                      title="Copy portal link"
                      className={`p-2 rounded-lg border transition-colors ${
                        copiedId === contact.id
                          ? 'border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {copiedId === contact.id
                        ? <CheckCircle className="h-4 w-4" />
                        : <Copy className="h-4 w-4" />}
                    </button>

                    {/* View portal */}
                    <button
                      onClick={() => setViewingContact(contact)}
                      disabled={!enabled}
                      title="View portal"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Portal
                    </button>

                    {/* Enable / disable toggle */}
                    <button
                      onClick={() => togglePortal(contact.id)}
                      title={enabled ? 'Disable portal' : 'Enable portal'}
                      className={`p-2 rounded-lg border transition-colors ${
                        enabled
                          ? 'border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {enabled
                        ? <Unlock className="h-4 w-4" />
                        : <Lock className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── How it works info banner ────────────────────────── */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
        <div className="flex items-start gap-3">
          <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">How client portals work</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Each active client gets a unique, secure URL at{' '}
              <span className="font-mono text-blue-700 dark:text-blue-300">app.freelanceflow.io/portal/[token]</span>.
              Share the link directly — clients can view their invoices, project progress, and message history without needing an account.
              Disable the portal at any time to revoke access.
            </p>
          </div>
        </div>
      </div>

      {/* ── Portal drawer overlay ───────────────────────────── */}
      {viewingContact && (
        <PortalDrawer
          contact={viewingContact}
          invoices={invoices}
          projects={projects}
          onClose={() => setViewingContact(null)}
        />
      )}
    </>
  )
}
