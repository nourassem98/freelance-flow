'use client';

import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/nextjs';
import { ArrowRight, BarChart3, Users, FileText, Shield, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const featureCards = [
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Client Management",
      description: "Organize all your clients in one place with detailed profiles",
      color: "indigo"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      title: "Project Tracking",
      description: "Monitor project progress, deadlines, and milestones",
      color: "emerald"
    },
    {
      icon: <FileText className="h-6 w-6 text-amber-600" />,
      title: "Invoice System",
      description: "Create, send, and track invoices with automated reminders",
      color: "amber"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
      color: "blue"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">Freelance Flow</span>
            </div>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Log In
                </motion.button>
              </SignInButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Manage Your Freelance Business
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                with Ease
              </span>
            </h1>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Freelance Flow is your personal CRM dashboard designed to help you manage clients, 
              track projects, and handle invoices—all in one beautiful, intuitive interface.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div animate={floatingAnimation}>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </SignInButton>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-lg"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
              Built specifically for freelancers who want to streamline their workflow
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardItem}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-indigo-300"
              >
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                  card.color === 'indigo' ? 'bg-indigo-100' :
                  card.color === 'emerald' ? 'bg-emerald-100' :
                  card.color === 'amber' ? 'bg-amber-100' :
                  'bg-blue-100'
                }`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-center shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-white">Ready to Streamline Your Workflow?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
            Join thousands of freelancers who use Freelance Flow to manage their business more efficiently
          </p>
          <div className="mt-8">
            <motion.div animate={floatingAnimation}>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-white px-8 py-3 text-lg font-medium text-indigo-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
                >
                  Start Free Trial
                </motion.button>
              </SignInButton>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-24 border-t border-gray-200 bg-white py-8"
      >
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-600">
          <p>© 2024 Freelance Flow. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed for freelancers, by freelancers</p>
        </div>
      </motion.footer>
    </div>
  );
}
