import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  Contact, Invoice, Deal, Project, TimeEntry,
  Proposal, Service, Automation, Integration,
} from '../types'
import {
  sampleContacts, sampleInvoices, sampleDeals, sampleProjects,
  sampleTimeEntries, sampleProposals, sampleServices,
  sampleAutomations, sampleIntegrations,
} from '../sample-data'

// ─────────────────────────────────────────────────────────────
interface CRMStore {
  // ── Contacts
  contacts: Contact[]
  addContact: (c: Contact) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void

  // ── Invoices
  invoices: Invoice[]
  addInvoice: (inv: Invoice) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void

  // ── Deals
  deals: Deal[]
  addDeal: (d: Deal) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  deleteDeal: (id: string) => void
  moveDeal: (id: string, stage: Deal['stage']) => void

  // ── Projects
  projects: Project[]
  addProject: (p: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  // ── Time Entries
  timeEntries: TimeEntry[]
  addTimeEntry: (t: TimeEntry) => void
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void
  deleteTimeEntry: (id: string) => void
  markBilled: (ids: string[], invoiceId: string) => void

  // ── Proposals
  proposals: Proposal[]
  addProposal: (p: Proposal) => void
  updateProposal: (id: string, updates: Partial<Proposal>) => void
  deleteProposal: (id: string) => void

  // ── Services
  services: Service[]
  addService: (s: Service) => void
  updateService: (id: string, updates: Partial<Service>) => void
  deleteService: (id: string) => void

  // ── Automations
  automations: Automation[]
  addAutomation: (a: Automation) => void
  toggleAutomation: (id: string) => void
  deleteAutomation: (id: string) => void
  incrementRunCount: (id: string) => void

  // ── Integrations
  integrations: Integration[]
  connectIntegration: (id: string) => void
  disconnectIntegration: (id: string) => void
}

export const useCRMStore = create<CRMStore>()(
  immer((set) => ({
    // ── Contacts ────────────────────────────────────────────
    contacts: sampleContacts,
    addContact: (c) => set((s) => { s.contacts.push(c) }),
    updateContact: (id, updates) => set((s) => {
      const i = s.contacts.findIndex((c) => c.id === id)
      if (i !== -1) Object.assign(s.contacts[i], updates)
    }),
    deleteContact: (id) => set((s) => { s.contacts = s.contacts.filter((c) => c.id !== id) }),

    // ── Invoices ─────────────────────────────────────────────
    invoices: sampleInvoices,
    addInvoice: (inv) => set((s) => { s.invoices.push(inv) }),
    updateInvoice: (id, updates) => set((s) => {
      const i = s.invoices.findIndex((inv) => inv.id === id)
      if (i !== -1) Object.assign(s.invoices[i], updates)
    }),
    deleteInvoice: (id) => set((s) => { s.invoices = s.invoices.filter((inv) => inv.id !== id) }),

    // ── Deals ────────────────────────────────────────────────
    deals: sampleDeals,
    addDeal: (d) => set((s) => { s.deals.push(d) }),
    updateDeal: (id, updates) => set((s) => {
      const i = s.deals.findIndex((d) => d.id === id)
      if (i !== -1) Object.assign(s.deals[i], updates)
    }),
    deleteDeal: (id) => set((s) => { s.deals = s.deals.filter((d) => d.id !== id) }),
    moveDeal: (id, stage) => set((s) => {
      const d = s.deals.find((d) => d.id === id)
      if (d) d.stage = stage
    }),

    // ── Projects ─────────────────────────────────────────────
    projects: sampleProjects,
    addProject: (p) => set((s) => { s.projects.push(p) }),
    updateProject: (id, updates) => set((s) => {
      const i = s.projects.findIndex((p) => p.id === id)
      if (i !== -1) Object.assign(s.projects[i], updates)
    }),
    deleteProject: (id) => set((s) => { s.projects = s.projects.filter((p) => p.id !== id) }),

    // ── Time Entries ─────────────────────────────────────────
    timeEntries: sampleTimeEntries,
    addTimeEntry: (t) => set((s) => { s.timeEntries.push(t) }),
    updateTimeEntry: (id, updates) => set((s) => {
      const i = s.timeEntries.findIndex((t) => t.id === id)
      if (i !== -1) Object.assign(s.timeEntries[i], updates)
    }),
    deleteTimeEntry: (id) => set((s) => { s.timeEntries = s.timeEntries.filter((t) => t.id !== id) }),
    markBilled: (ids, invoiceId) => set((s) => {
      s.timeEntries.forEach((t) => {
        if (ids.includes(t.id)) { t.billed = true; t.invoiceId = invoiceId }
      })
    }),

    // ── Proposals ────────────────────────────────────────────
    proposals: sampleProposals,
    addProposal: (p) => set((s) => { s.proposals.push(p) }),
    updateProposal: (id, updates) => set((s) => {
      const i = s.proposals.findIndex((p) => p.id === id)
      if (i !== -1) Object.assign(s.proposals[i], updates)
    }),
    deleteProposal: (id) => set((s) => { s.proposals = s.proposals.filter((p) => p.id !== id) }),

    // ── Services ─────────────────────────────────────────────
    services: sampleServices,
    addService: (s2) => set((s) => { s.services.push(s2) }),
    updateService: (id, updates) => set((s) => {
      const i = s.services.findIndex((svc) => svc.id === id)
      if (i !== -1) Object.assign(s.services[i], updates)
    }),
    deleteService: (id) => set((s) => { s.services = s.services.filter((svc) => svc.id !== id) }),

    // ── Automations ───────────────────────────────────────────
    automations: sampleAutomations,
    addAutomation: (a) => set((s) => { s.automations.push(a) }),
    toggleAutomation: (id) => set((s) => {
      const a = s.automations.find((a) => a.id === id)
      if (a) a.enabled = !a.enabled
    }),
    deleteAutomation: (id) => set((s) => { s.automations = s.automations.filter((a) => a.id !== id) }),
    incrementRunCount: (id) => set((s) => {
      const a = s.automations.find((a) => a.id === id)
      if (a) { a.runCount++; a.lastRun = new Date().toISOString().split('T')[0] }
    }),

    // ── Integrations ──────────────────────────────────────────
    integrations: sampleIntegrations,
    connectIntegration: (id) => set((s) => {
      const int = s.integrations.find((i) => i.id === id)
      if (int) int.status = 'connected'
    }),
    disconnectIntegration: (id) => set((s) => {
      const int = s.integrations.find((i) => i.id === id)
      if (int) int.status = 'disconnected'
    }),
  }))
)
