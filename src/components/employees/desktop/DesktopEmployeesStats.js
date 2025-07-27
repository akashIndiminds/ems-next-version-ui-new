// src/components/employees/desktop/DesktopEmployeesStats.js
'use client';

import { FiUsers } from 'react-icons/fi';

export default function DesktopEmployeesStats({ employees, departments }) {
  const stats = [
    {
      label: 'Total Employees',
      value: employees.length,
      color: 'blue',
      description: 'All employees in system'
    },
    {
      label: 'Active',
      value: employees.filter(emp => emp.IsActive).length,
      color: 'green',
      description: 'Currently active employees'
    },
    {
      label: 'Departments',
      value: departments.length,
      color: 'yellow',
      description: 'Total departments'
    },
    {
      label: 'Unassigned',
      value: employees.filter(emp => !emp.DepartmentID || emp.DepartmentName === 'Unassigned').length,
      color: 'red',
      description: 'Without department assignment'
    }
  ];

  const colorClasses = {
    blue: 'border-blue-500 bg-white',
    green: 'border-green-500 bg-white',
    yellow: 'border-yellow-500 bg-white',
    red: 'border-red-500 bg-white'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow border-l-4 ${colorClasses[stat.color]}`}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${iconColorClasses[stat.color]}`}>
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}