'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs';

const Sidebar = () => {
  const { user } = useUser();
  const firstName = user?.firstName || '';

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <Users size={20} />, label: 'Clients' },
    { icon: <FolderKanban size={20} />, label: 'Projects' },
    { icon: <FileText size={20} />, label: 'Invoices' },
  ];

  const bottomItems = [
    { icon: <Settings size={20} />, label: 'Settings' },
    { icon: <LogOut size={20} />, label: 'Logout' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-gray-300">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600"></div>
          <span className="text-xl font-bold text-white">Freelance Flow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              item.active
                ? 'bg-gray-800 text-white'
                : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-800 p-4">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-800 hover:text-white"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Authentication section */}
      <div className="border-t border-gray-800 p-4">
        <Show when="signed-out">
          <div className="flex justify-center">
            <SignInButton mode="modal">
              <button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                Log In
              </button>
            </SignInButton>
          </div>
        </Show>
        
        <Show when="signed-in">
          <div className="flex items-center gap-3">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-10 w-10",
                  userButtonTrigger: "focus:shadow-none",
                }
              }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
              </p>
              <p className="text-xs text-gray-400">Manage your account</p>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default Sidebar;
