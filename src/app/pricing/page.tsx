'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Users, Globe, CreditCard, Headphones } from 'lucide-react';
import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';

export default function PricingPage() {
  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for freelancers just getting started',
      features: [
        { text: 'Up to 3 Clients', icon: <Users className="h-4 w-4" /> },
        { text: 'Basic Project Tracking', icon: <Zap className="h-4 w-4" /> },
        { text: 'Standard Support', icon: <Headphones className="h-4 w-4" /> },
        { text: 'Basic Analytics', icon: <Globe className="h-4 w-4" /> },
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$5',
      period: '/month',
      description: 'Everything you need to grow your freelance business',
      features: [
        { text: 'Unlimited Clients', icon: <Users className="h-4 w-4" /> },
        { text: 'Advanced Analytics', icon: <Globe className="h-4 w-4" /> },
        { text: 'Custom Invoices', icon: <CreditCard className="h-4 w-4" /> },
        { text: 'Priority Support', icon: <Headphones className="h-4 w-4" /> },
        { text: 'Project Templates', icon: <Zap className="h-4 w-4" /> },
        { text: 'Advanced Reporting', icon: <Shield className="h-4 w-4" /> },
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'primary',
      popular: true,
    },
    {
      name: 'Elite',
      price: '$25',
      period: '/month',
      description: 'For established freelancers and small teams',
      features: [
        { text: 'Everything in Pro', icon: <Check className="h-4 w-4" /> },
        { text: 'White-labeled Client Portal', icon: <Shield className="h-4 w-4" /> },
        { text: 'Team Collaboration (up to 3 users)', icon: <Users className="h-4 w-4" /> },
        { text: '24/7 Phone Support', icon: <Headphones className="h-4 w-4" /> },
        { text: 'Custom Branding', icon: <Sparkles className="h-4 w-4" /> },
        { text: 'API Access', icon: <Zap className="h-4 w-4" /> },
      ],
      buttonText: 'Go Elite',
      buttonVariant: 'secondary',
      popular: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-black text-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border-b border-gray-800/30 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                </div>
                <span className="ml-3 text-xl font-bold text-white">Freelance Flow</span>
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
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Log In
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Choose the perfect plan for your freelance business
          </p>
        </motion.div>

        {/* Pricing Cards with Magic Border */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative rounded-2xl group ${
                plan.popular ? 'border-indigo-500/50' : 'border-white/10'
              } border`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                  <div className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Spinning Neon Layer - Contained within card */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl pointer-events-none z-0">
                <div className="absolute inset-[-50%]"
                     style={{
                       background: 'conic-gradient(from 0deg, transparent 0%, #818cf8 25%, transparent 50%, #a855f7 75%, transparent 100%)',
                     }}
                >
                  <style jsx>{`
                    @keyframes spin {
                      from {
                        transform: rotate(0deg);
                      }
                      to {
                        transform: rotate(360deg);
                      }
                    }
                    .animate-spin-slow {
                      animation: spin 4s linear infinite;
                    }
                  `}</style>
                  <div className="absolute inset-0 animate-spin-slow"></div>
                </div>
              </div>
              
              {/* Inner Card Content */}
              <div className="relative rounded-2xl p-8 z-10 bg-gradient-to-b from-indigo-500/5 to-purple-600/5 h-full">
                <div className="relative z-20 flex flex-col h-full">
                  {/* Plan Header */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline justify-center">
                      <span className="text-5xl font-bold tracking-tight text-white">
                        {plan.price}
                      </span>
                      <span className="ml-2 text-lg text-gray-400">{plan.period}</span>
                    </div>
                    <p className="mt-4 text-gray-300">{plan.description}</p>
                  </div>

                  {/* Features List */}
                  <ul className="mt-8 space-y-4 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 mr-3 mt-0.5">
                          {feature.icon}
                        </div>
                        <span className="text-gray-300">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button - Fixed at bottom */}
                  <div className="mt-auto pt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full rounded-lg py-3 text-center font-medium transition-all cursor-pointer ${
                        plan.buttonVariant === 'primary'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                          : plan.buttonVariant === 'secondary'
                          ? 'border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 hover:scale-105 active:scale-95'
                          : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {plan.buttonText}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Can I switch plans later?</h3>
              <p className="mt-2 text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Is there a free trial?</h3>
              <p className="mt-2 text-gray-400">
                All paid plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Can I cancel anytime?</h3>
              <p className="mt-2 text-gray-400">
                Absolutely. You can cancel your subscription at any time, and you'll retain access until the end of your billing period.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/30 px-8 py-12 text-center shadow-2xl backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold text-white">Ready to Streamline Your Workflow?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-indigo-200">
            Join thousands of freelancers who use Freelance Flow to manage their business more efficiently
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl"
              >
                Start Free Trial
              </motion.button>
            </Link>
            <Link href="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg border border-gray-700 bg-gray-800/50 px-8 py-3 text-lg font-medium text-gray-300 transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                Back to Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-24 border-t border-gray-800/30 bg-[#020617]/80 py-8 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-400">
          <p>© 2024 Freelance Flow. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed for freelancers, by freelancers</p>
        </div>
      </motion.footer>
    </div>
  );
}