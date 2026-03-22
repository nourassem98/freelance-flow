'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Bell, Moon, Sun, Settings, LogOut } from 'lucide-react'
import DashboardSidebar from '@/components/DashboardSidebar'
import { navItems } from '@/lib/nav-items'

const mockNotifications = [
  { id: 1, title: 'Invoice #INV-003 is overdue', time: '2h ago', read: false },
  { id: 2, title: 'New deal added: Innovation Labs', time: '5h ago', read: false },
  { id: 3, title: 'Website Redesign deadline tomorrow', time: '1d ago', read: true },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeTitle =
    navItems.find((item) => item.href === pathname)?.title ?? 'Dashboard'

  const handleNavigate = (title: string) => {
    const item = navItems.find((i) => i.title === title)
    if (item?.href) router.push(item.href)
  }

  const userName =
    user
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'User'
      : 'User'
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? ''
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <DashboardSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          selected={activeTitle}
          setSelected={handleNavigate}
          menuItems={navItems}
          userName={userName}
          userEmail={userEmail}
        />

        <div className="flex flex-col flex-1 min-w-0">
          {/* Shared top header */}
          <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {activeTitle}
              </h2>
              <div className="flex items-center gap-3">
                {/* Notification bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications((v) => !v)}
                    className="relative p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          Notifications
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                          Mark all read
                        </span>
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {mockNotifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              !n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                            }`}
                          >
                            <div
                              className={`mt-2 h-2 w-2 rounded-full flex-shrink-0 ${
                                !n.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {n.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                {/* Settings */}
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>

                {/* Sign out */}
                <button
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
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
