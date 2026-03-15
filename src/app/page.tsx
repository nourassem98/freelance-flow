'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowRight, Users, Layers, CreditCard, Shield, Sparkles, Globe, Zap, Lock } from 'lucide-react';
import Robot3D from '@/components/Robot3D';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const featureCards = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client Management",
      description: "Organize all your clients in one place with detailed profiles",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Project Tracking",
      description: "Monitor project progress, deadlines, and milestones",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Invoice System",
      description: "Create, send, and track invoices with automated reminders",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Developer",
      quote: "Freelance Flow transformed how I manage my clients. It's intuitive and saves me hours every week.",
    },
    {
      name: "Michael Chen",
      role: "Graphic Designer",
      quote: "The invoice system alone has recovered thousands in late payments. Highly recommend.",
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Consultant",
      quote: "Finally a tool that understands freelancers' needs. Project tracking is seamless.",
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Navigation - Clean & Minimal */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border-b border-gray-800 bg-[#020617] sticky top-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8">
                  <Image
                    src="/FavIcon.png"
                    alt="Freelance Flow Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                </div>
                <span className="ml-3 text-xl font-bold text-white">Freelance Flow</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Pricing
              </Link>
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

      {/* Hero Section - Centered & Minimal */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left lg:w-1/2"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              The CRM for Freelancers
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 lg:mx-0">
              Manage clients, track projects, and handle invoices—all in one simple, beautiful interface.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Get Started Free
                </motion.button>
              </SignInButton>
              <Link href="/pricing">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg border border-gray-700 bg-white/5 px-8 py-3 text-lg font-medium text-gray-300 transition-all hover:bg-white/10 hover:border-gray-600"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* 3D Robot Mascot with Zero-Gravity Floating Animation */}
          <motion.div
            className="relative lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Robot3D />
          </motion.div>
        </div>

        {/* Features Section - Clean Cards with Floating Effects */}
        <div className="mt-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white">Everything You Need</h2>
            <motion.p 
              className="mx-auto mt-4 max-w-2xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Built specifically for freelancers who want to streamline their workflow
            </motion.p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative rounded-2xl group overflow-hidden p-[1px] border border-gray-800 h-full"
              >
                {/* Magic Moving Border for the entire card */}
                <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#818cf8_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Inner Card Content */}
                <div className="relative rounded-2xl bg-[#020617] p-6 text-center backdrop-blur-sm h-full flex flex-col z-10">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-gray-400 flex-grow">
                    {card.description}
                  </p>
                  
                  {/* Learn More Button with Simple Hover Effect */}
                  <div className="mt-6">
                    <button className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-6 py-1 text-sm font-medium text-white transition-all hover:bg-slate-900 hover:scale-105 active:scale-95">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview with 3D Tilt Effect */}
        <div className="mt-24">
          <motion.div 
            className="text-center mb-8"
            whileInView={{ y: [40, -10, 0], opacity: [0, 1, 1] }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 2.5, ease: "easeOut", times: [0, 0.6, 1] }}
          >
            <h2 className="text-3xl font-bold text-white">Premium Dashboard Experience</h2>
            <motion.p 
              className="mx-auto mt-4 max-w-2xl text-gray-300"
              whileInView={{ y: [40, -10, 0], opacity: [0, 1, 1] }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 2.5, ease: "easeOut", times: [0, 0.6, 1], delay: 0.2 }}
            >
              See your freelance business in a whole new light
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="rounded-xl border border-gray-800 bg-white/5 overflow-hidden shadow-xl">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="rounded-xl border border-gray-700 bg-white/5 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                        <Globe className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="h-48 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-600/10"></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="rounded-xl border border-gray-700 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">Active Projects</h4>
                        <Zap className="h-4 w-4 text-green-400" />
                      </div>
                      <p className="mt-2 text-2xl font-bold text-white">12</p>
                    </div>
                    <div className="rounded-xl border border-gray-700 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">Unpaid Invoices</h4>
                        <CreditCard className="h-4 w-4 text-amber-400" />
                      </div>
                      <p className="mt-2 text-2xl font-bold text-white">$8,450</p>
                    </div>
                    <div className="rounded-xl border border-gray-700 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">Security Status</h4>
                        <Lock className="h-4 w-4 text-blue-400" />
                      </div>
                      <p className="mt-2 text-sm text-green-400">All Systems Secure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Trusted by Freelancers Worldwide</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              See what other freelancers are saying about Freelance Flow
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-800 bg-white/5 p-6 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-24 rounded-xl border border-gray-800 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 px-8 py-12 text-center shadow-xl backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold text-white">Ready to Streamline Your Workflow?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-indigo-200">
            Join thousands of freelancers who use Freelance Flow to manage their business more efficiently
          </p>
          <div className="mt-8">
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-white px-8 py-3 text-lg font-medium text-indigo-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
              >
                Start Free Trial
              </motion.button>
            </SignInButton>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-24 border-t border-gray-800 bg-[#020617] py-12"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="relative h-8 w-8">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                </div>
                <span className="ml-3 text-xl font-bold text-white">Freelance Flow</span>
              </div>
              <p className="mt-2 text-gray-400">© 2026 Freelance Flow. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 text-center">
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>Designed for freelancers, by freelancers</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}