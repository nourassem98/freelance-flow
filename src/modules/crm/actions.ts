'use server'

/**
 * CRM Server Actions
 *
 * Next.js Server Actions for Contact and Deal CRUD.
 * Each function validates input, performs a mock DB operation (with a
 * clear TODO comment showing the exact Prisma call to substitute), and
 * returns a typed result or throws a descriptive error.
 *
 * These are safe to import directly in React Server Components and
 * <form action={...}> handlers.
 */

import type { Contact, Deal } from '../../lib/types'

// ─────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────

/** Generates a simple time-based ID. Replace with crypto.randomUUID() in production. */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

/** Returns today's date as an ISO date string (YYYY-MM-DD). */
function today(): string {
  return new Date().toISOString().split('T')[0]
}

// ─────────────────────────────────────────────────────────────
// Contacts
// ─────────────────────────────────────────────────────────────

/**
 * Fetches all contacts for the current user.
 *
 * TODO: replace with Prisma db.contact.findMany():
 * ```ts
 * return await prisma.contact.findMany({
 *   where: { userId: currentUser.id },
 *   include: { timeline: { orderBy: { date: 'desc' } } },
 *   orderBy: { createdAt: 'desc' },
 * })
 * ```
 */
export async function getContacts(): Promise<Contact[]> {
  console.log('[Server Action] getContacts — returning empty array (mock)')
  // TODO: replace with Prisma db.contact.findMany(...)
  return []
}

/**
 * Creates a new contact record.
 *
 * @throws {Error} if `name` or `email` is missing or invalid.
 *
 * TODO: replace with Prisma db.contact.create(data):
 * ```ts
 * return await prisma.contact.create({
 *   data: {
 *     ...validated,
 *     userId: currentUser.id,
 *     tags: { create: validated.tags.map((t) => ({ name: t })) },
 *   },
 *   include: { timeline: true },
 * })
 * ```
 */
export async function createContact(data: Partial<Contact>): Promise<Contact> {
  // ── Validation ───────────────────────────────────────────────
  const name = data.name?.trim()
  const email = data.email?.trim().toLowerCase()

  if (!name) throw new Error('Contact name is required.')
  if (!email) throw new Error('Contact email is required.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(`"${email}" is not a valid email address.`)
  }

  const contact: Contact = {
    id: generateId('c'),
    name,
    email,
    phone: data.phone?.trim(),
    company: data.company?.trim(),
    avatar: data.avatar,
    tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
    status: data.status ?? 'Lead',
    source: data.source?.trim(),
    notes: data.notes?.trim(),
    address: data.address?.trim(),
    website: data.website?.trim(),
    totalRevenue: 0,
    createdAt: today(),
    timeline: [],
  }

  console.log('[Server Action] createContact →', contact.name, contact.email)
  // TODO: replace with Prisma db.contact.create(data)
  return contact
}

/**
 * Updates an existing contact by ID.
 * Merges the provided partial data into the existing record.
 *
 * @throws {Error} if `id` is missing or if email validation fails.
 *
 * TODO: replace with Prisma db.contact.update():
 * ```ts
 * return await prisma.contact.update({
 *   where: { id },
 *   data: {
 *     ...sanitised,
 *     tags: { deleteMany: {}, create: sanitised.tags?.map((t) => ({ name: t })) },
 *   },
 *   include: { timeline: true },
 * })
 * ```
 */
export async function updateContact(
  id: string,
  data: Partial<Contact>,
): Promise<Contact> {
  if (!id?.trim()) throw new Error('Contact ID is required for update.')

  // Validate email if provided
  if (data.email !== undefined) {
    const email = data.email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(`"${email}" is not a valid email address.`)
    }
    data = { ...data, email }
  }

  // Sanitise string fields
  const sanitised: Partial<Contact> = {
    ...data,
    name: data.name?.trim(),
    phone: data.phone?.trim(),
    company: data.company?.trim(),
    notes: data.notes?.trim(),
    address: data.address?.trim(),
    website: data.website?.trim(),
    tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : data.tags,
  }

  console.log('[Server Action] updateContact → id:', id, 'fields:', Object.keys(sanitised))
  // TODO: replace with Prisma db.contact.update({ where: { id }, data: sanitised })
  return { id, ...sanitised } as Contact
}

/**
 * Deletes a contact and all associated timeline events by ID.
 *
 * @throws {Error} if `id` is missing.
 *
 * TODO: replace with Prisma db.contact.delete():
 * ```ts
 * await prisma.contact.delete({ where: { id } })
 * // Cascade deletes timeline events via Prisma schema relations
 * ```
 */
