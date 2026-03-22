/**
 * Predictive Insights Module
 *
 * Heuristic-based analytics for deals, clients, revenue forecasting, and
 * project profitability. All functions use deterministic logic today —
 * each is annotated where a real ML model or LLM call would improve accuracy.
 *
 * No 'use client' — safe to use in server components and API routes.
 */

import type {
  Contact,
  Deal,
  DealInsight,
  ClientInsight,
  Invoice,
  Project,
  ProfitabilityRecord,
} from '../../lib/types'

// ─────────────────────────────────────────────────────────────
// Revenue Forecast (local interface — exported for consumers)
// ─────────────────────────────────────────────────────────────

export interface RevenueForecast {
  /** Total paid amount in the current calendar month. */
  thisMonth: number
  /** Naive estimate for next month based on trailing average. */
  nextMonthEstimate: number
  /** Direction of the trend relative to the previous month. */
  trend: 'up' | 'down' | 'stable'
  /** Top clients by paid revenue this year. */
  topClients: { client: string; revenue: number }[]
}

// ─────────────────────────────────────────────────────────────
// 1. Deal Insight
// ─────────────────────────────────────────────────────────────

/**
 * Calculates a success probability and surfaces risk factors /
 * recommendations for a given deal, optionally enriched with contact data.
 *
 * TODO: Replace heuristic probability with a trained classifier or LLM:
 * ```ts
 * const prompt = buildDealInsightPrompt(deal, contact)
 * // call Claude / OpenAI to return { probability, risks, recommendations }
 * ```
 */
