'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Package,
  FileText,
  Users,
  Mail,
  Shield,
  BellRing,
} from 'lucide-react'

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
  },
}

const usageMetrics = [
  {
    label: 'Active Projects',
    used: subscription.features.activeProjects,
    total: subscription.features.maxProjects,
    percentage: (subscription.features.activeProjects / subscription.features.maxProjects) * 100,
    color: 'indigo',
    Icon: Package,
  },
  {
    label: 'Storage',
    used: subscription.features.storageUsed,
    total: subscription.features.storageTotal,
    percentage: 24,
    color: 'emerald',
    Icon: BarChart2,
  },
  {
    label: 'Invoices Sent',
    used: subscription.features.invoicesSent,
    total: 'Unlimited',
    percentage: null,
    color: 'amber',
    Icon: FileText,
  },
  {
    label: 'Clients',
    used: subscription.features.clients,
    total: 'Unlimited',
    percentage: null,
    color: 'rose',
    Icon: Users,
  },
]

const quickActions = [
  { icon: CreditCard, label: 'Update Payment Method', action: 'Update' },
  { icon: Package, label: 'Change Plan', action: 'View Plans' },
  { icon: Download, label: 'Download Invoices', action: 'Download' },
  { icon: Mail, label: 'Email Preferences', action: 'Configure' },
]

export default function SettingsPage() {
  const { user } = useUser()
  const [securitySettings, setSecuritySettings] = useState([
    { label: 'Two-Factor Authentication', enabled: true },
    { label: 'Login Notifications', enabled: true },
    { label: 'Session Management', enabled: false },
  ])

  const [notificationSettings, setNotificationSettings] = useState([
    { label: 'Email Notifications', enabled: true },
    { label: 'Push Notifications', enabled: false },
    { label: 'SMS Alerts', enabled: false },
  ])

  const toggleSecurity = (i: number) =>
    setSecuritySettings((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, enabled: !s.enabled } : s))
    )

  const toggleNotification = (i: number) =>
    setNotificationSettings((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, enabled: !s.enabled } : s))
    )

  const userName =
    user
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'User'
      : 'User'
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? '—'
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account, subscription, and preferences.
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={userName}
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{userName}</h2>
              <p className="text-gray-500 dark:text-gray-400">{userEmail}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {subscription.plan} Plan
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Subscription Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your subscription plan
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Current Plan
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {subscription.plan} Plan
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Billing Cycle
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">
                    {subscription.billingCycle}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Next Billing Date
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Monthly Amount
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {subscription.amount}
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      /month
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
                    <CreditCard className="h-4 w-4" />
                    Update Payment
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm">
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Usage &amp; Limits
              </h2>
            </div>
            <div className="space-y-6">
              {usageMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <metric.Icon
                        className={`h-4 w-4 ${
                          metric.color === 'indigo'
                            ? 'text-indigo-500'
                            : metric.color === 'emerald'
                            ? 'text-emerald-500'
                            : metric.color === 'amber'
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {metric.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {metric.used} / {metric.total}
                    </span>
                  </div>
                  {metric.percentage !== null && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.color === 'indigo'
                            ? 'bg-indigo-600'
                            : metric.color === 'emerald'
                            ? 'bg-emerald-500'
                            : metric.color === 'amber'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                      />
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
              {securitySettings.map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{setting.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {setting.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSecurity(i)}
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
              {notificationSettings.map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{setting.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {setting.enabled
                        ? 'You will receive notifications'
                        : 'Notifications are disabled'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification(i)}
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

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
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
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {action.action}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-gray-100">{userName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-gray-100">{userEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan</p>
                <p className="text-gray-900 dark:text-gray-100">{subscription.plan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Member Since
                </p>
                <p className="text-gray-900 dark:text-gray-100">{memberSince}</p>
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
    </>
  )
}
