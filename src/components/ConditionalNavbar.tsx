'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on dashboard pages or sign-in page
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/sign-in')) {
    return null;
  }
  
  // Show Navbar on all other pages
  return <Navbar />;
}
