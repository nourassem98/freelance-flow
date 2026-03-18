"use client";

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import MonthlyRevenueTrend from '@/components/MonthlyRevenueTrend';
import { AIVoiceInput } from '../../../components/ui/ai-voice-input';
import { FolderKanban, FileText, Calendar } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6">
          {/* Welcome heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Freelance Flow</h1>
            <p className="mt-2 text-gray-600">
              Your personal CRM dashboard for managing clients, projects, and invoices.
            </p>
          </div>

          {/* Metric cards grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">AI Voice Assistant</h2>
              <p className="mt-2 text-gray-600">
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
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent activity */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <div className="mt-4 space-y-4">
                {[
                  { action: 'Invoice #INV-2024-001 sent', client: 'Acme Corp', time: '2 hours ago' },
                  { action: 'Project "Website Redesign" updated', client: 'TechStart Inc', time: '1 day ago' },
                  { action: 'New client onboarded', client: 'Global Solutions', time: '2 days ago' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.client}</p>
                    </div>
                    <span className="text-sm text-gray-500">{item.time}</span>
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
  );
}