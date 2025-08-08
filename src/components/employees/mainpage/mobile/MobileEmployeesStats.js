// src/components/employees/mobile/MobileEmployeesStats.js
'use client';

export default function MobileEmployeesStats({ employees, departments }) {
  const stats = [
    {
      label: 'Total',
      value: employees.length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      label: 'Active',
      value: employees.filter(emp => emp.IsActive).length,
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Depts',
      value: departments.length,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: 'Inactive',
      value: employees.filter(emp => !emp.IsActive).length,
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      )
    }
  ];

  return (
    <div className="px-3 py-2 bg-white">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
              ${stat.bg} border border-gray-100
              flex-shrink-0 min-w-0
              transition-all duration-150 ease-out
              hover:scale-105 hover:shadow-sm
            `}
          >
            <div className={`${stat.color} flex-shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-semibold ${stat.color} tabular-nums`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium truncate">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}