"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MetricCard from '@/components/MetricCard';
import { AIVoiceInput } from '../../../components/ui/ai-voice-input';
import MonthlyRevenueTrend from '@/components/MonthlyRevenueTrend';
import { FolderKanban, FileText, Calendar, Bell, Moon, Sun, User, DollarSign, Monitor, BarChart3, Users } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

const menuItems = [
  { Icon: FolderKanban, title: 'Dashboard', href: '/dashboard' },
  { Icon: DollarSign, title: 'Sales', href: '/dashboard/sales' },
  { Icon: Monitor, title: 'View Site', href: '/' },
  { Icon: FolderKanban, title: 'Projects', href: '/dashboard/projects' },
  { Icon: FileText, title: 'Invoices', href: '/dashboard/invoices' },
  { Icon: Calendar, title: 'Calendar', href: '/dashboard/calendar' },
  { Icon: BarChart3, title: 'Analytics', href: '/dashboard/analytics' },
  { Icon: Users, title: 'Members', href: '/dashboard/members' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("Dashboard");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (page: string) => {
    // Find the menu item to get the href
    const menuItem = menuItems.find(item => item.title === page);
    if (menuItem?.href) {
      setCurrentPage(page);
      router.push(menuItem.href);
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <DashboardSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          selected={currentPage}
          setSelected={handleNavigate}
          menuItems={menuItems}
        />
        
        {/* Main content */}
        <div className="flex-1">
          <main className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome to Freelance Flow</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Your personal CRM dashboard for managing clients, projects, and invoices.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
                <button className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Metric cards grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <MetricCard
                title="Active Projects"
                value="12"
                change="+2 from last month"
                trend="up"
                icon={<FolderKanban size={24} />}
                color="indigo"
              />
              <MetricCard
                title="Unpaid Invoices"
                value="$8,450"
                change="Due in 7 days"
                trend="neutral"
                icon={<FileText size={24} />}
                color="amber"
              />
              <MetricCard
                title="Upcoming Deadlines"
                value="5"
                change="2 this week"
                trend="down"
                icon={<Calendar size={24} />}
                color="emerald"
              />
            </div>

            {/* AI Voice Input Section */}
            <div className="mb-8">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Voice Assistant</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Click the microphone to start voice recording. The AI will extract invoices, projects, meetings, and deadlines from your speech.
                </p>
                <div className="mt-4">
                  <AIVoiceInput 
                    onStart={() => console.log('Recording started')}
                    onStop={(duration: number) => console.log(`Recording stopped. Duration: ${duration} seconds`)}
                  />
                </div>
              </div>
            </div>

            {/* Additional content sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent activity */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
                <div className="mt-4 space-y-4">
                  {[
                    { action: 'Invoice #INV-2024-001 sent', client: 'Acme Corp', time: '2 hours ago' },
                    { action: 'Project "Website Redesign" updated', client: 'TechStart Inc', time: '1 day ago' },
                    { action: 'New client onboarded', client: 'Global Solutions', time: '2 days ago' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.action}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.client}</p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Revenue Trend chart */}
              <MonthlyRevenueTrend />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}