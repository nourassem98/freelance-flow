import type {
  Contact, Invoice, Deal, Project, TimeEntry,
  Proposal, ProposalTemplate, Service, Automation, Integration,
} from './types'

// ── Contacts ────────────────────────────────────────────────
export const sampleContacts: Contact[] = [
  {
    id: 'c1', name: 'Ahmed Al-Rashid', email: 'ahmed@nexuslabs.io', phone: '+1 555-0101',
    company: 'Nexus Labs', tags: ['vip', 'tech'], status: 'Active', source: 'Referral',
    address: 'Dubai, UAE', website: 'nexuslabs.io', createdAt: '2025-09-01',
    lastContact: '2026-03-18', totalRevenue: 18500,
    timeline: [
      { id: 't1', contactId: 'c1', type: 'deal', title: 'Deal Won — $8,000 Website', date: '2026-01-10' },
      { id: 't2', contactId: 'c1', type: 'invoice', title: 'Invoice INV-2026-001 Paid', date: '2026-02-01' },
      { id: 't3', contactId: 'c1', type: 'meeting', title: 'Kickoff call', description: 'Discussed scope & timeline', date: '2026-01-15' },
    ],
  },
  {
    id: 'c2', name: 'Sarah Chen', email: 'sarah@pulseagency.co', phone: '+1 555-0202',
    company: 'Pulse Agency', tags: ['design', 'retainer'], status: 'Active', source: 'LinkedIn',
    address: 'San Francisco, CA', createdAt: '2025-10-15',
    lastContact: '2026-03-20', totalRevenue: 9400,
    timeline: [
      { id: 't4', contactId: 'c2', type: 'email', title: 'Sent proposal for brand refresh', date: '2026-02-10' },
      { id: 't5', contactId: 'c2', type: 'deal', title: 'Negotiation started', date: '2026-02-15' },
    ],
  },
  {
    id: 'c3', name: 'Marcus Webb', email: 'marcus@orbitinc.com', phone: '+1 555-0303',
    company: 'Orbit Inc', tags: ['enterprise', 'long-term'], status: 'Active', source: 'Cold Outreach',
    address: 'New York, NY', website: 'orbitinc.com', createdAt: '2025-08-20',
    lastContact: '2026-03-10', totalRevenue: 32000,
    timeline: [
      { id: 't6', contactId: 'c3', type: 'note', title: 'Prefers Slack comms', date: '2026-01-05' },
      { id: 't7', contactId: 'c3', type: 'invoice', title: 'INV-2026-003 — $3,200 Paid', date: '2026-03-01' },
    ],
  },
  {
    id: 'c4', name: 'Lena Müller', email: 'lena@bluskymedia.de', phone: '+49 555-0404',
    company: 'BlueSky Media', tags: ['social', 'media'], status: 'Active', source: 'Conference',
    address: 'Berlin, Germany', createdAt: '2025-11-01',
    lastContact: '2026-03-05', totalRevenue: 6500,
    timeline: [
      { id: 't8', contactId: 'c4', type: 'meeting', title: 'Intro call', date: '2025-11-10' },
    ],
  },
  {
    id: 'c5', name: 'James Rivera', email: 'james@acmecorp.com', phone: '+1 555-0505',
    company: 'Acme Corp', tags: ['web', 'e-commerce'], status: 'Active', source: 'Website',
    address: 'Chicago, IL', totalRevenue: 7500, createdAt: '2026-01-10',
    lastContact: '2026-03-15',
    timeline: [
      { id: 't9', contactId: 'c5', type: 'deal', title: 'Deal closed $5,000', date: '2026-01-20' },
    ],
  },
  {
    id: 'c6', name: 'Priya Sharma', email: 'priya@techstartinc.com', phone: '+1 555-0606',
    company: 'TechStart Inc', tags: ['mobile', 'startup'], status: 'Active', source: 'Referral',
    address: 'Austin, TX', totalRevenue: 10800, createdAt: '2025-12-01',
    lastContact: '2026-03-12',
    timeline: [],
  },
  {
    id: 'c7', name: 'Oliver Grant', email: 'oliver@startupxyz.io', phone: '+1 555-0707',
    company: 'StartupXYZ', tags: ['branding'], status: 'Lead', source: 'Cold Email',
    address: 'Los Angeles, CA', totalRevenue: 950, createdAt: '2026-02-20',
    lastContact: '2026-02-25',
    timeline: [],
  },
  {
    id: 'c8', name: 'Nina Kovacs', email: 'nina@innovlabs.eu', phone: '+36 555-0808',
    company: 'Innovation Labs', tags: ['vip', 'retainer', 'long-term'], status: 'Active',
    source: 'Referral', address: 'Budapest, Hungary', totalRevenue: 4500, createdAt: '2025-07-15',
    lastContact: '2026-03-01',
    timeline: [
      { id: 't10', contactId: 'c8', type: 'note', title: 'Wants quarterly retainer discussion', date: '2026-03-01' },
    ],
  },
]

