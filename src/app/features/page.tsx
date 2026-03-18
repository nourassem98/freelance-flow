'use client';

import { Features } from '@/components/blocks/features-7';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturesPage() {
  const solutions = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client Management",
      description: "Organize all your clients in one place with detailed profiles, communication history, and project tracking.",
      features: ["Contact management", "Communication logs", "Client portal access", "Custom fields"]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Project Tracking",
      description: "Monitor project progress, deadlines, and milestones with intuitive dashboards and automated reminders.",
      features: ["Task management", "Time tracking", "Deadline alerts", "Progress reports"]
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Financial Management",
      description: "Create professional invoices, track payments, and monitor your revenue with comprehensive financial tools.",
      features: ["Invoice generation", "Payment tracking", "Revenue analytics", "Expense management"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Business Intelligence",
      description: "Gain insights into your freelance business with detailed analytics and performance metrics.",
      features: ["Performance dashboards", "Client analytics", "Revenue forecasting", "Custom reports"]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Animation */}
      <motion.div
        className="relative w-full py-24 bg-black overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Powerful Features for Freelancers
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Everything you need to manage your freelance business efficiently
          </motion.p>
        </div>
      </motion.div>

      {/* Features Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Features />
      </motion.div>

      {/* Solutions Grid Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Every Need
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From client management to financial tracking, we've got you covered with tools designed specifically for freelancers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-blue-400 mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                <p className="text-gray-400 mb-6">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Freelance Business?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers who have already streamlined their workflow and increased their revenue with Freelance Flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                View Pricing
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 border border-gray-600 text-white px-8 py-4 rounded-full font-semibold hover:border-gray-500 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-8">
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