export async function deleteContact(id: string): Promise<{ success: boolean }> {
  if (!id?.trim()) throw new Error('Contact ID is required for deletion.')

  console.log('[Server Action] deleteContact → id:', id)
  // TODO: replace with Prisma db.contact.delete({ where: { id } })
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// Deals
// ─────────────────────────────────────────────────────────────

/**
 * Creates a new deal record.
 *
 * @throws {Error} if `client` name is missing or `value` is negative.
 *
 * TODO: replace with Prisma db.deal.create(data):
 * ```ts
 * return await prisma.deal.create({
 *   data: {
 *     ...validated,
 *     userId: currentUser.id,
 *     tags: { create: validated.tags?.map((t) => ({ name: t })) },
 *   },
 * })
 * ```
 */
export async function createDeal(data: Partial<Deal>): Promise<Deal> {
  // ── Validation ───────────────────────────────────────────────
  const client = data.client?.trim()
  if (!client) throw new Error('Client name is required.')

  const value = data.value ?? 0
  if (value < 0) throw new Error('Deal value cannot be negative.')

  const probability = data.probability ?? defaultProbabilityForStage(data.stage ?? 'New Lead')
  if (probability < 0 || probability > 100) {
    throw new Error('Probability must be between 0 and 100.')
  }

  const deal: Deal = {
    id: generateId('d'),
    client,
    contactId: data.contactId,
    value,
    stage: data.stage ?? 'New Lead',
    probability,
    notes: data.notes?.trim() ?? '',
    createdAt: today(),
    expectedCloseDate: data.expectedCloseDate,
    tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
  }

  console.log('[Server Action] createDeal →', deal.client, `$${deal.value}`, deal.stage)
  // TODO: replace with Prisma db.deal.create(data)
  return deal
}

/**
 * Updates an existing deal by ID.
 *
 * @throws {Error} if `id` is missing or field validation fails.
 *
 * TODO: replace with Prisma db.deal.update():
 * ```ts
 * return await prisma.deal.update({
 *   where: { id },
 *   data: sanitised,
 * })
 * ```
 */
export async function updateDeal(id: string, data: Partial<Deal>): Promise<Deal> {
  if (!id?.trim()) throw new Error('Deal ID is required for update.')

  if (data.value !== undefined && data.value < 0) {
    throw new Error('Deal value cannot be negative.')
  }
  if (data.probability !== undefined && (data.probability < 0 || data.probability > 100)) {
    throw new Error('Probability must be between 0 and 100.')
  }

  const sanitised: Partial<Deal> = {
    ...data,
    client: data.client?.trim(),
    notes: data.notes?.trim(),
    tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : data.tags,
  }

  console.log('[Server Action] updateDeal → id:', id, 'fields:', Object.keys(sanitised))
  // TODO: replace with Prisma db.deal.update({ where: { id }, data: sanitised })
  return { id, ...sanitised } as Deal
}

/**
 * Deletes a deal by ID.
 *
 * @throws {Error} if `id` is missing.
 *
 * TODO: replace with Prisma db.deal.delete():
 * ```ts
 * await prisma.deal.delete({ where: { id } })
 * ```
 */
export async function deleteDeal(id: string): Promise<{ success: boolean }> {
  if (!id?.trim()) throw new Error('Deal ID is required for deletion.')

  console.log('[Server Action] deleteDeal → id:', id)
  // TODO: replace with Prisma db.deal.delete({ where: { id } })
  return { success: true }
}

/**
 * Moves a deal to a new pipeline stage and updates its probability accordingly.
 *
 * After moving to 'Won' or 'Lost', this is the correct place to fire
 * the AutomationEngine with a `deal_won` / `deal_lost` trigger.
 *
 * @throws {Error} if `id` is missing.
 *
 * TODO: replace DB call and add automation trigger:
 * ```ts
 * const updated = await prisma.deal.update({ where: { id }, data: { stage, probability } })
 * if (stage === 'Won') {
 *   const engine = new AutomationEngine(await getStoreState())
 *   engine.trigger({ type: 'deal_won', payload: { ...updated } })
 * }
 * return { success: true }
 * ```
 */
export async function moveDealStage(
  id: string,
  stage: Deal['stage'],
): Promise<{ success: boolean }> {
  if (!id?.trim()) throw new Error('Deal ID is required.')

  const probability = defaultProbabilityForStage(stage)
  console.log('[Server Action] moveDealStage → id:', id, 'stage:', stage, `(${probability}%)`)
  // TODO: replace with Prisma db.deal.update({ where: { id }, data: { stage, probability } })
  // TODO: fire AutomationEngine for deal_won / deal_lost triggers
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────

/**
 * Returns a sensible default win-probability for a given deal stage.
 * Mirrors the heuristics used in the insights module.
 */
function defaultProbabilityForStage(stage: Deal['stage']): number {
  const map: Record<Deal['stage'], number> = {
    'New Lead': 15,
    Contacted: 35,
    Negotiation: 65,
    Won: 100,
    Lost: 0,
  }
  return map[stage] ?? 20
}
