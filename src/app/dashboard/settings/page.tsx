"use client"

import React, { useState, useEffect } from "react";
import {
  Settings,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  Bell,
  User,
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Package,
  DollarSign,
  FileText,
  Users,
  Mail,
  Shield,
  BellRing,
  Lock,
  Globe,
} from "lucide-react";

interface OptionProps {
  Icon: React.ElementType;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
}

interface TitleSectionProps {
  open: boolean;
}

interface ToggleCloseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SettingsPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Settings");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (page: string) => {
    setSelected(page);
  };

  // Mock subscription data
  const subscription = {
    plan: 'Pro',
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2026-04-15',
    amount: '$48.00',
    features: {
      activeProjects: 12,
      maxProjects: 50,
      storageUsed: '2.4 GB',
      storageTotal: '10 GB',
      invoicesSent: 24,
      clients: 15,
    }
  };

  const usageMetrics = [
    {
      label: 'Active Projects',
      used: subscription.features.activeProjects,
      total: subscription.features.maxProjects,
      percentage: (subscription.features.activeProjects / subscription.features.maxProjects) * 100,
      color: 'indigo'
    },
    {
      label: 'Storage',
      used: subscription.features.storageUsed,
      total: subscription.features.storageTotal,
      percentage: 24,
      color: 'emerald'
    },
    {
      label: 'Invoices Sent',
      used: subscription.features.invoicesSent,
      total: 'Unlimited',
      percentage: null,
      color: 'amber'
    },
    {
      label: 'Clients',
      used: subscription.features.clients,
      total: 'Unlimited',
      percentage: null,
      color: 'rose'
    }
  ];

  const quickActions = [
    { icon: CreditCard, label: 'Update Payment Method', action: 'Update' },
    { icon: Package, label: 'Change Plan', action: 'View Plans' },
    { icon: Download, label: 'Download Invoices', action: 'Download' },
    { icon: Mail, label: 'Email Preferences', action: 'Configure' },
  ];

  const securitySettings = [
    { label: 'Two-Factor Authentication', enabled: true },
    { label: 'Login Notifications', enabled: true },
    { label: 'Session Management', enabled: false },
  ];

  const notificationSettings = [
    { label: 'Email Notifications', enabled: true },
    { label: 'Push Notifications', enabled: false },
    { label: 'SMS Alerts', enabled: false },
  ];

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar 
          open={open}
          setOpen={setOpen}
          selected={selected}
          setSelected={handleNavigate}
        />
        
        {/* Main content */}
        <div className="flex-1">
          <Header isDark={isDark} setIsDark={setIsDark} />
          
          <main className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your account, subscription, and preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Subscription Overview */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Subscription Overview</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your subscription plan</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {subscription.status === 'active' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{subscription.plan} Plan</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Billing Cycle</p>
                        <p className="text-gray-900 dark:text-gray-100 capitalize">{subscription.billingCycle}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Billing Date</p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Amount</p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {subscription.amount}<span className="text-base font-normal text-gray-500 dark:text-gray-400">/month</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors font-medium text-sm">
                          <CreditCard className="h-4 w-4" />
                          Update Payment
                        </button>
                        <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm">
                          Change Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage & Limits */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Usage & Limits</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {usageMetrics.map((metric, index) => (
                      <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {metric.color === 'indigo' && <Package className="h-4 w-4 text-indigo-500" />}
                            {metric.color === 'emerald' && <BarChart2 className="h-4 w-4 text-emerald-500" />}
                            {metric.color === 'amber' && <FileText className="h-4 w-4 text-amber-500" />}
                            {metric.color === 'rose' && <Users className="h-4 w-4 text-rose-500" />}
                            <span className="font-medium text-gray-900 dark:text-gray-100">{metric.label}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {metric.total === 'Unlimited' 
                              ? `${metric.used} / Unlimited`
                              : `${metric.used} / ${metric.total}`
                            }
                          </span>
                        </div>
                        
                        {metric.percentage !== null && (
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                metric.color === 'indigo' ? 'bg-indigo-600' :
                                metric.color === 'emerald' ? 'bg-emerald-500' :
                                metric.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Security</h2>
                  </div>

                  <div className="space-y-4">
                    {securitySettings.map((setting, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{setting.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {setting.enabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <BellRing className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
                  </div>

                  <div className="space-y-4">
                    {notificationSettings.map((setting, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{setting.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {setting.enabled ? 'You will receive notifications' : 'Notifications are disabled'}
                          </p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Quick Actions */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <action.icon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-indigo-400" />
                          <span className="text-gray-700 dark:text-gray-300">{action.label}</span>
                        </div>
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{action.action}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-gray-100">user@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</p>
                      <p className="text-gray-900 dark:text-gray-100">UTC-8 (Pacific Time)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</p>
                      <p className="text-gray-900 dark:text-gray-100">English</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                      <p className="text-gray-900 dark:text-gray-100">January 2024</p>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-4">Danger Zone</h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm">
                      Delete Account
                    </button>
                    <button className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm">
                      Sign Out All Sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ open, setOpen, selected, setSelected }: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string;
  setSelected: (title: string) => void;
}) => {
  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8">
        <Option
          Icon={Settings}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Settings}
          title="Settings"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={User}
          title="Profile"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={CreditCard}
          title="Billing"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Bell}
          title="Notifications"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Lock}
          title="Security"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Account
          </div>
          <Option
            Icon={User}
            title="Profile"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={Moon}
            title="Appearance"
            selected={selected}
            setSelected={setSelected}
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
        <span className="text-sm font-medium transition-opacity duration-200">
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

const TitleSection = ({ open }: TitleSectionProps) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className="transition-opacity duration-200">
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
        {open && <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
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
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
      </svg>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: ToggleCloseProps) => {
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
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200">
            Hide
          </span>
        )}
      </div>
    </button>
  );
};

const Header = ({ isDark, setIsDark }: { isDark: boolean; setIsDark: (isDark: boolean) => void }) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default SettingsPage;