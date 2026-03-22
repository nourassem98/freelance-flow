/**
 * Integration Abstraction Layer
 * Each provider implements the IntegrationProvider interface.
 * Swap mock implementations with real OAuth flows and API clients.
 */

import type { IntegrationStatus } from '../../lib/types'

// ── Types ────────────────────────────────────────────────────

export interface SyncResult {
  synced: number
  errors: number
  lastSync: string
}

export interface IntegrationProvider {
  name: string
  connect(config?: Record<string, unknown>): Promise<{ success: boolean; token?: string }>
  disconnect(): Promise<void>
  sync(): Promise<SyncResult>
  getStatus(): IntegrationStatus
}

// ── Gmail Provider ────────────────────────────────────────────

export class GmailProvider implements IntegrationProvider {
  name = 'Gmail'
  private status: IntegrationStatus = 'disconnected'

  async connect(config?: Record<string, unknown>): Promise<{ success: boolean; token?: string }> {
    // TODO: implement OAuth 2.0 flow
    // const { code } = config as { code: string }
    // const tokens = await oauth2Client.getToken(code)
    // await prisma.integration.upsert({ where: { provider: 'gmail' }, update: { token: tokens.access_token }, create: { ... } })
    console.log('[Gmail] Connecting...', config)
    this.status = 'connected'
    return { success: true, token: 'mock_gmail_token' }
  }

  async disconnect(): Promise<void> {
    // TODO: revoke OAuth token
    this.status = 'disconnected'
  }

  async sync(): Promise<SyncResult> {
    // TODO: fetch emails from Gmail API, create timeline events
    // const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    // const messages = await gmail.users.messages.list({ userId: 'me', q: 'from:client' })
    return { synced: 12, errors: 0, lastSync: new Date().toISOString() }
  }

  getStatus(): IntegrationStatus {
    return this.status
  }
}

// ── Outlook Provider ──────────────────────────────────────────

export class OutlookProvider implements IntegrationProvider {
  name = 'Outlook'
  private status: IntegrationStatus = 'disconnected'

  async connect(): Promise<{ success: boolean; token?: string }> {
    // TODO: Microsoft Graph OAuth flow
    // const { Client } = require('@microsoft/microsoft-graph-client')
    this.status = 'connected'
    return { success: true, token: 'mock_outlook_token' }
  }

  async disconnect(): Promise<void> {
    this.status = 'disconnected'
  }

  async sync(): Promise<SyncResult> {
    // TODO: await graphClient.api('/me/messages').filter("...").get()
    return { synced: 8, errors: 0, lastSync: new Date().toISOString() }
  }

  getStatus(): IntegrationStatus { return this.status }
}

// ── Stripe Provider ───────────────────────────────────────────

export class StripeProvider implements IntegrationProvider {
  name = 'Stripe'
  private status: IntegrationStatus = 'disconnected'

  async connect(config?: Record<string, unknown>): Promise<{ success: boolean }> {
    // TODO: validate Stripe secret key, create webhook endpoints
    // const stripe = new Stripe(config?.secretKey as string)
    // await stripe.webhookEndpoints.create({ url: process.env.WEBHOOK_URL!, enabled_events: ['invoice.paid', 'payment_intent.succeeded'] })
    console.log('[Stripe] Connecting with key...', config?.publicKey)
    this.status = 'connected'
    return { success: true }
  }

  async disconnect(): Promise<void> {
    // TODO: delete webhook endpoint
    this.status = 'disconnected'
  }

  async sync(): Promise<SyncResult> {
    // TODO: sync Stripe invoices/payments to local invoice records
    // const stripe = new Stripe(secretKey)
    // const invoices = await stripe.invoices.list({ limit: 100 })
    return { synced: 5, errors: 0, lastSync: new Date().toISOString() }
  }

  /** Create a Stripe payment link for an invoice */
  async createPaymentLink(invoiceId: string, amount: number): Promise<string> {
    // TODO: await stripe.paymentLinks.create({ line_items: [{ price: priceId, quantity: 1 }] })
    return `https://buy.stripe.com/mock_${invoiceId}`
  }

  getStatus(): IntegrationStatus { return this.status }
}

// ── Google Drive Provider ────────────────────────────────────

export class DriveProvider implements IntegrationProvider {
  name = 'Google Drive'
  private status: IntegrationStatus = 'disconnected'

  async connect(): Promise<{ success: boolean }> {
    // TODO: Google Drive OAuth flow
    this.status = 'connected'
    return { success: true }
  }

  async disconnect(): Promise<void> {
    this.status = 'disconnected'
  }

  async sync(): Promise<SyncResult> {
    // TODO: sync file attachments, proposals, contracts from Drive
    return { synced: 3, errors: 0, lastSync: new Date().toISOString() }
  }

  /** Upload a file to a client's folder */
  async uploadFile(fileName: string, content: Buffer, clientId: string): Promise<string> {
    // TODO: await drive.files.create({ requestBody: { name: fileName, parents: [folderId] }, media: { body: content } })
    return `https://drive.google.com/mock/${clientId}/${fileName}`
  }

  getStatus(): IntegrationStatus { return this.status }
}

// ── Registry ─────────────────────────────────────────────────

export const IntegrationRegistry = new Map<string, IntegrationProvider>([
  ['gmail', new GmailProvider()],
  ['outlook', new OutlookProvider()],
  ['stripe', new StripeProvider()],
  ['drive', new DriveProvider()],
])

export function getIntegrationProvider(provider: string): IntegrationProvider | null {
  return IntegrationRegistry.get(provider) ?? null
}