// ── Invoices ─────────────────────────────────────────────────
export const sampleInvoices: Invoice[] = [
  {
    id: 'INV-2026-001', contactId: 'c5', client: 'Acme Corp',
    items: [{ id: 'li1', description: 'Website Redesign', qty: 1, unitPrice: 2500 }],
    amount: 2500, status: 'Paid', issueDate: '2026-01-15', dueDate: '2026-02-15',
  },
  {
    id: 'INV-2026-002', contactId: 'c6', client: 'TechStart Inc',
    items: [{ id: 'li2', description: 'Mobile App Development — Phase 1', qty: 1, unitPrice: 1800 }],
    amount: 1800, status: 'Pending', issueDate: '2026-03-01', dueDate: '2026-04-01',
  },
  {
    id: 'INV-2026-003', contactId: 'c3', client: 'Global Solutions',
    items: [
      { id: 'li3', description: 'SEO Audit', qty: 1, unitPrice: 1200 },
      { id: 'li4', description: 'Content Strategy', qty: 2, unitPrice: 1000 },
    ],
    amount: 3200, status: 'Paid', issueDate: '2026-02-01', dueDate: '2026-03-01',
  },
  {
    id: 'INV-2026-004', contactId: 'c7', client: 'StartupXYZ',
    items: [{ id: 'li5', description: 'Logo Design', qty: 1, unitPrice: 950 }],
    amount: 950, status: 'Overdue', issueDate: '2026-01-20', dueDate: '2026-02-20',
  },
  {
    id: 'INV-2026-005', contactId: 'c8', client: 'Innovation Labs',
    items: [
      { id: 'li6', description: 'Analytics Dashboard', qty: 1, unitPrice: 3000 },
      { id: 'li7', description: 'Hosting Setup', qty: 1, unitPrice: 1500 },
    ],
    amount: 4500, status: 'Paid', issueDate: '2026-02-10', dueDate: '2026-03-10',
  },
]

// ── Deals ─────────────────────────────────────────────────────
export const sampleDeals: Deal[] = [
  { id: 'd1', contactId: 'c1', client: 'Nexus Labs', value: 8000, stage: 'New Lead', probability: 20, notes: 'Full website rebuild', createdAt: '2026-03-01' },
  { id: 'd2', contactId: 'c2', client: 'Pulse Agency', value: 3500, stage: 'Contacted', probability: 40, notes: 'Brand refresh + social kit', createdAt: '2026-02-15', expectedCloseDate: '2026-04-30' },
  { id: 'd3', contactId: 'c3', client: 'Orbit Inc', value: 12000, stage: 'Negotiation', probability: 70, notes: 'SaaS dashboard build', createdAt: '2026-01-20', expectedCloseDate: '2026-04-15', tags: ['enterprise'] },
  { id: 'd4', contactId: 'c5', client: 'Acme Corp', value: 5000, stage: 'Won', probability: 100, notes: 'E-commerce platform', createdAt: '2026-01-10' },
  { id: 'd5', contactId: 'c7', client: 'OldBrand Ltd', value: 2000, stage: 'Lost', probability: 0, notes: 'Went with another agency', createdAt: '2025-12-01' },
  { id: 'd6', contactId: 'c4', client: 'BlueSky Media', value: 6500, stage: 'Contacted', probability: 35, notes: 'Social media campaign', createdAt: '2026-02-20', expectedCloseDate: '2026-05-01' },
  { id: 'd7', contactId: 'c6', client: 'TechStart Inc', value: 9000, stage: 'Negotiation', probability: 65, notes: 'Mobile app MVP', createdAt: '2026-02-01', expectedCloseDate: '2026-04-20', tags: ['startup'] },
]

