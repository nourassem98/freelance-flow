"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Bell,
  User,
  Moon,
  Sun,
  FolderKanban,
} from "lucide-react";
import DashboardSidebar from '@/components/DashboardSidebar';

const menuItems = [
  { Icon: FolderKanban, title: 'Dashboard', href: '/dashboard' },
  { Icon: BarChart3, title: 'Analytics', href: '/dashboard/analytics' },
  { Icon: TrendingUp, title: 'Reports', href: '/dashboard/analytics' },
  { Icon: Users, title: 'Audience', href: '/dashboard/analytics' },
];

const AnalyticsPage = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Analytics");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (page: string) => {
    const menuItem = menuItems.find(item => item.title === page);
    if (menuItem?.href) {
      setSelected(page);
      router.push(menuItem.href);
    } else {
      setSelected(page);
    }
  };

  // Sample analytics data
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      trend: "up" as const,
      icon: <DollarSign className="h-5 w-5" />,
      color: "blue",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+15.3%",
      trend: "up" as const,
      icon: <Users className="h-5 w-5" />,
      color: "green",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5%",
      trend: "up" as const,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "purple",
    },
    {
      title: "Bounce Rate",
      value: "42.3%",
      change: "-2.1%",
      trend: "down" as const,
      icon: <TrendingDown className="h-5 w-5" />,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "green":
        return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "purple":
        return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "orange":
        return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    }
  };

  const Header = ({ isDark, setIsDark }: { isDark: boolean; setIsDark: (isDark: boolean) => void }) => {
    return (
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
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

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <DashboardSidebar
          open={open}
          setOpen={setOpen}
          selected={selected}
          setSelected={handleNavigate}
          menuItems={menuItems}
        />
        
        {/* Main content */}
        <div className="flex-1">
          <Header isDark={isDark} setIsDark={setIsDark} />
          
          <main className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your business performance with detailed insights and metrics.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div key={index} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${getColorClasses(metric.color)}`}>
                      {metric.icon}
                    </div>
                    <span className={`flex items-center text-sm font-medium ${
                      metric.trend === "up" 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {metric.change}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">{metric.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Overview</h2>
                  <select className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                  </select>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Revenue chart will be displayed here</p>
                  </div>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Traffic Sources</h2>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    View Details
                  </button>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Traffic chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Pages / Products */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Performing Pages</h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { page: "/pricing", views: "2,345", bounceRate: "32%", conversion: "4.2%" },
                  { page: "/features", views: "1,876", bounceRate: "28%", conversion: "3.8%" },
                  { page: "/", views: "1,543", bounceRate: "45%", conversion: "2.1%" },
                  { page: "/about", views: "987", bounceRate: "38%", conversion: "1.9%" },
                  { page: "/contact", views: "654", bounceRate: "52%", conversion: "1.2%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.page}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.views} views</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bounce Rate</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.bounceRate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Conversion</p>
                        <p className="font-medium text-green-600 dark:text-green-400">{item.conversion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;