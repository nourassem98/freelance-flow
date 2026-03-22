'use client';

import React from 'react';
import { ChevronsRight, LucideIcon } from 'lucide-react';

interface MenuItem {
  Icon: LucideIcon;
  title: string;
  href?: string;
  notifs?: number;
  group?: string;
}

interface OptionProps {
  Icon: LucideIcon;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
}

interface TitleSectionProps {
  open: boolean;
  userName: string;
  userEmail: string;
}

interface ToggleCloseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string;
  setSelected: (title: string) => void;
  menuItems: MenuItem[];
  userName: string;
  userEmail: string;
}

const GROUP_LABELS: Record<string, string> = {
  crm: 'CRM',
  work: 'Work',
  tools: 'Tools',
  automation: 'More',
};

const DashboardSidebar = ({ open, setOpen, selected, setSelected, menuItems, userName, userEmail }: DashboardSidebarProps) => {
  const seenGroups = new Set<string>();

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
    >
      <TitleSection open={open} userName={userName} userEmail={userEmail} />

      <div className="space-y-0 mb-8">
        {menuItems.map((item, index) => {
          const group = item.group ?? '';
          const showLabel = open && group && group !== 'main' && !seenGroups.has(group);
          if (group) seenGroups.add(group);

          return (
            <React.Fragment key={index}>
              {showLabel && (
                <div className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {GROUP_LABELS[group] ?? group}
                </div>
              )}
              <Option
                Icon={item.Icon}
                title={item.title}
                selected={selected}
                setSelected={setSelected}
                open={open}
                notifs={item.notifs}
              />
            </React.Fragment>
          );
        })}
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }: OptionProps) => {
  const isSelected = selected === title;

  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>

      {open && (
        <span className="text-sm font-medium transition-opacity duration-200">
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open, userName, userEmail }: TitleSectionProps) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex items-center gap-3 p-2">
        <Logo />
        {open && (
          <div className="transition-opacity duration-200 min-w-0">
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {userName}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
              {userEmail}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
      <svg
        width="20"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
      </svg>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: ToggleCloseProps) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200">
            Hide
          </span>
        )}
      </div>
    </button>
  );
};

export default DashboardSidebar;
