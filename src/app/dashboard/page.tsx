'use client'

import MetricCard from '@/components/MetricCard'
import { AIVoiceInput } from '../../../components/ui/ai-voice-input'
import MonthlyRevenueTrend from '@/components/MonthlyRevenueTrend'
import { FolderKanban, FileText, Calendar } from 'lucide-react'

export default function DashboardPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to Freelance Flow
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your personal CRM — manage clients, projects, and invoices in one place.
        </p>
      </div>

      {/* Metric cards */}
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

      {/* AI Voice Assistant */}
      <div className="mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            AI Voice Assistant
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Click the microphone to record. The AI will extract invoices, projects,
            meetings, and deadlines from your speech.
          </p>
          <div className="mt-4">
            <AIVoiceInput onStart={() => {}} onStop={() => {}} />
          </div>
        </div>
      </div>

      {/* Recent activity + revenue chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { action: 'Invoice #INV-2026-001 sent',         client: 'Acme Corp',        time: '2 hours ago' },
              { action: 'Project "Website Redesign" updated', client: 'TechStart Inc',    time: '1 day ago' },
              { action: 'New client onboarded',               client: 'Global Solutions', time: '2 days ago' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.client}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <MonthlyRevenueTrend />
      </div>
    </>
  )
}
