'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const MonthlyRevenueTrend = () => {
  // Fictional revenue data for the last 6 months
  const data = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 6000 },
    { month: 'Mar', revenue: 5500 },
    { month: 'Apr', revenue: 8000 },
    { month: 'May', revenue: 7000 },
    { month: 'Jun', revenue: 9000 },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-indigo-600">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly Revenue Trend
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Last 6 months of revenue performance
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5">
          <TrendingUp className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">+22.5%</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#4f46e5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
        <div>
          <p className="text-sm text-gray-600">Average Monthly</p>
          <p className="mt-1 text-xl font-bold text-gray-900">$6,583</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Highest Month</p>
          <p className="mt-1 text-xl font-bold text-gray-900">$9,000</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Growth Rate</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">+22.5%</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRevenueTrend;