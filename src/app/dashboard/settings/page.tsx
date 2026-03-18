'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Package,
  DollarSign,
  FileText,
  Users
} from 'lucide-react';

export default function SettingsPage() {
  // Mock data - in a real app, this would come from your backend/Clerk
  const subscription = {
    plan: 'Pro',
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2024-04-15',
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

  const billingHistory = [
    {
      id: 'INV-2024-001',
      date: '2024-03-15',
      amount: '$48.00',
      status: 'paid',
      description: 'Pro Plan - Monthly Subscription'
    },
    {
      id: 'INV-2024-002',
      date: '2024-02-15',
      amount: '$48.00',
      status: 'paid',
      description: 'Pro Plan - Monthly Subscription'
    },
    {
      id: 'INV-2024-003',
      date: '2024-01-15',
      amount: '$48.00',
      status: 'paid',
      description: 'Pro Plan - Monthly Subscription'
    },
  ];

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
      percentage: 24, // 2.4/10 = 24%
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your subscription, billing, and account preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Subscription Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscription Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Subscription Overview</h2>
                    <p className="text-gray-600 mt-1">Manage your subscription plan</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
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
                      <p className="text-sm font-medium text-gray-500">Current Plan</p>
                      <p className="text-2xl font-bold text-gray-900">{subscription.plan} Plan</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Billing Cycle</p>
                      <p className="text-gray-900 capitalize">{subscription.billingCycle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
                      <p className="text-gray-900">{new Date(subscription.nextBillingDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Monthly Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">{subscription.amount}<span className="text-base font-normal text-gray-500">/month</span></p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="/billing"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                      >
                        <CreditCard className="h-4 w-4" />
                        Update Payment
                      </a>
                      <a
                        href="/pricing"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Change Plan
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart2 className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Usage & Limits</h2>
                </div>
                
                <div className="space-y-6">
                  {usageMetrics.map((metric, index) => (
                    <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {metric.color === 'indigo' && <Package className="h-4 w-4 text-indigo-500" />}
                          {metric.color === 'emerald' && <BarChart2 className="h-4 w-4 text-emerald-500" />}
                          {metric.color === 'amber' && <FileText className="h-4 w-4 text-amber-500" />}
                          {metric.color === 'rose' && <Users className="h-4 w-4 text-rose-500" />}
                          <span className="font-medium text-gray-900">{metric.label}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {metric.total === 'Unlimited' 
                            ? `${metric.used} / Unlimited`
                            : `${metric.used} / ${metric.total}`
                          }
                        </span>
                      </div>
                      
                      {metric.percentage !== null && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
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

              {/* Billing History */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Invoice</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingHistory.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <span className="font-mono text-sm text-gray-900">{invoice.id}</span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(invoice.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{invoice.description}</td>
                          <td className="py-4 px-4 text-right font-semibold text-gray-900">{invoice.amount}</td>
                          <td className="py-4 px-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3" />
                              Paid
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="Download Invoice"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right column - Quick Actions & Billing Info */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <a
                    href="/billing"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                      <span className="text-gray-700">Update Payment Method</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                  </a>
                  <a
                    href="/pricing"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                      <span className="text-gray-700">Change Plan</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                  </a>
                  <button className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                      <span className="text-gray-700">View VAT Details</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                  </button>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">Visa ending in 4242</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Billing Address</p>
                    <p className="text-gray-900 mt-1">
                      123 Freelancer Street<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tax ID</p>
                    <p className="text-gray-900 mt-1">US-123456789</p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Our support team is here to assist you with any billing or subscription questions.
                </p>
                <a
                  href="#"
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}