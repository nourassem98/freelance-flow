'use server'

import type { Contact, Deal } from '../../lib/types'

// ── Contacts ─────────────────────────────────────────────────

export async function getContacts(): Promise<Contact[]> {
  // TODO: const contacts = await prisma.contact.findMany({ where: { userId }, include: { tags: true, timeline: true } })
  return []
}

export async function createContact(data: Partial<Contact>): Promise<Contact> {
  // TODO: await prisma.contact.create({ data: { ...data, userId, tags: { create: data.tags?.map(t => ({ name: t })) } } })
  if (!data.name || !data.email) throw new Error('Name and email are required')

  const contact: Contact = {
    id: `c${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    tags: data.tags ?? [],
    status: data.status ?? 'Lead',
    source: data.source,
    notes: data.notes,
    address: data.address,
    website: data.website,
    totalRevenue: 0,
    createdAt: new Date().toISOString().split('T')[0],
    timeline: [],
  }
  console.log('[Server Action] createContact', contact.name)
  return contact
}

export async function updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
  // TODO: await prisma.contact.update({ where: { id }, data: { ...data, tags: { deleteMany: {}, create: ... } } })
  console.log('[Server Action] updateContact', id)
  return { id, ...data } as Contact
}

export async function deleteContact(id: string): Promise<{ success: boolean }> {
  // TODO: await prisma.contact.delete({ where: { id } })
  // Cascade deletes tags + timeline events via Prisma schema
  console.log('[Server Action] deleteContact', id)
  return { success: true }
}

export async function addTimelineEvent(
  contactId: string,
  type: Contact['timeline'][0]['type'],
  title: string,
  description?: string,
): Promise<{ success: boolean }> {
  // TODO: await prisma.timelineEvent.create({ data: { contactId, type, title, description, date: new Date() } })
  console.log('[Server Action] addTimelineEvent', contactId, type, title)
  return { success: true }
}

// ── Deals ─────────────────────────────────────────────────────

export async function createDeal(data: Partial<Deal>): Promise<Deal> {
  // TODO: await prisma.deal.create({ data: { ...data, userId } })
  if (!data.client) throw new Error('Client name is required')

  const deal: Deal = {
    id: `d${Date.now()}`,
    client: data.client,
    value: data.value ?? 0,
    stage: data.stage ?? 'New Lead',
    probability: data.probability ?? 20,
    notes: data.notes ?? '',
    createdAt: new Date().toISOString().split('T')[0],
    contactId: data.contactId,
    expectedCloseDate: data.expectedCloseDate,
    tags: data.tags,
  }
  console.log('[Server Action] createDeal', deal.client)
  return deal
}

export async function updateDeal(id: string, data: Partial<Deal>): Promise<Deal> {
  // TODO: await prisma.deal.update({ where: { id }, data })
  console.log('[Server Action] updateDeal', id)
  return { id, ...data } as Deal
}

export async function deleteDeal(id: string): Promise<{ success: boolean }> {
  // TODO: await prisma.deal.delete({ where: { id } })
  return { success: true }
}

export async function moveDealStage(id: string, stage: Deal['stage']): Promise<{ success: boolean }> {
  // TODO: await prisma.deal.update({ where: { id }, data: { stage } })
  // Trigger automation: if stage === 'Won' → fire deal_won automation
  console.log('[Server Action] moveDealStage', id, stage)
  return { success: true }
}
