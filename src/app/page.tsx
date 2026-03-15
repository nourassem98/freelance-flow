'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SignInButton, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowRight, Users, Layers, CreditCard, Shield, Sparkles, Globe, Zap, Lock } from 'lucide-react';
import { ContainerScroll } from '../../components/ui/container-scroll-animation';
import { SplineScene } from '../../components/ui/splite';
import { Spotlight } from '../../components/ui/spotlight';
import { Card } from '../../components/ui/card';
import { AnimatedBeamDemo } from './animated-beam-demo/page';
import { FeaturesSectionWithHoverEffects } from '../../components/blocks/feature-section-with-hover-effects';
import Testimonials from '../../components/ui/testimonials-columns-1';
import AnimatedGenerateButton from '../../components/ui/animated-generate-button-shadcn-tailwind';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { openSignIn } = useClerk();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSignIn = () => {
    openSignIn();
  };

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
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Full Width */}
      <main className="w-full">
        {/* Full-width 3D Robot Section */}
        <motion.div
          className="relative w-full h-[600px] bg-black overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          
          <div className="flex h-full">
            {/* Left content - CRM and AI Text */}
            <div className="flex-1 p-8 md:p-16 relative z-10 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
                The CRM for Freelancers
              </h1>
                <p className="mt-4 text-gray-300 max-w-lg text-lg">
                Manage clients, track projects, and handle invoices—all in one simple, beautiful interface.
              </p>
                <p className="mt-4 text-gray-400 max-w-lg">
                Powered by AI assistance to help you streamline your freelance workflow and boost productivity.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <AnimatedGenerateButton
                  labelIdle="Get Started"
                  labelActive="Starting..."
                  highlightHueDeg={210}
                  className="rounded-lg"
                  onClick={handleSignIn}
                  delay={1000}
                />
                <Link href="/pricing">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-lg border border-gray-600 bg-gray-900/50 px-8 py-3 text-lg font-medium text-gray-300 transition-all hover:bg-gray-800 hover:border-gray-500"
                  >
                    View Pricing
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Right content - 3D Robot */}
            <div className="flex-1 relative">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Features Section - Hover Effects */}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FeaturesSectionWithHoverEffects />
          </motion.div>
        </div>

        {/* Premium Dashboard Experience with Scroll Animation */}
        <ContainerScroll
          titleComponent={
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Premium Dashboard Experience</h2>
              <p className="mx-auto max-w-2xl text-gray-300 text-lg">
                See your freelance business in a whole new light with our intuitive dashboard
              </p>
            </div>
          }
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 overflow-hidden">
            {/* Dashboard Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              {/* Revenue Chart */}
              <div className="col-span-2 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <div className="h-32 md:h-40 rounded-lg bg-gradient-to-r from-gray-500/20 to-gray-700/20 flex items-end">
                  {/* Simulated chart bars */}
                  <div className="flex items-end space-x-2 w-full h-full p-4">
                    {[40, 65, 45, 80, 55, 70, 85].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-gray-500 to-gray-700 rounded-t-sm"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">Active Projects</h4>
                    <Zap className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-white">12</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">Unpaid Invoices</h4>
                    <CreditCard className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-white">$8,450</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">Security Status</h4>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-2 text-sm text-gray-400">All Systems Secure</p>
                </div>
              </div>
            </div>
          </div>
        </ContainerScroll>

        {/* Animated Beam Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Integration</h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              See how our AI connects all your freelance tools and services seamlessly
            </p>
          </div>
          <AnimatedBeamDemo />
        </motion.div>

        {/* Testimonials */}
        <Testimonials />

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-24 rounded-xl border border-gray-700 bg-gradient-to-r from-gray-500/10 to-gray-700/10 px-8 py-12 text-center shadow-xl backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold text-white">Ready to Streamline Your Workflow?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Join thousands of freelancers who use Freelance Flow to manage their business more efficiently
          </p>
          <div className="mt-8">
            <AnimatedGenerateButton
              labelIdle="Start Free Trial"
              labelActive="Starting..."
              highlightHueDeg={120}
              className="rounded-lg"
              onClick={handleSignIn}
              delay={1000}
            />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-24 border-t border-gray-800 bg-black py-12"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
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