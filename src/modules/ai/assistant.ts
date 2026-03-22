/**
 * AI Assistant Module
 *
 * Provides heuristic/mock implementations of AI-powered CRM helpers.
 * All functions are clearly annotated where a real LLM API call
 * (Claude, OpenAI, etc.) would replace the mock logic.
 *
 * No 'use client' — safe to import in server components and server actions.
 */

import type { Contact, Deal, Invoice } from '../../lib/types'

// ─────────────────────────────────────────────────────────────
// Email generation
// ─────────────────────────────────────────────────────────────

export type EmailTemplateType =
  | 'proposal_follow_up'
  | 'payment_reminder'
  | 'new_client_welcome'
  | 'project_update'
  | 'testimonial_request'

export interface EmailParams {
  type: EmailTemplateType
  clientName: string
  /** Freelancer / sender name */
  senderName?: string
  /** Project or proposal name */
  projectName?: string
  /** Invoice number */
  invoiceNumber?: string
  /** Amount owed */
  amount?: number
  /** ISO date string */
  dueDate?: string
  /** Any extra context */
  extra?: string
}

export interface EmailTemplate {
  subject: string
  body: string
}

/**
 * Generates a professional email from a template type and parameters.
 *
 * TODO: Replace the switch block with a real LLM call, e.g.:
 * ```ts
 * const response = await anthropic.messages.create({
 *   model: 'claude-opus-4-5',
 *   max_tokens: 500,
 *   messages: [{ role: 'user', content: buildPrompt(params) }]
 * })
 * return parseEmailFromResponse(response.content[0].text)
 * ```
 */
export function generateEmail(params: EmailParams): EmailTemplate {
  const sender = params.senderName ?? 'Your Freelancer'
  const client = params.clientName
  const project = params.projectName ?? 'your project'
  const invoice = params.invoiceNumber ?? 'N/A'
  const amount = params.amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? '$0.00'
  const due = params.dueDate ? new Date(params.dueDate).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'soon'

  switch (params.type) {
    case 'proposal_follow_up':
      return {
        subject: `Following up on my proposal — ${project}`,
        body: `Hi ${client},

I hope you're doing well. I wanted to follow up on the proposal I sent over for ${project}. I'm excited about the opportunity to work together and would love to answer any questions you might have.

If you'd like to move forward or discuss any adjustments to the scope or pricing, I'm happy to jump on a quick call at your convenience.

Looking forward to hearing from you!

Warm regards,
${sender}`,
      }

    case 'payment_reminder':
      return {
        subject: `Payment reminder — Invoice ${invoice} due ${due}`,
        body: `Hi ${client},

I hope this message finds you well. This is a friendly reminder that Invoice ${invoice} for ${amount} is due on ${due}.

If you have any questions about the invoice or need to discuss payment arrangements, please don't hesitate to reach out. You can pay via the link attached to the invoice.

Thank you for your continued support!

Best,
${sender}`,
      }

    case 'new_client_welcome':
      return {
        subject: `Welcome aboard — excited to work with you!`,
        body: `Hi ${client},

Welcome, and thank you for choosing to work with me! I'm thrilled to have you on board.

Here's what happens next:
1. I'll send over the project agreement for your review and signature.
2. Once signed, we'll kick off with a discovery call to align on goals and timelines.
3. You'll receive regular progress updates throughout the engagement.

If you have any questions before we get started, feel free to reach out any time.

Looking forward to a great partnership!

Best,
${sender}`,
      }

    case 'project_update':
      return {
        subject: `Project update — ${project}`,
        body: `Hi ${client},

I wanted to share a quick update on ${project}.

${params.extra ?? 'Progress is on track and we\'re meeting our milestones. I\'ll share a more detailed update at our next check-in.'}

Please let me know if you have any questions or feedback in the meantime.

Best,
${sender}`,
      }

    case 'testimonial_request':
      return {
        subject: `A quick favour — would you share a testimonial?`,
        body: `Hi ${client},

I really enjoyed working together on ${project} and I hope the results have been valuable to you.

If you're happy with the work, I'd be incredibly grateful if you could share a short testimonial. It only takes a few minutes and makes a huge difference for a freelancer like me.

You can reply directly to this email or leave a review on [your preferred platform].

Thank you so much — it truly means the world!

Warm regards,
${sender}`,
      }

    default:
      return {
        subject: 'Message from your freelancer',
        body: `Hi ${client},\n\nI hope you're doing well. Please let me know if there's anything I can help with.\n\nBest,\n${sender}`,
      }
  }
}