// ── Projects ──────────────────────────────────────────────────
export const sampleProjects: Project[] = [
  {
    id: 'p1', contactId: 'c5', name: 'Website Redesign', client: 'Acme Corp',
    status: 'Active', deadline: '2026-04-15', budget: 5000, hourlyRate: 100,
    tasks: [
      { id: 't1', title: 'Wireframes', status: 'Done', priority: 'High', projectId: 'p1' },
      { id: 't2', title: 'Homepage design', status: 'In Progress', priority: 'High', projectId: 'p1' },
      { id: 't3', title: 'Mobile responsive', status: 'Todo', priority: 'Medium', projectId: 'p1' },
      { id: 't4', title: 'SEO setup', status: 'Todo', priority: 'Low', projectId: 'p1' },
    ],
  },
  {
    id: 'p2', contactId: 'c6', name: 'Mobile App MVP', client: 'TechStart Inc',
    status: 'Active', deadline: '2026-05-01', budget: 12000, hourlyRate: 120,
    tasks: [
      { id: 't5', title: 'Auth flow', status: 'Done', priority: 'High', projectId: 'p2' },
      { id: 't6', title: 'Dashboard UI', status: 'In Progress', priority: 'High', projectId: 'p2' },
      { id: 't7', title: 'API integration', status: 'In Progress', priority: 'High', projectId: 'p2' },
      { id: 't8', title: 'Testing', status: 'Todo', priority: 'Medium', projectId: 'p2' },
    ],
  },
  {
    id: 'p3', contactId: 'c3', name: 'Brand Identity', client: 'Global Solutions',
    status: 'Completed', deadline: '2026-03-15', budget: 3500, hourlyRate: 90,
    tasks: [
      { id: 't9', title: 'Logo design', status: 'Done', priority: 'High', projectId: 'p3' },
      { id: 't10', title: 'Brand guide', status: 'Done', priority: 'Medium', projectId: 'p3' },
      { id: 't11', title: 'Asset delivery', status: 'Done', priority: 'Low', projectId: 'p3' },
    ],
  },
  {
    id: 'p4', contactId: 'c7', name: 'E-commerce Platform', client: 'StartupXYZ',
    status: 'On Hold', deadline: '2026-06-01', budget: 8000, hourlyRate: 110,
    tasks: [
      { id: 't12', title: 'Product catalog', status: 'In Progress', priority: 'High', projectId: 'p4' },
      { id: 't13', title: 'Checkout flow', status: 'Todo', priority: 'High', projectId: 'p4' },
    ],
  },
]

// ── Time Entries ──────────────────────────────────────────────
export const sampleTimeEntries: TimeEntry[] = [
  { id: 'te1', projectId: 'p1', projectName: 'Website Redesign', contactId: 'c5', clientName: 'Acme Corp', description: 'Homepage layout and wireframes', date: '2026-03-18', duration: 180, billable: true, hourlyRate: 100, billed: false },
  { id: 'te2', projectId: 'p1', projectName: 'Website Redesign', contactId: 'c5', clientName: 'Acme Corp', description: 'Responsive breakpoints', date: '2026-03-19', duration: 120, billable: true, hourlyRate: 100, billed: false },
  { id: 'te3', projectId: 'p2', projectName: 'Mobile App MVP', contactId: 'c6', clientName: 'TechStart Inc', description: 'Auth screens implementation', date: '2026-03-17', duration: 240, billable: true, hourlyRate: 120, billed: false },
  { id: 'te4', projectId: 'p2', projectName: 'Mobile App MVP', contactId: 'c6', clientName: 'TechStart Inc', description: 'Dashboard API integration', date: '2026-03-20', duration: 300, billable: true, hourlyRate: 120, billed: false },
  { id: 'te5', projectId: 'p3', projectName: 'Brand Identity', contactId: 'c3', clientName: 'Global Solutions', description: 'Final logo revisions', date: '2026-03-10', duration: 90, billable: true, hourlyRate: 90, billed: true, invoiceId: 'INV-2026-003' },
  { id: 'te6', projectId: 'p1', projectName: 'Website Redesign', contactId: 'c5', clientName: 'Acme Corp', description: 'Client feedback revisions', date: '2026-03-21', duration: 60, billable: false, hourlyRate: 100, billed: false },
]

