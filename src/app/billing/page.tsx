'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, Calendar, Lock, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function BillingPage() {
  const billingFeatures = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Secure Payments",
      description: "All transactions are encrypted and secure"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Flexible Billing",
      description: "Monthly or yearly billing options available"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Cancel Anytime",
      description: "No long-term contracts, cancel whenever you want"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6">
          {/* Welcome heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
            <p className="mt-2 text-gray-600">
              You're just one step away from unlocking the full potential of Freelance Flow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Billing Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Payment Details</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="123"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  Complete Subscription
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <p className="text-sm text-gray-500 mt-4 text-center">
                By subscribing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pro Plan (Monthly)</span>
                    <span className="font-semibold text-gray-900">$48/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Setup Fee</span>
                    <span className="font-semibold text-gray-900">$0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-indigo-600">$48/month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-900">What's Included</h3>
                <ul className="space-y-3">
                  {billingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="text-indigo-600 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <Link
                  href="/pricing"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ← Back to Pricing
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}