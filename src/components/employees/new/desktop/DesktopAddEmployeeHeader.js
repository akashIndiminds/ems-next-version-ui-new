// src/components/employees/new/desktop/DesktopAddEmployeeHeader.js
'use client';

import { FiArrowLeft, FiUser } from 'react-icons/fi';

export default function DesktopAddEmployeeHeader({ onBack }) {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <button
        onClick={onBack}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <FiArrowLeft className="h-6 w-6 text-gray-600" />
      </button>
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Add New Employee
        </h1>
        <p className="mt-2 text-gray-600">
          Fill in the details to add a new employee to your organization
        </p>
      </div>
    </div>
  );
}