// ─────────────────────────────────────────────────────────────
// Proposal text
// ─────────────────────────────────────────────────────────────

/**
 * Generates a professional proposal introduction paragraph.
 *
 * TODO: Swap with a real LLM call to produce customised, on-brand copy:
 * ```ts
 * const prompt = `Write a professional proposal intro for a ${service}
 *   project for ${client} with a budget of $${budget}.`
 * // call Claude / OpenAI here
 * ```
 */
export function generateProposalText(
  service: string,
  client: string,
  budget: number,
): string {
  const formattedBudget = budget.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

  return (
    `Thank you for considering this proposal for ${service} services tailored specifically to ${client}'s ` +
    `needs and goals. With a project budget of ${formattedBudget}, this engagement is scoped to deliver ` +
    `measurable value through a structured, iterative approach. I bring deep expertise in this area and ` +
    `am committed to transparent communication, on-time delivery, and outcomes that exceed expectations. ` +
    `The following pages outline my recommended approach, deliverables, timeline, and investment breakdown.`
  )
}

// ─────────────────────────────────────────────────────────────
// Client history summary
// ─────────────────────────────────────────────────────────────

export interface ClientSummary {
  lastInteraction: string | null
  totalDeals: number
  totalRevenue: number
  relationshipScore: number // 1–10
  keyNotes: string[]
}

/**
 * Summarises a contact's CRM history into a concise overview.
 *
 * TODO: Enhance with a real LLM call that reads the full timeline and
 * produces natural-language summaries:
 * ```ts
 * const events = contact.timeline.map(e => `${e.date}: ${e.title}`).join('\n')
 * // send events to Claude and ask for a bullet-point summary
 * ```
 */
export function summarizeClientHistory(contact: Contact): ClientSummary {
  const timelineCount = contact.timeline?.length ?? 0
  const lastEvent = contact.timeline?.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0]

  // Heuristic relationship score: based on revenue, timeline activity, and status
  let score = 5
  if (contact.totalRevenue > 10000) score += 2
  else if (contact.totalRevenue > 2500) score += 1
  if (timelineCount > 10) score += 1
  if (contact.status === 'Active') score += 1
  if (contact.status === 'Inactive') score -= 2
  score = Math.max(1, Math.min(10, score))

  const keyNotes: string[] = []
  if (contact.notes) keyNotes.push(contact.notes.slice(0, 120))
  if (contact.source) keyNotes.push(`Acquired via ${contact.source}`)
  if (contact.tags.length > 0) keyNotes.push(`Tags: ${contact.tags.join(', ')}`)
  if (timelineCount === 0) keyNotes.push('No recorded interactions yet')

  return {
    lastInteraction: lastEvent?.date ?? contact.lastContact ?? null,
    totalDeals: contact.timeline?.filter((e) => e.type === 'deal').length ?? 0,
    totalRevenue: contact.totalRevenue,
    relationshipScore: score,
    keyNotes,
  }
}

// ─────────────────────────────────────────────────────────────
// Follow-up suggestions
// ─────────────────────────────────────────────────────────────

export interface FollowUpSuggestion {
  action: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  /** Suggested number of days from today to complete the action. */
  dueIn: number
}

/**
 * Analyses a contact and their associated deals to suggest the most
 * impactful follow-up actions.
 *
 * TODO: Replace heuristics with an LLM prompt that receives the full
 * contact timeline and deal list, and returns ranked recommendations.
 */
