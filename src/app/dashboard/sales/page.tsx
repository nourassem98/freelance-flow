"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Bell,
  User,
  Moon,
  Sun,
  FolderKanban,
} from "lucide-react";
import DashboardSidebar from '@/components/DashboardSidebar';

const menuItems = [
  { Icon: FolderKanban, title: 'Dashboard', href: '/dashboard' },
  { Icon: DollarSign, title: 'Sales', href: '/dashboard/sales' },
  { Icon: ShoppingCart, title: 'Products', href: '/dashboard/sales' },
  { Icon: Users, title: 'Customers', href: '/dashboard/sales' },
  { Icon: TrendingUp, title: 'Analytics', href: '/dashboard/analytics' },
];

const SalesPage = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Sales");

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

  const Header = ({ isDark, setIsDark }: { isDark: boolean; setIsDark: (isDark: boolean) => void }) => {
    return (
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sales Dashboard</h2>
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

  const StatCard = ({ title, value, change, trend, icon, color }: {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
    color: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    };

    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend === 'up' ? '↑' : '↓'} {change.split(' ')[0]}
          </span>
        </div>
        <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{change}</p>
      </div>
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
        
        <div className="flex-1">
          <Header isDark={isDark} setIsDark={setIsDark} />
          
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sales</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track and manage your sales, revenue, and customer relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value="$45,231"
                change="+20.1% from last month"
                trend="up"
                icon={<DollarSign className="h-5 w-5" />}
                color="blue"
              />
              <StatCard
                title="Orders"
                value="1,234"
                change="+12% from last week"
                trend="up"
                icon={<ShoppingCart className="h-5 w-5" />}
                color="green"
              />
              <StatCard
                title="Customers"
                value="567"
                change="+8% from last month"
                trend="up"
                icon={<Users className="h-5 w-5" />}
                color="purple"
              />
              <StatCard
                title="Conversion Rate"
                value="3.2%"
                change="-0.5% from last week"
                trend="down"
                icon={<TrendingUp className="h-5 w-5" />}
                color="orange"
              />
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Sales</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: '#ORD-001', customer: 'Acme Corp', amount: '$2,500', status: 'Completed', date: 'Mar 15, 2026' },
                      { id: '#ORD-002', customer: 'TechStart Inc', amount: '$1,800', status: 'Processing', date: 'Mar 14, 2026' },
                      { id: '#ORD-003', customer: 'Global Solutions', amount: '$3,200', status: 'Completed', date: 'Mar 13, 2026' },
                      { id: '#ORD-004', customer: 'StartupXYZ', amount: '$950', status: 'Pending', date: 'Mar 12, 2026' },
                      { id: '#ORD-005', customer: 'Innovation Labs', amount: '$4,500', status: 'Completed', date: 'Mar 11, 2026' },
                    ].map((order, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-4 px-4 font-mono text-sm text-gray-900 dark:text-gray-100">{order.id}</td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{order.customer}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{order.amount}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sales Overview</h2>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Sales chart will be displayed here</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;