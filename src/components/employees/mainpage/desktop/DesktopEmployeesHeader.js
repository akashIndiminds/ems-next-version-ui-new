// src/components/employees/desktop/DesktopEmployeesHeader.js
'use client';

import { FiPlus } from 'react-icons/fi';

export default function DesktopEmployeesHeader({ 
  onAddEmployee,
  totalEmployees,
  filteredCount 
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Employee Management
        </h1>
        <p className="mt-2 text-gray-700">
          {filteredCount !== totalEmployees ? (
            <span>Showing {filteredCount} of {totalEmployees} employees</span>
          ) : (
            <span>Manage your organization's {totalEmployees} employees</span>
          )}
        </p>
      </div>
      <button
        onClick={onAddEmployee}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        <FiPlus className="mr-2" />
        Add Employee
      </button>
    </div>
  );
}