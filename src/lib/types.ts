// ─────────────────────────────────────────────────────────────
// FREELANCE FLOW — COMPREHENSIVE TYPE SYSTEM
// ─────────────────────────────────────────────────────────────

// ── Shared ───────────────────────────────────────────────────
export interface TimelineEvent {
  id: string
  contactId: string
  type: 'note' | 'email' | 'call' | 'meeting' | 'invoice' | 'deal' | 'proposal'
  title: string
  description?: string
  date: string
  metadata?: Record<string, unknown>
}

// ── Contacts / CRM ───────────────────────────────────────────
export type ContactStatus = 'Active' | 'Inactive' | 'Lead'

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  avatar?: string
  tags: string[]
  status: ContactStatus
  source?: string
  notes?: string
  address?: string
  website?: string
  createdAt: string
  lastContact?: string
  totalRevenue: number
  timeline: TimelineEvent[]
}

// ── Invoicing ────────────────────────────────────────────────
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft'

export interface InvoiceLineItem {
  id: string
  description: string
  qty: number
  unitPrice: number
}

export interface Invoice {
  id: string
  contactId?: string
  client: string
  items: InvoiceLineItem[]
  amount: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  notes?: string
  fromTimeEntries?: string[]
  fromProposalId?: string
}

// ── Sales / Deals ─────────────────────────────────────────────
export type DealStage = 'New Lead' | 'Contacted' | 'Negotiation' | 'Won' | 'Lost'

export interface Deal {
  id: string
  contactId?: string
  client: string
  value: number
  stage: DealStage
  probability: number // 0-100
  notes: string
  expectedCloseDate?: string
  createdAt: string
  tags?: string[]
}

// ── Projects & Tasks ──────────────────────────────────────────
export type ProjectStatus = 'Active' | 'Completed' | 'On Hold'
export type TaskStatus = 'Todo' | 'In Progress' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  assignee?: string
  dueDate?: string
  estimatedHours?: number
}

export interface Project {
  id: string
  contactId?: string
  name: string
  client: string
  status: ProjectStatus
  deadline: string
  budget?: number
  hourlyRate?: number
  tasks: Task[]
  tags?: string[]
  fromDealId?: string
  fromProposalId?: string
}

// ── Time Tracking ────────────────────────────────────────────
export interface TimeEntry {
  id: string
  projectId?: string
  projectName?: string
  contactId?: string
  clientName?: string
  description: string
  date: string
  startTime?: string
  endTime?: string
  duration: number // minutes
  billable: boolean
  hourlyRate: number
  billed: boolean
  invoiceId?: string
}

// ── Proposals & Contracts ────────────────────────────────────
export type ProposalStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired'

export interface ProposalItem {
  id: string
  description: string
  qty: number
  unitPrice: number
}

export interface Proposal {
  id: string
  title: string
  contactId?: string
  clientName: string
  status: ProposalStatus
  items: ProposalItem[]
  total: number
  validUntil: string
  createdAt: string
  sentAt?: string
  notes?: string
  terms?: string
  templateId?: string
  convertedToProjectId?: string
  convertedToInvoiceId?: string
}

export interface ProposalTemplate {
  id: string
  name: string
  category: string
  description: string
  items: Omit<ProposalItem, 'id'>[]
  terms?: string
}

// ── Service Catalog ──────────────────────────────────────────
export type PriceType = 'fixed' | 'hourly' | 'monthly'

export interface Service {
  id: string
  name: string
  category: string
  description: string
  defaultPrice: number
  priceType: PriceType
  estimatedHours?: number
  active: boolean
}

// ── Automation ────────────────────────────────────────────────
export type TriggerType =
  | 'deal_won'
  | 'deal_lost'
  | 'invoice_overdue'
  | 'invoice_paid'
  | 'new_lead'
  | 'project_completed'
  | 'time_logged'
  | 'proposal_accepted'
  | 'proposal_rejected'

export type AutomationActionType =
  | 'create_project'
  | 'create_invoice'
  | 'send_email'
  | 'create_task'
  | 'add_tag'
  | 'move_deal'
  | 'create_deal'
  | 'notify'
  | 'send_reminder'

export interface AutomationCondition {
  field: string
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals'
  value: string | number
}

export interface AutomationActionConfig {
  type: AutomationActionType
  params: Record<string, unknown>
  label: string
}

export interface Automation {
  id: string
  name: string
  description: string
  trigger: TriggerType
  conditions: AutomationCondition[]
  actions: AutomationActionConfig[]
  enabled: boolean
  runCount: number
  lastRun?: string
  createdAt: string
}

// ── AI ───────────────────────────────────────────────────────
export type AIActionType = 'invoice' | 'deal' | 'project' | 'meeting' | 'deadline' | 'contact'

export interface AIAction {
  type: AIActionType
  title: string
  details: string
  priority: 'high' | 'medium' | 'low'
  data: Record<string, unknown>
}

export interface DealInsight {
  dealId: string
  successProbability: number
  riskFactors: string[]
  recommendations: string[]
  estimatedCloseDate?: string
  pricingSuggestion?: number
}

export interface ClientInsight {
  contactId: string
  churnRisk: 'low' | 'medium' | 'high'
  lifetimeValue: number
  pricingSuggestion?: number
  nextAction?: string
  engagementScore: number
}

// ── Integrations ─────────────────────────────────────────────
export type IntegrationStatus = 'connected' | 'disconnected' | 'error'

export interface Integration {
  id: string
  name: string
  provider: 'gmail' | 'outlook' | 'stripe' | 'drive' | 'slack' | 'zapier'
  status: IntegrationStatus
  lastSync?: string
  config?: Record<string, unknown>
}

// ── Calendar / Events ────────────────────────────────────────
export type EventType = 'meeting' | 'deadline' | 'reminder' | 'follow_up' | 'milestone'

export interface CalendarEvent {
  id: string
  title: string
  type: EventType
  date: string
  time?: string
  contactId?: string
  projectId?: string
  notes?: string
  completed: boolean
}

// ── Analytics ────────────────────────────────────────────────
export interface RevenueDataPoint {
  month: string
  revenue: number
  expenses?: number
  profit?: number
}

export interface PipelineMetric {
  stage: DealStage
  count: number
  value: number
}

export interface ProfitabilityRecord {
  projectId: string
  projectName: string
  client: string
  revenue: number
  trackedHours: number
  effectiveRate: number
}

// ── Client Portal ────────────────────────────────────────────
export interface PortalClient {
  contactId: string
  clientName: string
  portalEnabled: boolean
  portalToken?: string
  invoices: Invoice[]
  projects: Project[]
  lastViewed?: string
}
