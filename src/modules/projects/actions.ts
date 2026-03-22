'use server'

import type { Project, Task, TimeEntry, Invoice } from '../../lib/types'

// ── Projects ─────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  // TODO: replace with → const projects = await prisma.project.findMany({ where: { userId }, include: { tasks: true } })
  return []
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  // TODO: replace with → await prisma.project.create({ data: { ...data, userId } })
  const project: Project = {
    id: `p${Date.now()}`,
    name: data.name ?? 'Untitled Project',
    client: data.client ?? '',
    status: data.status ?? 'Active',
    deadline: data.deadline ?? new Date().toISOString().split('T')[0],
    tasks: [],
    budget: data.budget,
    hourlyRate: data.hourlyRate,
    contactId: data.contactId,
  }
  console.log('[Server Action] createProject', project)
  return project
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  // TODO: replace with → await prisma.project.update({ where: { id }, data })
  console.log('[Server Action] updateProject', id, data)
  return { id, ...data } as Project
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  // TODO: replace with → await prisma.project.delete({ where: { id } })
  console.log('[Server Action] deleteProject', id)
  return { success: true }
}

// ── Tasks ────────────────────────────────────────────────────

export async function createTask(projectId: string, data: Partial<Task>): Promise<Task> {
  // TODO: replace with → await prisma.task.create({ data: { ...data, projectId } })
  const task: Task = {
    id: `t${Date.now()}`,
    projectId,
    title: data.title ?? '',
    status: data.status ?? 'Todo',
    priority: data.priority ?? 'Medium',
  }
  return task
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  // TODO: replace with → await prisma.task.update({ where: { id }, data })
  return { id, ...data } as Task
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  // TODO: replace with → await prisma.task.delete({ where: { id } })
  return { success: true }
}

// ── Time Entries ─────────────────────────────────────────────

export async function createTimeEntry(data: Partial<TimeEntry>): Promise<TimeEntry> {
  // TODO: replace with → await prisma.timeEntry.create({ data: { ...data, userId } })
  const entry: TimeEntry = {
    id: `te${Date.now()}`,
    description: data.description ?? '',
    date: data.date ?? new Date().toISOString().split('T')[0],
    duration: data.duration ?? 0,
    billable: data.billable ?? true,
    hourlyRate: data.hourlyRate ?? 0,
    billed: false,
    projectId: data.projectId,
    projectName: data.projectName,
    contactId: data.contactId,
    clientName: data.clientName,
  }
  return entry
}

export async function convertTimeToInvoice(
  entryIds: string[],
  entries: TimeEntry[],
  clientName: string,
): Promise<Invoice> {
  // TODO: replace with real DB operations inside a transaction
  const billable = entries.filter((e) => entryIds.includes(e.id))
  const total = billable.reduce((sum, e) => sum + (e.duration / 60) * e.hourlyRate, 0)
  const invoice: Invoice = {
    id: `INV-${Date.now()}`,
    client: clientName,
    items: billable.map((e) => ({
      id: e.id,
      description: `${e.projectName ?? 'Work'} — ${e.description}`,
      qty: parseFloat((e.duration / 60).toFixed(2)),
      unitPrice: e.hourlyRate,
    })),
    amount: total,
    status: 'Pending',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    fromTimeEntries: entryIds,
  }
  console.log('[Server Action] convertTimeToInvoice', invoice)
  return invoice
}
