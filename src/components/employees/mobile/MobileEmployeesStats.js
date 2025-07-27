// src/components/employees/mobile/MobileEmployeesStats.js
'use client';

import { FiUsers } from 'react-icons/fi';

export default function MobileEmployeesStats({ employees, departments }) {
  const stats = [
    {
      label: 'Total',
      value: employees.length,
      color: 'blue',
      icon: FiUsers
    },
    {
      label: 'Active',
      value: employees.filter(emp => emp.IsActive).length,
      color: 'green',
      icon: FiUsers
    },
    {
      label: 'Departments',
      value: departments.length,
      color: 'purple',
      icon: FiUsers
    },
    {
      label: 'Unassigned',
      value: employees.filter(emp => !emp.DepartmentID || emp.DepartmentName === 'Unassigned').length,
      color: 'orange',
      icon: FiUsers
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <div className="px-4 py-3 bg-gray-50">
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`flex-shrink-0 w-28 p-3 rounded-xl border-2 ${colorClasses[stat.color]}`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <Icon className={`h-5 w-5 ${iconColorClasses[stat.color]}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}