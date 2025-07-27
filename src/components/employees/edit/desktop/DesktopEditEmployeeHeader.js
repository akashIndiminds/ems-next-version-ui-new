// src/components/employees/edit/desktop/DesktopEditEmployeeHeader.js
'use client';

import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';

export default function DesktopEditEmployeeHeader({ onBack, employeeName }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
            <p className="text-gray-600">Update employee information for {employeeName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <FiEdit2 className="h-5 w-5" />
          <span className="text-sm">All fields marked with * are required</span>
        </div>
      </div>
    </div>
  );
}