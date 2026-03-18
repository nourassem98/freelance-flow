"use client"

import React, { useState, useEffect } from "react";
import {
  FolderKanban,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  Bell,
  User,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface OptionProps {
  Icon: React.ElementType;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
}

interface TitleSectionProps {
  open: boolean;
}

interface ToggleCloseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProjectsPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Projects");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (page: string) => {
    setSelected(page);
  };

  // Sample project data
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      client: "Acme Corp",
      status: "In Progress",
      progress: 65,
      dueDate: "Mar 25, 2026",
      priority: "high",
      budget: "$5,000",
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "TechStart Inc",
      status: "Planning",
      progress: 20,
      dueDate: "Apr 15, 2026",
      priority: "medium",
      budget: "$12,000",
    },
    {
      id: 3,
      name: "Brand Identity",
      client: "Global Solutions",
      status: "Review",
      progress: 90,
      dueDate: "Mar 20, 2026",
      priority: "high",
      budget: "$3,500",
    },
    {
      id: 4,
      name: "E-commerce Platform",
      client: "StartupXYZ",
      status: "In Progress",
      progress: 45,
      dueDate: "May 1, 2026",
      priority: "medium",
      budget: "$8,000",
    },
    {
      id: 5,
      name: "Marketing Dashboard",
      client: "Innovation Labs",
      status: "Completed",
      progress: 100,
      dueDate: "Mar 10, 2026",
      priority: "low",
      budget: "$4,500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar 
          open={open}
          setOpen={setOpen}
          selected={selected}
          setSelected={handleNavigate}
        />
        
        {/* Main content */}
        <div className="flex-1">
          <Header isDark={isDark} setIsDark={setIsDark} />
          
          <main className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage and track all your freelance projects in one place.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-2">
                  <FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">7</p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">4</p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
              </div>
            </div>

            {/* Projects Table */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Projects</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Project Name</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Client</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Progress</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Due Date</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Budget</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{project.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{project.client}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-10 text-right">
                              {project.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{project.dueDate}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-gray-100">{project.budget}</td>
                        <td className="py-4 px-6">
                          <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ open, setOpen, selected, setSelected }: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string;
  setSelected: (title: string) => void;
}) => {
  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8">
        <Option
          Icon={FolderKanban}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FolderKanban}
          title="Projects"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={CheckCircle2}
          title="Tasks"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Clock}
          title="Time Tracking"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={AlertCircle}
          title="Issues"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Account
          </div>
          <Option
            Icon={User}
            title="Profile"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={Moon}
            title="Settings"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
        </div>
      )}

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

const TitleSection = ({ open }: TitleSectionProps) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className="transition-opacity duration-200">
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Freelance Flow
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Pro Plan
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
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

const Header = ({ isDark, setIsDark }: { isDark: boolean; setIsDark: (isDark: boolean) => void }) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projects Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProjectsPage;