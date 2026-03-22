/**
 * Automation Rules Engine
 *
 * Evaluates automation rules against trigger events, checks conditions,
 * and executes configured actions. Designed to be instantiated server-side
 * or inside a React context that holds a reference to the CRM store state.
 */

import type {
  Automation,
  AutomationActionConfig,
  AutomationActionType,
  AutomationCondition,
  TriggerType,
} from '../../lib/types'

// ─────────────────────────────────────────────────────────────
// Supporting types
// ─────────────────────────────────────────────────────────────

/** An event that fires the engine. The payload carries entity data
 *  relevant to the trigger (e.g. the Deal object for a 'deal_won' event). */
export interface TriggerEvent {
  type: TriggerType
  payload: Record<string, unknown>
}

/** Result from executing a single action inside an automation. */
export interface ActionResult {
  success: boolean
  message: string
  data?: unknown
}

/** Rolled-up result for a single automation rule that was evaluated. */
export interface AutomationResult {
  automationId: string
  automationName: string
  /** Whether the automation actually ran (enabled + conditions matched). */
  triggered: boolean
  actions: ActionResult[]
}

// ─────────────────────────────────────────────────────────────
// Label / colour maps (useful for UI badges)
// ─────────────────────────────────────────────────────────────

/** Human-readable names for every trigger type. */
export const triggerLabels: Record<TriggerType, string> = {
  deal_won: 'Deal Won',
  deal_lost: 'Deal Lost',
  invoice_overdue: 'Invoice Overdue',
  invoice_paid: 'Invoice Paid',
  new_lead: 'New Lead',
  project_completed: 'Project Completed',
  time_logged: 'Time Logged',
  proposal_accepted: 'Proposal Accepted',
  proposal_rejected: 'Proposal Rejected',
}

/** Human-readable names for every action type. */
export const actionLabels: Record<AutomationActionType, string> = {
  create_project: 'Create Project',
  create_invoice: 'Create Invoice',
  send_email: 'Send Email',
  create_task: 'Create Task',
  add_tag: 'Add Tag',
  move_deal: 'Move Deal Stage',
  create_deal: 'Create Deal',
  notify: 'Send Notification',
  send_reminder: 'Send Reminder',
}

/**
 * Tailwind colour classes used to render trigger-type badges.
 * Each value is a `bg-*` + `text-*` pair.
 */
export const triggerColors: Record<TriggerType, string> = {
  deal_won: 'bg-green-100 text-green-700',
  deal_lost: 'bg-red-100 text-red-700',
  invoice_overdue: 'bg-orange-100 text-orange-700',
  invoice_paid: 'bg-emerald-100 text-emerald-700',
  new_lead: 'bg-blue-100 text-blue-700',
  project_completed: 'bg-purple-100 text-purple-700',
  time_logged: 'bg-slate-100 text-slate-700',
  proposal_accepted: 'bg-teal-100 text-teal-700',
  proposal_rejected: 'bg-rose-100 text-rose-700',
}

// ─────────────────────────────────────────────────────────────
// Minimal store shape the engine needs (read-only slice)
// ─────────────────────────────────────────────────────────────

interface StoreSlice {
  automations: Automation[]
}

// ─────────────────────────────────────────────────────────────
// AutomationEngine
// ─────────────────────────────────────────────────────────────

/**
 * Core rules engine.
 *
 * Usage:
 * ```ts
 * const engine = new AutomationEngine(store.getState())
 * const results = engine.trigger({ type: 'deal_won', payload: { deal } })
 * ```
 */
export class AutomationEngine {
  private store: StoreSlice

  constructor(store: StoreSlice) {
    this.store = store
  }

  // ── Public API ──────────────────────────────────────────────

  /**
   * Main entry point. Fires against all enabled automations whose trigger
   * matches the event type, evaluates their conditions, and executes actions.
   *
   * @returns An AutomationResult for every automation that was evaluated
   *          (regardless of whether conditions passed).
   */
  trigger(event: TriggerEvent): AutomationResult[] {
    const applicable = this.getApplicableAutomations(event.type)
    return applicable.map((automation) =>
      this.executeAutomation(automation, event.payload),
    )
  }

  /**
   * Returns all **enabled** automations whose trigger matches the given type.
   */
  getApplicableAutomations(triggerType: TriggerType): Automation[] {
    return this.store.automations.filter(
      (a) => a.enabled && a.trigger === triggerType,
    )
  }

  /**
   * Evaluates every condition in the automation against the context object.
   * All conditions must pass (AND semantics).
   *
   * @param automation - The automation rule to evaluate.
   * @param context    - Key/value pairs from the trigger payload.
   * @returns `true` if all conditions pass (or there are no conditions).
   */
  evaluateConditions(
    automation: Automation,
    context: Record<string, unknown>,
  ): boolean {
    if (automation.conditions.length === 0) return true

    return automation.conditions.every((condition) =>
      this.evaluateSingleCondition(condition, context),
    )
  }

  /**
   * Executes a single action config in the context of a trigger payload.
   * Currently mocked — replace inner blocks with real side-effects or
   * API calls as needed.
   */
  executeAction(
    action: AutomationActionConfig,
    context: Record<string, unknown>,
  ): ActionResult {
    console.log(
      `[AutomationEngine] Executing action "${action.type}" with params:`,
      action.params,
      'context keys:',
      Object.keys(context),
    )

    try {
      switch (action.type) {
        case 'create_project':
          return this.mockCreateProject(action.params, context)
        case 'create_invoice':
          return this.mockCreateInvoice(action.params, context)
        case 'send_email':
          return this.mockSendEmail(action.params, context)
        case 'create_task':
          return this.mockCreateTask(action.params, context)
        case 'add_tag':
          return this.mockAddTag(action.params, context)
        case 'move_deal':
          return this.mockMoveDeal(action.params, context)
        case 'create_deal':
          return this.mockCreateDeal(action.params, context)
        case 'notify':
          return this.mockNotify(action.params, context)
        case 'send_reminder':
          return this.mockSendReminder(action.params, context)
        default:
          return { success: false, message: `Unknown action type: ${action.type}` }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[AutomationEngine] Action "${action.type}" threw:`, message)
      return { success: false, message }
    }
  }

  /**
   * Evaluates one automation rule end-to-end: checks conditions, then
   * executes all actions if they pass.
   */
  executeAutomation(
    automation: Automation,
    context: Record<string, unknown>,
  ): AutomationResult {
    const conditionsPassed = this.evaluateConditions(automation, context)

    if (!conditionsPassed) {
      console.log(
        `[AutomationEngine] Automation "${automation.name}" skipped — conditions not met.`,
      )
      return {
        automationId: automation.id,
        automationName: automation.name,
        triggered: false,
        actions: [],
      }
    }

    console.log(
      `[AutomationEngine] Automation "${automation.name}" triggered — executing ${automation.actions.length} action(s).`,
    )

    const actionResults = automation.actions.map((action) =>
      this.executeAction(action, context),
    )

    return {
      automationId: automation.id,
      automationName: automation.name,
      triggered: true,
      actions: actionResults,
    }
  }

  // ── Private helpers ─────────────────────────────────────────

  private evaluateSingleCondition(
    condition: AutomationCondition,
    context: Record<string, unknown>,
  ): boolean {
    // Supports dot-notation field paths, e.g. "deal.value"
    const actual = this.resolvePath(context, condition.field)

    if (actual === undefined) {
      console.warn(
        `[AutomationEngine] Condition field "${condition.field}" not found in context.`,
      )
      return false
    }

    const expected = condition.value

    switch (condition.operator) {
      case 'equals':
        return String(actual) === String(expected)
      case 'not_equals':
        return String(actual) !== String(expected)
      case 'greater_than':
        return Number(actual) > Number(expected)
      case 'less_than':
        return Number(actual) < Number(expected)
      case 'contains':
        return String(actual).toLowerCase().includes(String(expected).toLowerCase())
      default:
        return false
    }
  }

  /** Resolves a dot-separated path from an object, e.g. "deal.value". */
  private resolvePath(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc !== null && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, obj)
  }

  // ── Mock action implementations ─────────────────────────────
  // Replace each block with real DB writes / API calls in production.

  private mockCreateProject(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const projectName =
      (params.name as string) ?? `Project for ${context.client ?? 'client'}`
    // TODO: replace with db.project.create({ name: projectName, ... })
    console.log(`[AutomationEngine] [mock] Creating project: "${projectName}"`)
    return {
      success: true,
      message: `Project "${projectName}" created successfully.`,
      data: { projectName, source: 'automation' },
    }
  }

  private mockCreateInvoice(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const client = (context.client as string) ?? 'Unknown Client'
    const amount = (params.amount as number) ?? (context.value as number) ?? 0
    // TODO: replace with db.invoice.create({ client, amount, ... })
    console.log(
      `[AutomationEngine] [mock] Creating invoice for "${client}" — $${amount}`,
    )
    return {
      success: true,
      message: `Invoice of $${amount.toLocaleString()} created for "${client}".`,
      data: { client, amount },
    }
  }

  private mockSendEmail(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const to = (params.to as string) ?? (context.email as string) ?? 'client@example.com'
    const subject = (params.subject as string) ?? 'Automated message'
    // TODO: replace with email service (e.g. Resend, SendGrid)
    console.log(
      `[AutomationEngine] [mock] Sending email to "${to}" — subject: "${subject}"`,
    )
    return {
      success: true,
      message: `Email "${subject}" queued for "${to}".`,
      data: { to, subject },
    }
  }

  private mockCreateTask(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const title = (params.title as string) ?? 'Follow up with client'
    const projectId = (params.projectId as string) ?? (context.projectId as string) ?? ''
    // TODO: replace with db.task.create({ title, projectId, ... })
    console.log(`[AutomationEngine] [mock] Creating task: "${title}"`)
    return {
      success: true,
      message: `Task "${title}" created.`,
      data: { title, projectId },
    }
  }

  private mockAddTag(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const tag = (params.tag as string) ?? 'auto-tagged'
    const entityId = (context.id as string) ?? 'unknown'
    // TODO: replace with db.contact.update({ tags: { push: tag } })
    console.log(
      `[AutomationEngine] [mock] Adding tag "${tag}" to entity ${entityId}`,
    )
    return {
      success: true,
      message: `Tag "${tag}" added to entity ${entityId}.`,
      data: { tag, entityId },
    }
  }

  private mockMoveDeal(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const dealId = (context.id as string) ?? (params.dealId as string) ?? 'unknown'
    const targetStage = (params.stage as string) ?? 'Contacted'
    // TODO: replace with db.deal.update({ id: dealId, stage: targetStage })
    console.log(
      `[AutomationEngine] [mock] Moving deal ${dealId} to stage "${targetStage}"`,
    )
    return {
      success: true,
      message: `Deal ${dealId} moved to "${targetStage}".`,
      data: { dealId, targetStage },
    }
  }

  private mockCreateDeal(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const client = (params.client as string) ?? (context.client as string) ?? 'New Client'
    const value = (params.value as number) ?? 0
    // TODO: replace with db.deal.create({ client, value, stage: 'New Lead', ... })
    console.log(
      `[AutomationEngine] [mock] Creating deal for "${client}" — $${value}`,
    )
    return {
      success: true,
      message: `Deal for "${client}" ($${value.toLocaleString()}) created.`,
      data: { client, value, stage: 'New Lead' },
    }
  }

  private mockNotify(
    params: Record<string, unknown>,
    _context: Record<string, unknown>,
  ): ActionResult {
    const message = (params.message as string) ?? 'Automation triggered'
    const channel = (params.channel as string) ?? 'in-app'
    // TODO: replace with notification service (e.g. Pusher, Slack webhook)
    console.log(
      `[AutomationEngine] [mock] Sending notification via "${channel}": "${message}"`,
    )
    return {
      success: true,
      message: `Notification sent via ${channel}: "${message}".`,
      data: { channel, message },
    }
  }

  private mockSendReminder(
    params: Record<string, unknown>,
    context: Record<string, unknown>,
  ): ActionResult {
    const to = (params.to as string) ?? (context.email as string) ?? 'client@example.com'
    const daysBeforeDue = (params.daysBeforeDue as number) ?? 3
    // TODO: replace with scheduled job / cron + email service
    console.log(
      `[AutomationEngine] [mock] Scheduling reminder to "${to}" ${daysBeforeDue} day(s) before due date.`,
    )
    return {
      success: true,
      message: `Reminder scheduled for "${to}" (${daysBeforeDue}d before due).`,
      data: { to, daysBeforeDue },
    }
  }
}
