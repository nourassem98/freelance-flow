"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  DollarSign,
  Monitor,
  ShoppingCart,
  Tag,
  BarChart3,
  Users,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  TrendingUp,
  Activity,
  Package,
  Bell,
  Settings,
  HelpCircle,
  User,
  LucideIcon,
} from "lucide-react";
import MetricCard from '@/components/MetricCard';
import { AIVoiceInput } from '../../../components/ui/ai-voice-input';
import MonthlyRevenueTrend from '@/components/MonthlyRevenueTrend';
import { FolderKanban, FileText, Calendar } from 'lucide-react';

interface OptionProps {
  Icon: LucideIcon;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
}

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar = ({ onNavigate, currentPage }: SidebarProps) => {
  const [open, setOpen] = useState(true);

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8">
        <Option
          Icon={Home}
          title="Dashboard"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
        />
        <Option
          Icon={DollarSign}
          title="Sales"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
          notifs={3}
        />
        <Option
          Icon={Monitor}
          title="View Site"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
        />
        <Option
          Icon={FolderKanban}
          title="Projects"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
        />
        <Option
          Icon={FileText}
          title="Invoices"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
        />
        <Option
          Icon={Calendar}
          title="Calendar"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
        />
        <Option
          Icon={BarChart3}
          title="Analytics"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
        />
        <Option
          Icon={Users}
          title="Members"
          selected={currentPage}
          setSelected={onNavigate}
          open={open}
          notifs={12}
        />
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Account
          </div>
          <Option
            Icon={Settings}
            title="Settings"
            selected={currentPage}
            setSelected={onNavigate}
            open={open}
          />
          <Option
            Icon={HelpCircle}
            title="Help & Support"
            selected={currentPage}
            setSelected={onNavigate}
            open={open}
          />
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }: OptionProps) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Freelance Flow
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Pro Plan
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
      <svg
        width="20"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        />
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        />
      </svg>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Hide
          </span>
        )}
      </div>
    </button>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    
    // Navigate to the appropriate route
    switch (page) {
      case 'Dashboard':
        router.push('/dashboard');
        break;
      case 'Sales':
        router.push('/dashboard/sales');
        break;
      case 'View Site':
        router.push('/');
        break;
      case 'Projects':
        router.push('/dashboard/projects');
        break;
      case 'Invoices':
        router.push('/dashboard/invoices');
        break;
      case 'Calendar':
        router.push('/dashboard/calendar');
        break;
      case 'Analytics':
        router.push('/dashboard/analytics');
        break;
      case 'Members':
        router.push('/dashboard/members');
        break;
      case 'Settings':
        router.push('/dashboard/settings');
        break;
      case 'Help & Support':
        router.push('/dashboard/help');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
        
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