// src/components/employees/mobile/MobileEmployeesStats.js
'use client';

export default function MobileEmployeesStats({ employees, departments }) {
  const stats = [
    {
      label: 'Total',
      value: employees.length,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: '👥'
    },
    {
      label: 'Active',
      value: employees.filter(emp => emp.IsActive).length,
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: '✅'
    },
    {
      label: 'Departments',
      value: departments.length,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      icon: '🏢'
    },
    {
      label: 'Inactive',
      value: employees.filter(emp => !emp.IsActive).length,
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      icon: '⏸️'
    }
  ];

  return (
    <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-1">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-24 p-3 rounded-xl ${stat.bg} border border-opacity-20 hover:scale-105 transition-transform duration-200`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className={`text-lg font-bold ${stat.text} leading-tight`}>{stat.value}</div>
              <div className="text-xs font-medium text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}