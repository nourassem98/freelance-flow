/**
 * Integration Abstraction Layer
 *
 * Defines a uniform interface for all external service providers.
 * Each provider is a self-contained stub — replace the mock bodies
 * with real OAuth flows and API client calls before going to production.
 *
 * No 'use client' — safe for server components and server actions.
 */

import type { IntegrationStatus } from '../../lib/types'

// ─────────────────────────────────────────────────────────────
// Shared interfaces
// ─────────────────────────────────────────────────────────────

export interface SyncResult {
  /** Number of records successfully synced. */
  synced: number
  /** Number of records that failed to sync. */
  errors: number
  /** ISO 8601 timestamp of the sync completion. */
  lastSync: string
}

/**
 * Contract that every integration provider must satisfy.
 * Implementations hold their own state (token, status) internally.
 */
export interface IntegrationProvider {
  /** Display name shown in the UI. */
  readonly name: string
  /**
   * Initiates the connection / OAuth handshake.
   * @param config - Provider-specific config (API keys, OAuth codes, etc.)
   */
  connect(config?: Record<string, unknown>): Promise<{ success: boolean; token?: string }>
  /** Revokes the connection and clears stored credentials. */
  disconnect(): Promise<void>
  /** Pulls latest data from the remote service into the local store. */
  sync(): Promise<SyncResult>
  /** Returns the current connection state without triggering a network call. */
  getStatus(): IntegrationStatus
}

// ─────────────────────────────────────────────────────────────
// Gmail Provider
// ─────────────────────────────────────────────────────────────

/**
 * Google Gmail integration.
 * Syncs sent/received emails as contact timeline events.
 */
export class GmailProvider implements IntegrationProvider {
  readonly name = 'Gmail'
  private _status: IntegrationStatus = 'disconnected'
  private _token: string | null = null

  /**
   * TODO: Implement real Google OAuth 2.0 flow:
   * ```ts
   * const { code } = config as { code: string }
   * const { tokens } = await oauth2Client.getToken(code)
   * this._token = tokens.access_token!
   * await db.integration.upsert({ where: { provider: 'gmail' }, ... })
   * ```
   */
  async connect(config?: Record<string, unknown>): Promise<{ success: boolean; token?: string }> {
    console.log('[GmailProvider] Initiating OAuth connection...', config)
    // Mock: simulate a successful OAuth exchange
    this._token = 'mock_gmail_access_token'
    this._status = 'connected'
    return { success: true, token: this._token }
  }

  /**
   * TODO: Revoke the OAuth token via Google's revocation endpoint:
   * ```ts
   * await oauth2Client.revokeToken(this._token)
   * await db.integration.update({ where: { provider: 'gmail' }, data: { status: 'disconnected' } })
   * ```
   */
  async disconnect(): Promise<void> {
    console.log('[GmailProvider] Disconnecting...')
    this._token = null
    this._status = 'disconnected'
  }

  /**
   * TODO: Fetch emails via the Gmail REST API and create timeline events:
   * ```ts
   * const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
   * const { data } = await gmail.users.messages.list({ userId: 'me', q: 'newer_than:7d' })
   * // map data.messages to TimelineEvent records and upsert into DB
   * ```
   */
  async sync(): Promise<SyncResult> {
    console.log('[GmailProvider] Syncing email history...')
    // Mock: simulate syncing 12 messages with no errors
    return {
      synced: 12,
      errors: 0,
      lastSync: new Date().toISOString(),
    }
  }

  getStatus(): IntegrationStatus {
    return this._status
  }
}

// ─────────────────────────────────────────────────────────────
// Outlook Provider
// ─────────────────────────────────────────────────────────────

/**
 * Microsoft Outlook / Microsoft 365 integration.
 * Uses the Microsoft Graph API for email and calendar access.
 */
export class OutlookProvider implements IntegrationProvider {
  readonly name = 'Outlook'
  private _status: IntegrationStatus = 'disconnected'
  private _token: string | null = null

