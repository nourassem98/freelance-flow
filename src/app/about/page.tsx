'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-8">
            About{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Freelance Flow
            </span>
          </h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Built by freelancers, for freelancers. We wanted to create the ultimate tool to manage clients, track projects, and get paid on time without the clutter.
            </p>

            <div className="space-y-6 text-gray-300">
              <p className="leading-relaxed">
              Freelance Flow was born out of frustration. As freelancers ourselves, we spent countless hours juggling spreadsheets, chasing invoices, and trying to keep track of client communications across multiple platforms. We knew there had to be a better way.
              </p>

              <p className="leading-relaxed">
              That's why we built Freelance Flow - a comprehensive CRM designed specifically for the unique needs of freelancers and independent professionals. Our mission is simple: to give you back your time so you can focus on what you do best - creating amazing work for your clients.
              </p>

              <p className="leading-relaxed">
              We believe that managing your freelance business shouldn't feel like a second job. With Freelance Flow, you can organize your clients, track your projects, send professional invoices, and monitor your revenue - all from one beautiful, intuitive dashboard.
              </p>

              <p className="leading-relaxed">
              Our team is passionate about helping freelancers succeed. We're constantly improving the platform based on feedback from our community of users, and we're committed to building the best possible tool for independent professionals worldwide.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">Our Values</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400">•</span>
                  <span><strong className="text-white">Simplicity:</strong> We believe the best tools are the ones you don't have to think about.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400">•</span>
                  <span><strong className="text-white">Focus:</strong> Freelance Flow is built exclusively for freelancers, not generic businesses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400">•</span>
                  <span><strong className="text-white">Transparency:</strong> No hidden fees, no complicated pricing tiers. Just straightforward value.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400">•</span>
                  <span><strong className="text-white">Community:</strong> We're building more than a product - we're building a community of successful freelancers.</span>
                </li>
              </ul>
            </div>

            <div className="mt-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#020617] py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-400">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 relative mr-2">
              <Image
                src="/logo.png"
                alt="Freelance Flow Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Freelance Flow</span>
          </div>
          <p>© 2026 Freelance Flow. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed for freelancers, by freelancers</p>
        </div>
      </footer>
    </div>
  );
}