// ── Proposals ────────────────────────────────────────────────
export const sampleProposals: Proposal[] = [
  {
    id: 'prop1', title: 'SaaS Dashboard Development', contactId: 'c3', clientName: 'Orbit Inc',
    status: 'Sent', total: 12000,
    items: [
      { id: 'pi1', description: 'UI/UX Design (10 screens)', qty: 1, unitPrice: 4000 },
      { id: 'pi2', description: 'Frontend Development', qty: 1, unitPrice: 6000 },
      { id: 'pi3', description: 'QA & Deployment', qty: 1, unitPrice: 2000 },
    ],
    validUntil: '2026-04-15', createdAt: '2026-03-01', sentAt: '2026-03-05',
    terms: 'Net 30. 50% upfront required.',
    notes: 'Includes 3 rounds of revisions.',
  },
  {
    id: 'prop2', title: 'Brand Refresh Package', contactId: 'c2', clientName: 'Pulse Agency',
    status: 'Viewed', total: 3500,
    items: [
      { id: 'pi4', description: 'Logo Redesign', qty: 1, unitPrice: 1500 },
      { id: 'pi5', description: 'Brand Guidelines', qty: 1, unitPrice: 1000 },
      { id: 'pi6', description: 'Social Media Kit', qty: 1, unitPrice: 1000 },
    ],
    validUntil: '2026-04-01', createdAt: '2026-02-20', sentAt: '2026-02-22',
    terms: 'Net 14.',
  },
  {
    id: 'prop3', title: 'Social Media Campaign', contactId: 'c4', clientName: 'BlueSky Media',
    status: 'Draft', total: 6500,
    items: [
      { id: 'pi7', description: 'Strategy & Planning', qty: 1, unitPrice: 1500 },
      { id: 'pi8', description: 'Content Creation (12 posts)', qty: 12, unitPrice: 250 },
      { id: 'pi9', description: 'Campaign Management (3 months)', qty: 3, unitPrice: 500 },
    ],
    validUntil: '2026-05-01', createdAt: '2026-03-15',
    terms: 'Monthly billing.',
  },
]

// ── Proposal Templates ────────────────────────────────────────
export const sampleTemplates: ProposalTemplate[] = [
  {
    id: 'tmpl1', name: 'Website Development', category: 'Development',
    description: 'Full website design and development package',
    items: [
      { description: 'Discovery & Planning', qty: 1, unitPrice: 1000 },
      { description: 'UI/UX Design', qty: 1, unitPrice: 2500 },
      { description: 'Development', qty: 1, unitPrice: 4000 },
      { description: 'Testing & Launch', qty: 1, unitPrice: 500 },
    ],
    terms: 'Net 30. 50% deposit required.',
  },
  {
    id: 'tmpl2', name: 'Brand Identity Package', category: 'Design',
    description: 'Complete branding solution',
    items: [
      { description: 'Logo Design (3 concepts)', qty: 1, unitPrice: 1500 },
      { description: 'Brand Guidelines', qty: 1, unitPrice: 800 },
      { description: 'Business Card Design', qty: 1, unitPrice: 300 },
      { description: 'Social Media Kit', qty: 1, unitPrice: 400 },
    ],
    terms: 'Net 14. Full payment upfront.',
  },
  {
    id: 'tmpl3', name: 'Monthly Retainer', category: 'Retainer',
    description: 'Ongoing monthly support and development',
    items: [
      { description: 'Monthly Development Hours (20h)', qty: 1, unitPrice: 2000 },
      { description: 'Priority Support', qty: 1, unitPrice: 500 },
    ],
    terms: 'Monthly recurring. Cancel with 30 days notice.',
  },
]

// ── Services ──────────────────────────────────────────────────
export const sampleServices: Service[] = [
  { id: 'svc1', name: 'Website Design', category: 'Design', description: 'Custom responsive website design', defaultPrice: 3000, priceType: 'fixed', estimatedHours: 30, active: true },
  { id: 'svc2', name: 'Mobile App Development', category: 'Development', description: 'Cross-platform mobile app', defaultPrice: 120, priceType: 'hourly', estimatedHours: 80, active: true },
  { id: 'svc3', name: 'Logo Design', category: 'Design', description: 'Brand logo with 3 concepts', defaultPrice: 1500, priceType: 'fixed', estimatedHours: 15, active: true },
  { id: 'svc4', name: 'SEO Audit', category: 'Marketing', description: 'Full SEO analysis and report', defaultPrice: 1200, priceType: 'fixed', estimatedHours: 12, active: true },
  { id: 'svc5', name: 'Monthly Retainer', category: 'Retainer', description: '20h/month ongoing support', defaultPrice: 2500, priceType: 'monthly', estimatedHours: 20, active: true },
  { id: 'svc6', name: 'Content Strategy', category: 'Marketing', description: 'Editorial calendar + content plan', defaultPrice: 1000, priceType: 'fixed', estimatedHours: 10, active: true },
  { id: 'svc7', name: 'E-commerce Setup', category: 'Development', description: 'Full e-commerce platform', defaultPrice: 5000, priceType: 'fixed', estimatedHours: 50, active: true },
  { id: 'svc8', name: 'Social Media Management', category: 'Marketing', description: '12 posts/month + community management', defaultPrice: 800, priceType: 'monthly', estimatedHours: 16, active: false },
]

// ── Automations ───────────────────────────────────────────────
export const sampleAutomations: Automation[] = [
  {
    id: 'auto1', name: 'Deal Won → Create Project', enabled: true, runCount: 4, lastRun: '2026-03-10',
    description: 'Automatically create a project when a deal is marked as Won',
    trigger: 'deal_won', conditions: [], createdAt: '2026-01-01',
    actions: [
      { type: 'create_project', label: 'Create project from deal', params: { status: 'Active', assignDeadline: 30 } },
      { type: 'notify', label: 'Notify team', params: { message: 'New project created from won deal' } },
    ],
  },
  {
    id: 'auto2', name: 'Invoice Overdue → Send Reminder', enabled: true, runCount: 12, lastRun: '2026-03-20',
    description: 'Send a payment reminder email when invoice passes due date',
    trigger: 'invoice_overdue',
    conditions: [{ field: 'days_overdue', operator: 'greater_than', value: 3 }],
    createdAt: '2026-01-01',
    actions: [
      { type: 'send_email', label: 'Send reminder email', params: { template: 'payment_reminder' } },
      { type: 'add_tag', label: 'Tag client as overdue', params: { tag: 'overdue' } },
    ],
  },
  {
    id: 'auto3', name: 'New Lead → Welcome Email', enabled: true, runCount: 8, lastRun: '2026-03-18',
    description: 'Send welcome email sequence to new leads',
    trigger: 'new_lead', conditions: [], createdAt: '2026-01-15',
    actions: [
      { type: 'send_email', label: 'Send welcome email', params: { template: 'new_lead_welcome' } },
      { type: 'create_task', label: 'Create follow-up task', params: { title: 'Follow up with new lead', dueIn: 3 } },
    ],
  },
  {
    id: 'auto4', name: 'Proposal Accepted → Create Invoice', enabled: false, runCount: 2, lastRun: '2026-02-20',
    description: 'Auto-generate invoice draft when a proposal is accepted',
    trigger: 'proposal_accepted', conditions: [], createdAt: '2026-02-01',
    actions: [
      { type: 'create_invoice', label: 'Create invoice draft', params: { status: 'Draft', dueIn: 30 } },
    ],
  },
  {
    id: 'auto5', name: 'Project Completed → Request Testimonial', enabled: true, runCount: 3, lastRun: '2026-03-15',
    description: 'Send testimonial request when project is marked complete',
    trigger: 'project_completed', conditions: [], createdAt: '2026-02-15',
    actions: [
      { type: 'send_email', label: 'Send testimonial request', params: { template: 'testimonial_request' } },
    ],
  },
]

// ── Integrations ──────────────────────────────────────────────
export const sampleIntegrations: Integration[] = [
  { id: 'int1', name: 'Gmail', provider: 'gmail', status: 'disconnected' },
  { id: 'int2', name: 'Outlook', provider: 'outlook', status: 'disconnected' },
  { id: 'int3', name: 'Stripe', provider: 'stripe', status: 'disconnected' },
  { id: 'int4', name: 'Google Drive', provider: 'drive', status: 'disconnected' },
  { id: 'int5', name: 'Slack', provider: 'slack', status: 'disconnected' },
  { id: 'int6', name: 'Zapier', provider: 'zapier', status: 'disconnected' },
]
