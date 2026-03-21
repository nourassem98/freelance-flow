// ── Invoicing ────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export interface InvoiceLineItem {
  description: string
  qty: number
  unitPrice: number
}

export interface Invoice {
  id: string
  client: string
  items: InvoiceLineItem[]
  amount: number
  status: InvoiceStatus
  issueDate: string // YYYY-MM-DD
  dueDate: string
}

// ── Sales / CRM Deals ─────────────────────────────────────────────────────────
export type DealStage = 'New Lead' | 'Contacted' | 'Negotiation' | 'Won' | 'Lost'

export interface Deal {
  id: string
  client: string
  value: number
  stage: DealStage
  notes: string
  createdAt: string
}

// ── Projects & Tasks ──────────────────────────────────────────────────────────
export type ProjectStatus = 'Active' | 'Completed' | 'On Hold'
export type TaskStatus = 'Todo' | 'In Progress' | 'Done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  projectId: string
}

export interface Project {
  id: string
  name: string
  client: string
  status: ProjectStatus
  deadline: string
  tasks: Task[]
}

// ── AI Actions ────────────────────────────────────────────────────────────────
export type AIActionType = 'invoice' | 'deal' | 'project' | 'meeting' | 'deadline'

export interface AIAction {
  type: AIActionType
  title: string
  details: string
  priority: 'high' | 'medium' | 'low'
  data: Record<string, unknown>
}
