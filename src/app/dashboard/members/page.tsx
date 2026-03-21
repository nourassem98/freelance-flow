'use client'

import { useState } from 'react'
import {
  Users,
  Plus,
  Mail,
  Phone,
  MoreVertical,
  CheckCircle,
  XCircle,
} from 'lucide-react'

const members = [
  { id: 1, name: 'John Doe',     email: 'john@example.com',   role: 'Client',  status: 'Active',   projects: 3, avatar: 'JD' },
  { id: 2, name: 'Jane Smith',   email: 'jane@techstart.com', role: 'Client',  status: 'Active',   projects: 2, avatar: 'JS' },
  { id: 3, name: 'Bob Johnson',  email: 'bob@global.com',     role: 'Client',  status: 'Inactive', projects: 1, avatar: 'BJ' },
  { id: 4, name: 'Alice Brown',  email: 'alice@startup.io',   role: 'Client',  status: 'Active',   projects: 4, avatar: 'AB' },
  { id: 5, name: 'Charlie Davis',email: 'charlie@innov.com',  role: 'Client',  status: 'Active',   projects: 2, avatar: 'CD' },
]

const roleColor: Record<string, string> = {
  Client:      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Admin:       'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'Team Member':'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
}

export default function MembersPage() {
  const [search, setSearch] = useState('')

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  )

  const active   = members.filter((m) => m.status === 'Active').length
  const inactive = members.filter((m) => m.status === 'Inactive').length

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Members</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your team members and clients.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Members', value: members.length, icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,     bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Active',        value: active,         icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />, bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Inactive',      value: inactive,       icon: <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />,    bg: 'bg-gray-50 dark:bg-gray-800' },
        ].map((s) => (
          <div
            key={s.label}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            All Members
          </h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Member', 'Role', 'Status', 'Projects', 'Contact', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {m.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{m.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor[m.role] ?? ''}`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        m.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {m.status === 'Active' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                    {m.projects} project{m.projects !== 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
