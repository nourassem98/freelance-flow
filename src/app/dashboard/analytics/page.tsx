'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Oct', revenue: 8200 },
  { month: 'Nov', revenue: 10500 },
  { month: 'Dec', revenue: 9800 },
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 11200 },
  { month: 'Mar', revenue: 15800 },
]

const dealStages = [
  { stage: 'New Lead',    count: 12 },
  { stage: 'Contacted',  count: 8 },
  { stage: 'Negotiation',count: 5 },
  { stage: 'Won',        count: 9 },
  { stage: 'Lost',       count: 3 },
]

const projectStatus = [
  { name: 'Active',    value: 7, color: '#3b82f6' },
  { name: 'Completed', value: 4, color: '#22c55e' },
  { name: 'On Hold',   value: 2, color: '#6b7280' },
]

const topClients = [
  { client: 'Innovation Labs',  revenue: 4500, pct: 100 },
  { client: 'Global Solutions', revenue: 3200, pct: 71 },
  { client: 'Acme Corp',        revenue: 2500, pct: 56 },
  { client: 'TechStart Inc',    revenue: 1800, pct: 40 },
  { client: 'StartupXYZ',       revenue: 950,  pct: 21 },
]

const metrics = [
  { title: 'Total Revenue',   value: '$45,231', change: '+20.1%', trend: 'up'   as const, icon: <DollarSign className="h-5 w-5" />, color: 'blue' },
  { title: 'Active Clients',  value: '1,234',   change: '+15.3%', trend: 'up'   as const, icon: <Users className="h-5 w-5" />,       color: 'green' },
  { title: 'Conversion Rate', value: '3.2%',    change: '+0.5%',  trend: 'up'   as const, icon: <ShoppingCart className="h-5 w-5" />, color: 'purple' },
  { title: 'Avg Deal Size',   value: '$4,890',  change: '-2.1%',  trend: 'down' as const, icon: <TrendingDown className="h-5 w-5" />, color: 'orange' },
]

const colorMap: Record<string, string> = {
  blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
}

export default function AnalyticsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Track your business performance with detailed insights.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m) => (
          <div
            key={m.title}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${colorMap[m.color]}`}>{m.icon}</div>
              <span
                className={`flex items-center text-sm font-medium ${
                  m.trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {m.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {m.change}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{m.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue line chart */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deal pipeline bar chart */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Deal Pipeline
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dealStages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project status pie + top clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Project Status
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={projectStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={4}
              >
                {projectStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {projectStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top Clients by Revenue
          </h2>
          <div className="space-y-3">
            {topClients.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {c.client}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ${c.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
