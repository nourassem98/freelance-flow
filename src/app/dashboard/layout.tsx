'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Moon, Sun, User } from 'lucide-react'
import DashboardSidebar from '@/components/DashboardSidebar'
import { navItems } from '@/lib/nav-items'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  const activeTitle =
    navItems.find((item) => item.href === pathname)?.title ?? 'Dashboard'

  const handleNavigate = (title: string) => {
    const item = navItems.find((i) => i.title === title)
    if (item?.href) router.push(item.href)
  }

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <DashboardSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          selected={activeTitle}
          setSelected={handleNavigate}
          menuItems={navItems}
        />

        <div className="flex flex-col flex-1 min-w-0">
          {/* Shared top header */}
          <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {activeTitle}
              </h2>
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                </button>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
