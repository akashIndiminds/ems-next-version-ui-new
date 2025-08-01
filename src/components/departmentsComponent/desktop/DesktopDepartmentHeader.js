// components/departmentsComponent/desktop/DesktopDepartmentHeader.js
'use client';

import { FiPlus } from 'react-icons/fi';

export default function DesktopDepartmentHeader({ userRole, onAddClick }) {
  return (
    <div className="flex flex-row justify-between items-start">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Department Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your organization's departments
        </p>
      </div>
      
      {userRole === 'admin' && (
        <button
          onClick={onAddClick}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Department
        </button>
      )}
    </div>
  );
}