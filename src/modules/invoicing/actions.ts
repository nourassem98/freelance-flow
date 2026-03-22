'use server'

import type { Invoice } from '../../lib/types'

export async function getInvoices(): Promise<Invoice[]> {
  // TODO: await prisma.invoice.findMany({ where: { userId }, include: { items: true } })
  return []
}

export async function createInvoice(data: Partial<Invoice>): Promise<Invoice> {
  // TODO: await prisma.invoice.create({ data: { ...data, userId }, include: { items: true } })
  const inv: Invoice = {
    id: `INV-${Date.now()}`,
    client: data.client ?? '',
    items: data.items ?? [],
    amount: data.amount ?? 0,
    status: data.status ?? 'Draft',
    issueDate: data.issueDate ?? new Date().toISOString().split('T')[0],
    dueDate: data.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    notes: data.notes,
    contactId: data.contactId,
  }
  console.log('[Server Action] createInvoice', inv)
  return inv
}

export async function updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
  // TODO: await prisma.invoice.update({ where: { id }, data })
  return { id, ...data } as Invoice
}

export async function deleteInvoice(id: string): Promise<{ success: boolean }> {
  // TODO: await prisma.invoice.delete({ where: { id } })
  return { success: true }
}

export async function markInvoicePaid(id: string): Promise<Invoice> {
  // TODO: await prisma.invoice.update({ where: { id }, data: { status: 'Paid' } })
  return { id, status: 'Paid' } as Invoice
}

export async function sendInvoiceReminder(invoiceId: string): Promise<{ sent: boolean }> {
  // TODO: integrate with email provider (Gmail/Resend/SendGrid)
  // await emailProvider.send({ to: invoice.contact.email, template: 'payment_reminder', data: invoice })
  console.log('[Server Action] sendInvoiceReminder', invoiceId)
  return { sent: true }
}