  /**
   * TODO: Implement Microsoft Graph OAuth 2.0 (MSAL) flow:
   * ```ts
   * const { ConfidentialClientApplication } = require('@azure/msal-node')
   * const msalClient = new ConfidentialClientApplication({ auth: { clientId, clientSecret, authority } })
   * const result = await msalClient.acquireTokenByAuthorizationCode({ code, scopes: ['Mail.Read', 'Calendars.Read'] })
   * this._token = result.accessToken
   * ```
   */
  async connect(config?: Record<string, unknown>): Promise<{ success: boolean; token?: string }> {
    console.log('[OutlookProvider] Initiating Microsoft Graph OAuth...', config)
    this._token = 'mock_outlook_access_token'
    this._status = 'connected'
    return { success: true, token: this._token }
  }

  /**
   * TODO: Revoke the MSAL token and clear the DB record:
   * ```ts
   * await msalClient.clearCache()
   * await db.integration.update({ where: { provider: 'outlook' }, data: { status: 'disconnected' } })
   * ```
   */
  async disconnect(): Promise<void> {
    console.log('[OutlookProvider] Disconnecting...')
    this._token = null
    this._status = 'disconnected'
  }

  /**
   * TODO: Fetch messages and calendar events via Microsoft Graph:
   * ```ts
   * const client = Client.initWithMiddleware({ authProvider })
   * const messages = await client.api('/me/messages').filter("receivedDateTime ge 2024-01-01").get()
   * const events = await client.api('/me/events').get()
   * ```
   */
  async sync(): Promise<SyncResult> {
    console.log('[OutlookProvider] Syncing emails and calendar events...')
    return {
      synced: 8,
      errors: 0,
      lastSync: new Date().toISOString(),
    }
  }

  getStatus(): IntegrationStatus {
    return this._status
  }
}

// ─────────────────────────────────────────────────────────────
// Stripe Provider
// ─────────────────────────────────────────────────────────────

/**
 * Stripe payments integration.
 * Syncs payment intents and invoices; can create payment links.
 */
export class StripeProvider implements IntegrationProvider {
  readonly name = 'Stripe'
  private _status: IntegrationStatus = 'disconnected'
  private _secretKey: string | null = null

  /**
   * TODO: Validate the secret key and register a webhook endpoint:
   * ```ts
   * const stripe = new Stripe(config.secretKey as string)
   * await stripe.webhookEndpoints.create({
   *   url: `${process.env.APP_URL}/api/webhooks/stripe`,
   *   enabled_events: ['invoice.paid', 'invoice.payment_failed', 'payment_intent.succeeded'],
   * })
   * this._secretKey = config.secretKey as string
   * ```
   */
  async connect(config?: Record<string, unknown>): Promise<{ success: boolean; token?: string }> {
    console.log('[StripeProvider] Validating API key and registering webhook...', config?.publicKey)
    this._secretKey = (config?.secretKey as string) ?? 'mock_sk_test_key'
    this._status = 'connected'
    return { success: true }
  }

  /**
   * TODO: Delete the registered webhook and clear credentials:
   * ```ts
   * const stripe = new Stripe(this._secretKey!)
   * await stripe.webhookEndpoints.del(webhookId)
   * ```
   */
  async disconnect(): Promise<void> {
    console.log('[StripeProvider] Disconnecting and removing webhook...')
    this._secretKey = null
    this._status = 'disconnected'
  }

  /**
   * TODO: Pull recent Stripe invoices and reconcile with local records:
   * ```ts
   * const stripe = new Stripe(this._secretKey!)
   * const { data: stripeInvoices } = await stripe.invoices.list({ limit: 100, status: 'paid' })
   * // upsert stripeInvoices into db.invoice
   * ```
   */
  async sync(): Promise<SyncResult> {
    console.log('[StripeProvider] Syncing invoices and payments...')
    return {
      synced: 5,
      errors: 0,
      lastSync: new Date().toISOString(),
    }
  }

