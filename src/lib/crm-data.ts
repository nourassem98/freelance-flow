import type { Invoice, Deal, Project } from './crm-types'

export const sampleInvoices: Invoice[] = [
  {
    id: 'INV-2026-001',
    client: 'Acme Corp',
    items: [{ description: 'Website Redesign', qty: 1, unitPrice: 2500 }],
    amount: 2500,
    status: 'Paid',
    issueDate: '2026-03-01',
    dueDate: '2026-03-31',
  },
  {
    id: 'INV-2026-002',
    client: 'TechStart Inc',
    items: [{ description: 'Mobile App UI', qty: 1, unitPrice: 1800 }],
    amount: 1800,
    status: 'Pending',
    issueDate: '2026-03-05',
    dueDate: '2026-04-05',
  },
  {
    id: 'INV-2026-003',
    client: 'Global Solutions',
    items: [{ description: 'Brand Identity Package', qty: 1, unitPrice: 3200 }],
    amount: 3200,
    status: 'Paid',
    issueDate: '2026-03-08',
    dueDate: '2026-04-08',
  },
  {
    id: 'INV-2026-004',
    client: 'StartupXYZ',
    items: [{ description: 'Logo Design', qty: 1, unitPrice: 950 }],
    amount: 950,
    status: 'Overdue',
    issueDate: '2026-02-20',
    dueDate: '2026-03-05',
  },
  {
    id: 'INV-2026-005',
    client: 'Innovation Labs',
    items: [
      { description: 'Marketing Dashboard', qty: 1, unitPrice: 3500 },
      { description: 'Analytics Setup', qty: 1, unitPrice: 1000 },
    ],
    amount: 4500,
    status: 'Paid',
    issueDate: '2026-03-10',
    dueDate: '2026-04-10',
  },
]

export const sampleDeals: Deal[] = [
  { id: 'd1', client: 'Nexus Labs',    value: 8000,  stage: 'New Lead',    notes: 'Interested in full-stack web app',   createdAt: '2026-03-01' },
  { id: 'd2', client: 'Pulse Agency',  value: 3500,  stage: 'Contacted',   notes: 'Sent proposal, awaiting feedback',   createdAt: '2026-03-05' },
  { id: 'd3', client: 'Orbit Inc',     value: 12000, stage: 'Negotiation', notes: 'Discussing scope and timeline',      createdAt: '2026-03-10' },
  { id: 'd4', client: 'Acme Corp',     value: 5000,  stage: 'Won',         notes: 'Contract signed, project starting', createdAt: '2026-02-15' },
  { id: 'd5', client: 'OldBrand Ltd',  value: 2000,  stage: 'Lost',        notes: 'Went with a cheaper competitor',    createdAt: '2026-02-20' },
  { id: 'd6', client: 'BlueSky Media', value: 6500,  stage: 'Contacted',   notes: 'Demo call scheduled next week',     createdAt: '2026-03-18' },
  { id: 'd7', client: 'TechStart Inc', value: 9000,  stage: 'Negotiation', notes: 'Finalizing payment terms',          createdAt: '2026-03-12' },
]

export const sampleProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    client: 'Acme Corp',
    status: 'Active',
    deadline: '2026-04-15',
    tasks: [
      { id: 't1', title: 'Wireframes',      status: 'Done',        projectId: 'p1' },
      { id: 't2', title: 'UI Design',       status: 'In Progress', projectId: 'p1' },
      { id: 't3', title: 'Frontend Dev',    status: 'Todo',        projectId: 'p1' },
      { id: 't4', title: 'CMS Integration', status: 'Todo',        projectId: 'p1' },
    ],
  },
  {
    id: 'p2',
    name: 'Mobile App',
    client: 'TechStart Inc',
    status: 'Active',
    deadline: '2026-05-01',
    tasks: [
      { id: 't5', title: 'Requirements', status: 'Done',        projectId: 'p2' },
      { id: 't6', title: 'Architecture', status: 'Done',        projectId: 'p2' },
      { id: 't7', title: 'Auth Flow',    status: 'In Progress', projectId: 'p2' },
      { id: 't8', title: 'Dashboard UI', status: 'Todo',        projectId: 'p2' },
    ],
  },
  {
    id: 'p3',
    name: 'Brand Identity',
    client: 'Global Solutions',
    status: 'Completed',
    deadline: '2026-03-15',
    tasks: [
      { id: 't9',  title: 'Logo Design',      status: 'Done', projectId: 'p3' },
      { id: 't10', title: 'Brand Guidelines', status: 'Done', projectId: 'p3' },
      { id: 't11', title: 'Print Assets',     status: 'Done', projectId: 'p3' },
    ],
  },
  {
    id: 'p4',
    name: 'E-commerce Platform',
    client: 'StartupXYZ',
    status: 'On Hold',
    deadline: '2026-06-01',
    tasks: [
      { id: 't12', title: 'Product Catalog',  status: 'In Progress', projectId: 'p4' },
      { id: 't13', title: 'Payment Gateway',  status: 'Todo',        projectId: 'p4' },
    ],
  },
]
