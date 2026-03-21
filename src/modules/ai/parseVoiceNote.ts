import type { AIAction } from '@/lib/crm-types'

/**
 * parseVoiceNoteToActions
 *
 * Extracts structured CRM actions from a plain-text transcript.
 * Currently uses regex-based heuristics — swap the body for a real
 * OpenAI / Claude API call when you're ready.
 *
 * Example:
 *   parseVoiceNoteToActions(
 *     "Client Ahmed confirmed project for 5000 USD starting next week"
 *   )
 *   → [{ type: 'deal', ... }, { type: 'project', ... }]
 */
export function parseVoiceNoteToActions(transcript: string): AIAction[] {
  const actions: AIAction[] = []
  const text = transcript.toLowerCase()

  // ── Extract amount ────────────────────────────────────────────────────────
  const amountMatch = transcript.match(/\$?([\d,]+(?:\.\d{2})?)\s*(?:k\b)?/i)
  const rawNum = amountMatch ? amountMatch[1].replace(/,/g, '') : '0'
  const kMultiplier = /\b\$?[\d,]+k\b/i.test(transcript) ? 1000 : 1
  const amount = parseFloat(rawNum) * kMultiplier

  // ── Extract client name ───────────────────────────────────────────────────
  // Looks for: "client Ahmed", "for Sarah Johnson", "with John"
  const clientMatch = transcript.match(
    /(?:client|for|with)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/
  )
  const client = clientMatch?.[1] ?? 'Unknown Client'

  // ── Extract time references ───────────────────────────────────────────────
  const timeRef = transcript.match(
    /(?:next\s+(?:week|monday|tuesday|wednesday|thursday|friday)|tomorrow|\d{1,2}(?::\d{2})?\s*(?:am|pm))/i
  )

  // ── Invoice ───────────────────────────────────────────────────────────────
  if (
    amount > 0 &&
    (text.includes('invoice') || text.includes('bill') || text.includes('payment'))
  ) {
    actions.push({
      type: 'invoice',
      title: `Invoice for ${client}`,
      details: `Amount: $${amount.toLocaleString()} — status: Pending`,
      priority: 'high',
      data: { client, amount, status: 'Pending' },
    })
  }

  // ── Deal + Project ────────────────────────────────────────────────────────
  if (
    text.includes('project') ||
    text.includes('confirmed') ||
    text.includes('contract') ||
    text.includes('starting')
  ) {
    const stage = text.includes('confirmed') || text.includes('contract') ? 'Won' : 'New Lead'

    if (amount > 0) {
      actions.push({
        type: 'deal',
        title: `New Deal — ${client}`,
        details: `Value: $${amount.toLocaleString()} · Stage: ${stage}`,
        priority: 'high',
        data: { client, value: amount, stage },
      })
    }

    actions.push({
      type: 'project',
      title: `Project for ${client}`,
      details: timeRef
        ? `Starting ${timeRef[0]}`
        : 'Auto-created from voice note',
      priority: 'medium',
      data: { client, name: `${client} Project`, status: 'Active' },
    })
  }

  // ── Meeting ───────────────────────────────────────────────────────────────
  if (text.includes('meeting') || text.includes('call') || text.includes('discuss')) {
    actions.push({
      type: 'meeting',
      title: `Meeting with ${client}`,
      details: timeRef ? `Scheduled: ${timeRef[0]}` : 'Time to be confirmed',
      priority: 'medium',
      data: { client, type: 'meeting', time: timeRef?.[0] ?? 'TBD' },
    })
  }

  // ── Deadline ──────────────────────────────────────────────────────────────
  if (text.includes('deadline') || text.includes('due') || text.includes('submit')) {
    actions.push({
      type: 'deadline',
      title: 'Deadline Reminder',
      details: timeRef ? `Due: ${timeRef[0]}` : 'Set a due date in your calendar',
      priority: text.includes('urgent') ? 'high' : 'medium',
      data: { date: timeRef?.[0] ?? '' },
    })
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  if (actions.length === 0) {
    actions.push({
      type: 'project',
      title: 'General Note',
      details: transcript,
      priority: 'low',
      data: { note: transcript },
    })
  }

  return actions
}