export function suggestFollowUpActions(
  contact: Contact,
  deals: Deal[],
): FollowUpSuggestion[] {
  const suggestions: FollowUpSuggestion[] = []
  const now = new Date()

  const daysSinceContact = contact.lastContact
    ? Math.floor((now.getTime() - new Date(contact.lastContact).getTime()) / 86_400_000)
    : 999

  // 1. Re-engagement if not contacted recently
  if (daysSinceContact > 60) {
    suggestions.push({
      action: `Send a re-engagement email to ${contact.name}`,
      priority: 'high',
      reason: `No contact recorded in ${daysSinceContact} days — at risk of going cold.`,
      dueIn: 1,
    })
  } else if (daysSinceContact > 30) {
    suggestions.push({
      action: `Check in with ${contact.name}`,
      priority: 'medium',
      reason: `Last contact was ${daysSinceContact} days ago.`,
      dueIn: 3,
    })
  }

  // 2. Open deals that need attention
  const openDeals = deals.filter(
    (d) => d.stage !== 'Won' && d.stage !== 'Lost',
  )
  for (const deal of openDeals) {
    const daysSinceCreated = Math.floor(
      (now.getTime() - new Date(deal.createdAt).getTime()) / 86_400_000,
    )

    if (deal.stage === 'New Lead' && daysSinceCreated > 5) {
      suggestions.push({
        action: `Follow up on the "${deal.client}" deal — move it out of New Lead`,
        priority: 'high',
        reason: `Deal has been sitting at New Lead for ${daysSinceCreated} days.`,
        dueIn: 2,
      })
    }

    if (deal.stage === 'Negotiation') {
      suggestions.push({
        action: `Close the negotiation with ${deal.client}`,
        priority: 'high',
        reason: `Deal is in negotiation — striking while interest is high maximises win rate.`,
        dueIn: 3,
      })
    }

    if (deal.expectedCloseDate) {
      const daysToClose = Math.floor(
        (new Date(deal.expectedCloseDate).getTime() - now.getTime()) / 86_400_000,
      )
      if (daysToClose > 0 && daysToClose <= 7) {
        suggestions.push({
          action: `Prepare closing materials for the "${deal.client}" deal`,
          priority: 'high',
          reason: `Expected close date is in ${daysToClose} day(s).`,
          dueIn: daysToClose,
        })
      }
    }
  }

  // 3. Upsell opportunity for high-value active contacts
  if (contact.status === 'Active' && contact.totalRevenue > 5000 && openDeals.length === 0) {
    suggestions.push({
      action: `Identify upsell opportunities with ${contact.name}`,
      priority: 'medium',
      reason: `High-value client with no active deals — good time to propose new work.`,
      dueIn: 7,
    })
  }

  // 4. Request testimonial if long-standing client with no open deals
  if (contact.totalRevenue > 2000 && openDeals.length === 0 && daysSinceContact < 90) {
    suggestions.push({
      action: `Request a testimonial from ${contact.name}`,
      priority: 'low',
      reason: `Satisfied client with closed work — social proof is valuable.`,
      dueIn: 14,
    })
  }

  return suggestions.slice(0, 5) // cap at 5 suggestions
}

// ─────────────────────────────────────────────────────────────
// Invoice reminder
// ─────────────────────────────────────────────────────────────

/**
 * Generates a professional, personalised payment reminder message
 * based on invoice data.
 *
 * TODO: Swap with a real LLM call for tone personalisation:
 * ```ts
 * const prompt = `Write a polite but firm payment reminder for invoice
 *   ${invoice.id} for ${invoice.client}, amount ${invoice.amount},
 *   due ${invoice.dueDate}. Status: ${invoice.status}.`
 * // call Claude / OpenAI here
 * ```
 */
export function generateInvoiceReminder(invoice: Invoice): string {
  const amount = invoice.amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const due = new Date(invoice.dueDate).toLocaleDateString('en-US', { dateStyle: 'long' })
  const now = new Date()
  const daysOverdue = Math.floor(
    (now.getTime() - new Date(invoice.dueDate).getTime()) / 86_400_000,
  )

  if (invoice.status === 'Overdue' && daysOverdue > 0) {
    return (
      `Hi ${invoice.client},\n\n` +
      `I hope you're doing well. I'm writing to follow up on Invoice #${invoice.id} for ${amount}, ` +
      `which was due on ${due} — now ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue.\n\n` +
      `If payment has already been sent, please disregard this message. If not, I'd appreciate ` +
      `settlement at your earliest convenience. Please reach out if you need to discuss payment arrangements.\n\n` +
      `Thank you for your prompt attention to this matter.`
    )
  }

  return (
    `Hi ${invoice.client},\n\n` +
    `Just a friendly reminder that Invoice #${invoice.id} for ${amount} is due on ${due}.\n\n` +
    `Please don't hesitate to reach out if you have any questions about the invoice.\n\n` +
    `Thank you!`
  )
}