  /**
   * Generates a hosted Stripe payment link for an invoice.
   *
   * TODO: Create a real Stripe payment link:
   * ```ts
   * const stripe = new Stripe(this._secretKey!)
   * const price = await stripe.prices.create({ unit_amount: amount * 100, currency: 'usd', product_data: { name: 'Invoice Payment' } })
   * const link = await stripe.paymentLinks.create({ line_items: [{ price: price.id, quantity: 1 }] })
   * return link.url
   * ```
   */
  async createPaymentLink(invoiceId: string, amount: number): Promise<string> {
    console.log(`[StripeProvider] [mock] Creating payment link for invoice ${invoiceId}, amount $${amount}`)
    return `https://buy.stripe.com/mock_${invoiceId}`
  }

  getStatus(): IntegrationStatus {
    return this._status
  }
}

// ─────────────────────────────────────────────────────────────
// Google Drive Provider
// ─────────────────────────────────────────────────────────────

/**
 * Google Drive integration.
 * Stores proposals, contracts, and deliverable files in per-client folders.
 */
export class DriveProvider implements IntegrationProvider {
  readonly name = 'Google Drive'
  private _status: IntegrationStatus = 'disconnected'
  private _token: string | null = null

  /**
   * TODO: Implement Google Drive OAuth 2.0 (scope: drive.file):
   * ```ts
   * const { tokens } = await oauth2Client.getToken(config?.code as string)
   * oauth2Client.setCredentials(tokens)
   * this._token = tokens.access_token!
   * // Create root "FreelanceFlow" folder if it doesn't exist
   * ```
   */
  async connect(config?: Record<string, unknown>): Promise<{ success: boolean; token?: string }> {
    console.log('[DriveProvider] Initiating Google Drive OAuth...', config)
    this._token = 'mock_drive_access_token'
    this._status = 'connected'
    return { success: true, token: this._token }
  }

  /**
   * TODO: Revoke Drive token and clean up stored folder references:
   * ```ts
   * await oauth2Client.revokeToken(this._token)
   * ```
   */
  async disconnect(): Promise<void> {
    console.log('[DriveProvider] Disconnecting...')
    this._token = null
    this._status = 'disconnected'
  }

  /**
   * TODO: Walk the FreelanceFlow folder tree and sync file metadata:
   * ```ts
   * const drive = google.drive({ version: 'v3', auth: oauth2Client })
   * const { data } = await drive.files.list({ q: "'rootFolderId' in parents", fields: 'files(id, name, modifiedTime)' })
   * // upsert file metadata into local attachment records
   * ```
   */
  async sync(): Promise<SyncResult> {
    console.log('[DriveProvider] Syncing file attachments...')
    return {
      synced: 3,
      errors: 0,
      lastSync: new Date().toISOString(),
    }
  }

  /**
   * Uploads a file to a client-specific Drive folder.
   *
   * TODO: Implement real upload:
   * ```ts
   * const drive = google.drive({ version: 'v3', auth: oauth2Client })
   * const folder = await ensureClientFolder(clientId, drive)
   * const { data: file } = await drive.files.create({
   *   requestBody: { name: fileName, parents: [folder.id] },
   *   media: { mimeType: 'application/octet-stream', body: Readable.from(content) },
   * })
   * return `https://drive.google.com/file/d/${file.id}/view`
   * ```
   */
  async uploadFile(fileName: string, content: Buffer, clientId: string): Promise<string> {
    console.log(`[DriveProvider] [mock] Uploading "${fileName}" for client ${clientId} (${content.length} bytes)`)
    return `https://drive.google.com/file/d/mock_${clientId}_${fileName}/view`
  }

  getStatus(): IntegrationStatus {
    return this._status
  }
}

// ─────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────

/**
 * Singleton registry of all available integration providers.
 * Keyed by the provider string used in the Integration type.
 */
export const IntegrationRegistry = new Map<string, IntegrationProvider>([
  ['gmail', new GmailProvider()],
  ['outlook', new OutlookProvider()],
  ['stripe', new StripeProvider()],
  ['drive', new DriveProvider()],
])

/**
 * Look up an integration provider by its key.
 *
 * @param provider - One of 'gmail' | 'outlook' | 'stripe' | 'drive'
 * @returns The provider instance, or `null` if not found.
 */
export function getIntegrationProvider(provider: string): IntegrationProvider | null {
  return IntegrationRegistry.get(provider) ?? null
}
