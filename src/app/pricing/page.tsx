'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton } from '@clerk/nextjs';
import PricingSection4 from '../../../components/ui/pricing-section-4';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
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