export function getDealInsight(deal: Deal, contact?: Contact): DealInsight {
  // Base probability by pipeline stage
  const stageProbabilities: Record<string, number> = {
    'New Lead': 15,
    Contacted: 35,
    Negotiation: 65,
    Won: 100,
    Lost: 0,
  }

  let probability = stageProbabilities[deal.stage] ?? 20
  const riskFactors: string[] = []
  const recommendations: string[] = []

  // Deal value impact — larger deals are harder to close
  if (deal.value > 20000) {
    probability -= 10
    riskFactors.push('High-value deal — longer decision cycle expected')
    recommendations.push('Schedule an executive-level call to build stakeholder buy-in')
  } else if (deal.value > 8000) {
    probability -= 5
    riskFactors.push('Mid-to-high value deal — multiple stakeholders likely')
  }

  // Time since creation
  const now = new Date()
  const ageInDays = Math.floor(
    (now.getTime() - new Date(deal.createdAt).getTime()) / 86_400_000,
  )

  if (ageInDays > 60) {
    probability -= 15
    riskFactors.push(`Deal has been open for ${ageInDays} days — risk of going stale`)
    recommendations.push('Send a re-engagement message or offer a limited-time incentive')
  } else if (ageInDays > 30) {
    probability -= 7
    riskFactors.push(`Deal created ${ageInDays} days ago without a close`)
  }

  // No expected close date signals lack of urgency
  if (!deal.expectedCloseDate) {
    probability -= 5
    riskFactors.push('No expected close date set — deal lacks urgency')
    recommendations.push('Agree on a close date to create mutual accountability')
  } else {
    const daysToClose = Math.floor(
      (new Date(deal.expectedCloseDate).getTime() - now.getTime()) / 86_400_000,
    )
    if (daysToClose < 0) {
      probability -= 10
      riskFactors.push(`Expected close date has passed (${Math.abs(daysToClose)} days ago)`)
      recommendations.push('Update the expected close date and re-confirm client interest')
    }
  }

  // Contact-level signals
  if (contact) {
    if (contact.status === 'Inactive') {
      probability -= 8
      riskFactors.push('Contact is marked as Inactive')
    }
    if (contact.totalRevenue > 5000) {
      probability += 5
      recommendations.push('Leverage the existing revenue relationship — reference past successes')
    }
  }

  // Tag adjustments
  if (deal.tags?.includes('warm')) probability += 5
  if (deal.tags?.includes('urgent')) probability += 8
  if (deal.tags?.includes('cold')) probability -= 10

  // Detailed notes are a positive indicator
  if (deal.notes && deal.notes.length > 50) probability += 3

  // Stage-specific recommendations
  if (deal.stage === 'New Lead') {
    recommendations.push('Send an introductory email within 24 hours to maximise response rate')
    recommendations.push("Research the client's business to personalise your pitch")
  } else if (deal.stage === 'Contacted') {
    recommendations.push('Follow up with a tailored proposal or relevant case study')
    recommendations.push('Invite the client to a short discovery call')
  } else if (deal.stage === 'Negotiation') {
    recommendations.push('Identify blockers — budget, timing, or stakeholder alignment')
    recommendations.push('Prepare a one-page summary of your value proposition')
  }

  probability = Math.max(0, Math.min(100, Math.round(probability)))

  // Naive close-date estimate based on typical stage velocity
  const stageDays: Record<string, number> = {
    'New Lead': 21,
    Contacted: 14,
    Negotiation: 7,
    Won: 0,
    Lost: 0,
  }
  const estimatedCloseDate =
    deal.expectedCloseDate ??
    new Date(now.getTime() + (stageDays[deal.stage] ?? 14) * 86_400_000)
      .toISOString()
      .split('T')[0]

  // Pricing suggestion: propose a 10% buffer when in negotiation
  const pricingSuggestion =
    deal.stage === 'Negotiation' && deal.value > 0
      ? Math.round(deal.value * 1.1)
      : undefined

  return {
    dealId: deal.id,
    successProbability: probability,
    riskFactors,
    recommendations,
    estimatedCloseDate,
    pricingSuggestion,
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Client Insight
// ─────────────────────────────────────────────────────────────

/**
 * Analyses a contact's full CRM history to surface churn risk, lifetime
 * value, engagement score, and a pricing suggestion for new work.
 *
 * TODO: Enhance with time-series analysis or LLM narrative:
 * ```ts
 * const events = contact.timeline.map(e => `${e.date}: ${e.title}`)
 * // call Claude to generate a natural-language client health report
 * ```
 */
export function getClientInsight(
  contact: Contact,
  invoices: Invoice[],
  deals: Deal[],
): ClientInsight {
  const now = new Date()

  // ── Churn risk ──────────────────────────────────────────────
  const daysSinceContact = contact.lastContact
    ? Math.floor(
        (now.getTime() - new Date(contact.lastContact).getTime()) / 86_400_000,
      )
    : 999

  let churnRisk: ClientInsight['churnRisk']
  if (daysSinceContact > 60 || contact.status === 'Inactive') {
    churnRisk = 'high'
  } else if (daysSinceContact > 30) {
    churnRisk = 'medium'
  } else {
    churnRisk = 'low'
  }

  // ── Lifetime value — sum of paid invoices for this contact ──
  const contactInvoices = invoices.filter(
    (inv) => inv.contactId === contact.id || inv.client === contact.name,
  )
  const lifetimeValue = contactInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0)

  // ── Pricing suggestion based on average won deal value ──────
  const contactDeals = deals.filter(
    (d) => d.contactId === contact.id || d.client === contact.name,
  )
  const wonDeals = contactDeals.filter((d) => d.stage === 'Won')
  const avgDealValue =
    wonDeals.length > 0
      ? wonDeals.reduce((sum, d) => sum + d.value, 0) / wonDeals.length
      : 0

  // Suggest 8% uplift on the average won deal
  const pricingSuggestion = avgDealValue > 0 ? Math.round(avgDealValue * 1.08) : undefined

  // ── Engagement score (1–100) ─────────────────────────────────
  let engagement = 30 // baseline

  const timelineCount = contact.timeline?.length ?? 0
  engagement += Math.min(25, timelineCount * 3) // up to +25 for activity

  if (daysSinceContact < 7) engagement += 20
  else if (daysSinceContact < 30) engagement += 10
  else if (daysSinceContact < 60) engagement += 5

  if (contact.status === 'Active') engagement += 15
  if (contact.status === 'Lead') engagement += 5
  if (contact.status === 'Inactive') engagement -= 20

  const openDeals = contactDeals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost')
  if (openDeals.length > 0) engagement += 10

  engagement = Math.max(1, Math.min(100, Math.round(engagement)))

  // ── Next recommended action ──────────────────────────────────
  let nextAction: string | undefined
  if (churnRisk === 'high') {
    nextAction = `Re-engage ${contact.name} — send a personal check-in email`
  } else if (openDeals.length > 0) {
    nextAction = `Advance the "${openDeals[0].client}" deal from ${openDeals[0].stage}`
  } else if (lifetimeValue > 2000 && churnRisk === 'low') {
    nextAction = `Explore new project opportunities with ${contact.name}`
  }

  return {
    contactId: contact.id,
    churnRisk,
    lifetimeValue,
    pricingSuggestion,
    nextAction,
    engagementScore: engagement,
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Revenue Forecast
// ─────────────────────────────────────────────────────────────

/**
 * Forecasts revenue for the current and next month, identifies the trend,
 * and surfaces top clients by paid revenue this year.
 *
 * @param invoices    - All invoices in the system.
 * @param timeEntries - Time entries (reserved for future billable-hours forecast).
 *
 * TODO: Improve with ARIMA / exponential smoothing, or ask an LLM to
 * interpret the time series and produce a plain-English summary.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRevenueForcast(invoices: Invoice[], timeEntries: any[]): RevenueForecast {
  void timeEntries // reserved for future billable-hours projection

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() // 0-indexed
  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1
  const prevMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid')

  const sumForMonth = (year: number, month: number): number =>
    paidInvoices
      .filter((inv) => {
        const d = new Date(inv.issueDate)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .reduce((sum, inv) => sum + inv.amount, 0)

  const thisMonthRevenue = sumForMonth(thisYear, thisMonth)
  const prevMonthRevenue = sumForMonth(prevMonthYear, prevMonth)

  // 3-month trailing average for the next-month estimate
  const recentMonths = [0, 1, 2].map((offset) => {
    const m = ((thisMonth - offset) % 12 + 12) % 12
    const y = thisMonth - offset < 0 ? thisYear - 1 : thisYear
    return sumForMonth(y, m)
  })
  const trailingAvg = recentMonths.reduce((s, v) => s + v, 0) / recentMonths.length
  const nextMonthEstimate = Math.round(trailingAvg * 1.05) // 5% growth optimism

  // Trend: >5% change from prior month = directional
  let trend: RevenueForecast['trend'] = 'stable'
  const delta = thisMonthRevenue - prevMonthRevenue
  if (prevMonthRevenue > 0 && Math.abs(delta) > prevMonthRevenue * 0.05) {
    trend = delta > 0 ? 'up' : 'down'
  }

  // Top clients this year
  const clientTotals: Record<string, number> = {}
  paidInvoices
    .filter((inv) => new Date(inv.issueDate).getFullYear() === thisYear)
    .forEach((inv) => {
      clientTotals[inv.client] = (clientTotals[inv.client] ?? 0) + inv.amount
    })

  const topClients = Object.entries(clientTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([client, revenue]) => ({ client, revenue }))

  return {
    thisMonth: thisMonthRevenue,
    nextMonthEstimate,
    trend,
    topClients,
  }
}

// ─────────────────────────────────────────────────────────────
// 4. Profitability
// ─────────────────────────────────────────────────────────────

/**
 * Calculates per-project profitability by comparing tracked hours against
 * the project budget and hourly rate.
 *
 * @param projects    - All projects.
 * @param timeEntries - All time entries (typed as any[] until TimeEntry is
 *                      imported globally; matches the store's TimeEntry shape).
 *
 * TODO: Add subcontractor cost rates for true gross-margin analysis.
 */
export function getProfitability(
  projects: Project[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeEntries: any[],
): ProfitabilityRecord[] {
  return projects.map((project) => {
    const projectEntries = timeEntries.filter((t) => t.projectId === project.id)

    const trackedMinutes = projectEntries.reduce(
      (sum: number, t: { duration?: number }) => sum + (t.duration ?? 0),
      0,
    )
    const trackedHours = Math.round((trackedMinutes / 60) * 10) / 10

    // Revenue: sum billable entries; fall back to project budget
    const billedRevenue = projectEntries
      .filter((t: { billable?: boolean }) => t.billable)
      .reduce(
        (
          sum: number,
          t: { duration?: number; hourlyRate?: number },
        ) =>
          sum + ((t.duration ?? 0) / 60) * (t.hourlyRate ?? project.hourlyRate ?? 0),
        0,
      )
    const revenue = billedRevenue > 0 ? billedRevenue : (project.budget ?? 0)

    const effectiveRate =
      trackedHours > 0 ? Math.round((revenue / trackedHours) * 100) / 100 : 0

    return {
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      revenue: Math.round(revenue * 100) / 100,
      trackedHours,
      effectiveRate,
    }
  })
}
