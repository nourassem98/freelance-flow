'use client'

import { useState, useMemo } from 'react'
import {
  Users, Plus, Search, Mail, Phone, Calendar, FileText,
  DollarSign, Sparkles, Tag, X, ChevronRight, Edit2, Trash2, Clock,
} from 'lucide-react'
import { FormModal } from '@/components/FormModal'
import { useCRMStore } from '@/lib/store/index'
import type { Contact, ContactStatus, TimelineEvent } from '@/lib/types'

// ─── helpers ────────────────────────────────────────────────────────────────

const field =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function avatarColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return colors[hash % colors.length]
}

function statusColor(status: ContactStatus) {
  switch (status) {
    case 'Active':   return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
    case 'Lead':     return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
    case 'Inactive': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
}

function timelineIcon(type: TimelineEvent['type']) {
  const cls = 'h-4 w-4'
  switch (type) {
    case 'note':    return <FileText className={cls} />
    case 'email':   return <Mail className={cls} />
    case 'call':    return <Phone className={cls} />
    case 'meeting': return <Calendar className={cls} />
    case 'invoice': return <DollarSign className={cls} />
    case 'deal':    return <Sparkles className={cls} />
    default:        return <Clock className={cls} />
  }
}

function timelineIconBg(type: TimelineEvent['type']) {
  switch (type) {
    case 'note':     return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    case 'email':    return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
    case 'call':     return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
    case 'meeting':  return 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
    case 'invoice':  return 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'
    case 'deal':     return 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400'
    default:         return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
}

// ─── types ───────────────────────────────────────────────────────────────────

interface ContactForm {
  name: string
  email: string
  phone: string
  company: string
  tags: string
  status: ContactStatus
  notes: string
}

const emptyForm: ContactForm = {
  name: '', email: '', phone: '', company: '',
  tags: '', status: 'Lead', notes: '',
}

// ─── component ───────────────────────────────────────────────────────────────

export default function CRMPage() {
  const { contacts, addContact, updateContact, deleteContact } = useCRMStore()

  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | ContactStatus>('All')
  const [tagFilter, setTagFilter]       = useState('')

  const [modalOpen, setModalOpen]       = useState(false)
  const [editing, setEditing]           = useState<Contact | null>(null)
  const [form, setForm]                 = useState<ContactForm>(emptyForm)

  const [panelContact, setPanelContact] = useState<Contact | null>(null)
  const [noteText, setNoteText]         = useState('')

  // ── derived stats
  const stats = useMemo(() => {
    const totalRevenue = contacts.reduce((s, c) => s + (c.totalRevenue ?? 0), 0)
    return {
      total:   contacts.length,
      active:  contacts.filter((c) => c.status === 'Active').length,
      leads:   contacts.filter((c) => c.status === 'Lead').length,
      revenue: totalRevenue,
    }
  }, [contacts])

  // ── all unique tags across contacts
  const allTags = useMemo(() => {
    const set = new Set<string>()
    contacts.forEach((c) => c.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [contacts])

  // ── filtered contacts
  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company ?? '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || c.status === statusFilter
      const matchTag    = !tagFilter || c.tags.includes(tagFilter)
      return matchSearch && matchStatus && matchTag
    })
  }, [contacts, search, statusFilter, tagFilter])

  // ── open create modal
  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  // ── open edit modal
  const openEdit = (c: Contact) => {
    setEditing(c)
    setForm({
      name:    c.name,
      email:   c.email,
      phone:   c.phone  ?? '',
      company: c.company ?? '',
      tags:    c.tags.join(', '),
      status:  c.status,
      notes:   c.notes  ?? '',
    })
    setModalOpen(true)
  }

  // ── save (create or update)
  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return
    const tagList = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (editing) {
      updateContact(editing.id, {
        name:    form.name.trim(),
        email:   form.email.trim(),
        phone:   form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        tags:    tagList,
        status:  form.status,
        notes:   form.notes.trim() || undefined,
      })
    } else {
      const newContact: Contact = {
        id:           `c${Date.now()}`,
        name:         form.name.trim(),
        email:        form.email.trim(),
        phone:        form.phone.trim() || undefined,
        company:      form.company.trim() || undefined,
        tags:         tagList,
        status:       form.status,
        notes:        form.notes.trim() || undefined,
        createdAt:    new Date().toISOString().split('T')[0],
        totalRevenue: 0,
        timeline:     [],
      }
      addContact(newContact)
    }
    setModalOpen(false)
  }

  // ── delete with confirmation
  const handleDelete = (id: string) => {
    if (confirm('Delete this contact? This cannot be undone.')) {
      deleteContact(id)
      if (panelContact?.id === id) setPanelContact(null)
    }
  }

  // ── add note to timeline
  const handleAddNote = () => {
    if (!panelContact || !noteText.trim()) return
    const newEvent: TimelineEvent = {
      id:          `ev${Date.now()}`,
      contactId:   panelContact.id,
      type:        'note',
      title:       noteText.trim(),
      date:        new Date().toISOString().split('T')[0],
    }
    const updatedTimeline = [...(panelContact.timeline ?? []), newEvent]
    updateContact(panelContact.id, { timeline: updatedTimeline })
    // reflect in panel without re-opening
    setPanelContact((prev) =>
      prev ? { ...prev, timeline: updatedTimeline } : prev
    )
    setNoteText('')
  }

  const f = (key: keyof ContactForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            CRM &amp; Contacts
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your clients, leads, and relationships.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Contacts', value: stats.total,  icon: Users,       color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Active Clients', value: stats.active, icon: ChevronRight, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Leads',          value: stats.leads,  icon: Tag,          color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Total Revenue',  value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
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

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Status filter */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['All', 'Active', 'Lead', 'Inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {/* Tag filter */}
        <select
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {(search || statusFilter !== 'All' || tagFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('All'); setTagFilter('') }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* ── Contact grid ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No contacts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              {/* Avatar + name + company */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 h-11 w-11 rounded-full ${avatarColor(contact.name)} flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {initials(contact.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {contact.name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  {contact.company && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {contact.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium"
                    >
                      <Tag className="h-2.5 w-2.5" />{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Revenue + last contact */}
              <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-800 pt-3">
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-semibold">
                  <DollarSign className="h-3.5 w-3.5 text-green-500" />
                  {(contact.totalRevenue ?? 0).toLocaleString()}
                </div>
                {contact.lastContact && (
                  <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
                    <Clock className="h-3 w-3" />
                    {contact.lastContact}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setPanelContact(contact); setNoteText('') }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  View Timeline
                </button>
                <button
                  onClick={() => openEdit(contact)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Timeline slide-out panel ───────────────────────────── */}
      {panelContact && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30 backdrop-blur-sm"
            onClick={() => setPanelContact(null)}
          />
          {/* Panel */}
          <div className="w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-full ${avatarColor(panelContact.name)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                >
                  {initials(panelContact.name)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {panelContact.name}
                  </p>
                  {panelContact.company && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {panelContact.company}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPanelContact(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Timeline list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Timeline
              </h3>
              {(!panelContact.timeline || panelContact.timeline.length === 0) ? (
                <div className="text-center py-10">
                  <Clock className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No activity yet.</p>
                </div>
              ) : (
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-5">
                  {[...panelContact.timeline]
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((ev) => (
                      <li key={ev.id} className="pl-5 relative">
                        {/* dot */}
                        <span
                          className={`absolute -left-[18px] flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 ${timelineIconBg(ev.type)}`}
                        >
                          {timelineIcon(ev.type)}
                        </span>
                        <div className="ml-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {ev.title}
                          </p>
                          {ev.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {ev.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {ev.date}
                          </p>
                        </div>
                      </li>
                    ))}
                </ol>
              )}
            </div>

            {/* Add note footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Add Note
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddNote()
                    }
                  }}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit modal ────────────────────────────────── */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Contact' : 'Add Contact'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                className={field}
                placeholder="Jane Smith"
                value={form.name}
                onChange={f('name')}
              />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input
                className={field}
                placeholder="Acme Corp"
                value={form.company}
                onChange={f('company')}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Email *</label>
            <input
              type="email"
              className={field}
              placeholder="jane@example.com"
              value={form.email}
              onChange={f('email')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Phone</label>
              <input
                className={field}
                placeholder="+1 555-0100"
                value={form.phone}
                onChange={f('phone')}
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={field}
                value={form.status}
                onChange={f('status')}
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input
              className={field}
              placeholder="vip, design, retainer"
              value={form.tags}
              onChange={f('tags')}
            />
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              className={`${field} resize-none h-20`}
              placeholder="Any notes about this contact..."
              value={form.notes}
              onChange={f('notes')}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.name.trim() || !form.email.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editing ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </div>
      </FormModal>
    </>
  )
}
