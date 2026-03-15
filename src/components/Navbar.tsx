'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton } from '@clerk/nextjs';
import { ChevronDown, Users, FolderKanban, CreditCard, Info, Shield, FileText } from 'lucide-react';

const Navbar = () => {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const featuresTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const companyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const features = [
    { name: 'Client Management', icon: <Users className="h-4 w-4" />, href: '#features' },
    { name: 'Project Tracking', icon: <FolderKanban className="h-4 w-4" />, href: '#features' },
    { name: 'Invoice System', icon: <CreditCard className="h-4 w-4" />, href: '#features' },
  ];

  const company = [
    { name: 'About Us', icon: <Info className="h-4 w-4" />, href: '/about' },
    { name: 'Privacy Policy', icon: <Shield className="h-4 w-4" />, href: '/privacy' },
    { name: 'Terms of Service', icon: <FileText className="h-4 w-4" />, href: '/terms' },
  ];

  const handleFeaturesMouseEnter = () => {
    if (featuresTimeoutRef.current) {
      clearTimeout(featuresTimeoutRef.current);
    }
    featuresTimeoutRef.current = setTimeout(() => {
      setIsFeaturesOpen(true);
      setIsCompanyOpen(false);
    }, 200); // 200ms delay before opening
  };

  const handleFeaturesMouseLeave = () => {
    if (featuresTimeoutRef.current) {
      clearTimeout(featuresTimeoutRef.current);
    }
    featuresTimeoutRef.current = setTimeout(() => {
      setIsFeaturesOpen(false);
    }, 100); // 100ms delay before closing
  };

  const handleCompanyMouseEnter = () => {
    if (companyTimeoutRef.current) {
      clearTimeout(companyTimeoutRef.current);
    }
    companyTimeoutRef.current = setTimeout(() => {
      setIsCompanyOpen(true);
      setIsFeaturesOpen(false);
    }, 200); // 200ms delay before opening
  };

  const handleCompanyMouseLeave = () => {
    if (companyTimeoutRef.current) {
      clearTimeout(companyTimeoutRef.current);
    }
    companyTimeoutRef.current = setTimeout(() => {
      setIsCompanyOpen(false);
    }, 100); // 100ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (featuresTimeoutRef.current) {
        clearTimeout(featuresTimeoutRef.current);
      }
      if (companyTimeoutRef.current) {
        clearTimeout(companyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-12 h-12 relative mr-3">
                <Image
                  src="/logo.png"
                  alt="Freelance Flow Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">Freelance Flow</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Features Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleFeaturesMouseEnter}
              onMouseLeave={handleFeaturesMouseLeave}
            >
              <button
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Features
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-56 bg-slate-950 border border-white/10 rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="py-2">
                      {features.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300 group"
                          >
                            <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">{item.icon}</div>
                            <span className="text-sm bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-[length:200%_100%] bg-left group-hover:bg-right transition-all duration-500 bg-clip-text text-transparent group-hover:from-white group-hover:via-indigo-200 group-hover:to-purple-300">
                              {item.name}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleCompanyMouseEnter}
              onMouseLeave={handleCompanyMouseLeave}
            >
              <button
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Company
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isCompanyOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCompanyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-56 bg-slate-950 border border-white/10 rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="py-2">
                      {company.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300 group"
                          >
                            <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">{item.icon}</div>
                            <span className="text-sm bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-[length:200%_100%] bg-left group-hover:bg-right transition-all duration-500 bg-clip-text text-transparent group-hover:from-white group-hover:via-indigo-200 group-hover:to-purple-300">
                              {item.name}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pricing Direct Link */}
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex items-center">
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
  );
};

export default Navbar;