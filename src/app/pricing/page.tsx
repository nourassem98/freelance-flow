'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton } from '@clerk/nextjs';
import PricingSection4 from '../../../components/ui/pricing-section-4';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border-b border-gray-800/30 bg-black/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Freelance Flow Logo"
                  width={32}
                  height={32}
                  className="object-contain mr-2"
                />
                <span className="text-xl font-bold text-white">Freelance Flow</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link href="/sign-in">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    className="rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl border border-gray-500"
                >
                  Log In
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* New Pricing Section */}
      <PricingSection4 />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-24 border-t border-gray-800/30 bg-black/80 py-8 backdrop-blur-sm"
      >
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
          <p>© 2024 Freelance Flow. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed for freelancers, by freelancers</p>
        </div>
      </motion.footer>
    </div>
  );
}
