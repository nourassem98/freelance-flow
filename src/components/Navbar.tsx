'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { GlassButton } from '../../components/ui/glass-button';
import { AnimatedGroup } from '../../components/ui/animated-group';
import { Sparkles } from '../../components/ui/sparkles';
import { cn } from '../../lib/utils';

const menuItems = [
  { name: 'Features', href: '/features' },
  { name: 'Solution', href: '/solution' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
];

// Animation variants for hover effects
const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1.5,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
      scale: { duration: 0.5, type: "spring" as const, stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

const MotionLink = motion(Link);

const Navbar = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-20 w-full px-2 group"
      >
        <div className={cn(
          'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
          isScrolled ? 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5' : 'bg-transparent'
        )}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index} className="relative">
                    <motion.div
                      className="block rounded-xl overflow-visible group relative"
                      style={{ perspective: "600px" }}
                      whileHover="hover"
                      initial="initial"
                    >
                      {/* Per-item glow - metallic grey */}
                      <motion.div
                        className="absolute inset-0 z-0 pointer-events-none rounded-xl"
                        variants={glowVariants}
                        style={{
                          background: "radial-gradient(circle, rgba(156,163,175,0.3) 0%, rgba(107,114,128,0.15) 50%, rgba(75,85,99,0) 100%)",
                          opacity: 0,
                        }}
                      />
                      {/* Front-facing */}
                      <MotionLink
                        href={item.href}
                        className="relative z-10 bg-transparent text-muted-foreground rounded-xl px-3 py-2 block"
                        variants={itemVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "center bottom"
                        }}
                      >
                        <motion.span
                          variants={{
                            initial: { color: "rgb(113, 113, 122)" },
                            hover: { color: "rgb(255, 255, 255)" }
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      </MotionLink>
                      {/* Back-facing */}
                      <MotionLink
                        href={item.href}
                        className="absolute inset-0 z-10 bg-transparent text-muted-foreground rounded-xl px-3 py-2"
                        variants={backVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "center top",
                          transform: "rotateX(90deg)"
                        }}
                      >
                        <motion.span
                          variants={{
                            initial: { color: "rgb(113, 113, 122)" },
                            hover: { color: "rgb(255, 255, 255)" }
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      </MotionLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Link href="/sign-in">
                  <GlassButton
                    size="sm"
                    buttonClassName={cn(isScrolled && 'lg:hidden')}
                  >
                    <span>Login</span>
                  </GlassButton>
                </Link>
                <Link href="/sign-in">
                  <GlassButton
                    size="sm"
                    buttonClassName={cn(isScrolled && 'lg:hidden')}
                  >
                    <span>Sign Up</span>
                  </GlassButton>
                </Link>
                <Link href="/sign-in">
                  <GlassButton
                    size="sm"
                    buttonClassName={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                  >
                    <span>Get Started</span>
                  </GlassButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={cn('text-xl font-bold text-white', className)}>
        Freelance Flow
      </span>
    </div>
  );
};

export default Navbar;
