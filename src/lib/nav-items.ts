import {
  LayoutDashboard,
  DollarSign,
  FolderKanban,
  FileText,
  Calendar,
  BarChart3,
  Sparkles,
  Users,
  Monitor,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  Icon: LucideIcon
  title: string
  href: string
  notifs?: number
}

export const navItems: NavItem[] = [
  { Icon: LayoutDashboard, title: 'Dashboard', href: '/dashboard' },
  { Icon: DollarSign,      title: 'Sales',     href: '/dashboard/sales' },
  { Icon: FolderKanban,    title: 'Projects',  href: '/dashboard/projects' },
  { Icon: FileText,        title: 'Invoices',  href: '/dashboard/invoices' },
  { Icon: Calendar,        title: 'Calendar',  href: '/dashboard/calendar' },
  { Icon: BarChart3,       title: 'Analytics', href: '/dashboard/analytics' },
  { Icon: Sparkles,        title: 'AI Agent',  href: '/dashboard/ai-agent' },
  { Icon: Users,           title: 'Members',   href: '/dashboard/members' },
  { Icon: Monitor,         title: 'View Site', href: '/' },
]
