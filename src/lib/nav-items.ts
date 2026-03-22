import {
  LayoutDashboard, Users, DollarSign, FolderKanban, FileText,
  Calendar, BarChart3, Sparkles, Clock, FileSignature,
  Zap, Globe, Package,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  Icon: LucideIcon
  title: string
  href: string
  notifs?: number
  group?: string
}

export const navItems: NavItem[] = [
  // Main
  { Icon: LayoutDashboard, title: 'Dashboard',     href: '/dashboard',               group: 'main' },
  // CRM
  { Icon: Users,           title: 'CRM',           href: '/dashboard/crm',           group: 'crm' },
  { Icon: DollarSign,      title: 'Sales',         href: '/dashboard/sales',         group: 'crm' },
  { Icon: FileSignature,   title: 'Proposals',     href: '/dashboard/proposals',     group: 'crm' },
  // Work
  { Icon: FolderKanban,    title: 'Projects',      href: '/dashboard/projects',      group: 'work' },
  { Icon: Clock,           title: 'Time Tracking', href: '/dashboard/time-tracking', group: 'work' },
  { Icon: FileText,        title: 'Invoices',      href: '/dashboard/invoices',      group: 'work' },
  // Tools
  { Icon: Calendar,        title: 'Calendar',      href: '/dashboard/calendar',      group: 'tools' },
  { Icon: BarChart3,       title: 'Analytics',     href: '/dashboard/analytics',     group: 'tools' },
  { Icon: Sparkles,        title: 'AI Agent',      href: '/dashboard/ai-agent',      group: 'tools' },
  // Automation & more
  { Icon: Zap,             title: 'Automation',    href: '/dashboard/automation',    group: 'automation' },
  { Icon: Globe,           title: 'Client Portal', href: '/dashboard/portal',        group: 'automation' },
  { Icon: Package,         title: 'Services',      href: '/dashboard/services',      group: 'automation' },
  { Icon: Users,           title: 'Members',       href: '/dashboard/members',       group: 'automation' },
]
