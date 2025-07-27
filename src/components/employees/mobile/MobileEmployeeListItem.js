// src/components/employees/mobile/MobileEmployeeListItem.js
'use client';

import { FiMoreVertical, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

export default function MobileEmployeeListItem({ 
  employee, 
  onView, 
  onEdit, 
  onDelete 
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100">
      {/* Left side - Employee info */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {employee.FirstName?.[0]}{employee.LastName?.[0]}
          </div>
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {employee.FullName || `${employee.FirstName} ${employee.LastName}`}
            </h3>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
              employee.IsActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {employee.IsActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-xs text-gray-600 truncate">
                {employee.EmployeeCode}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className={`text-xs font-medium truncate ${
                employee.DepartmentName === 'Unassigned' 
                  ? 'text-gray-600' 
                  : 'text-blue-600'
              }`}>
                {employee.DepartmentName}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 truncate mt-1">
            {employee.Email}
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="relative ml-2">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <FiMoreVertical className="h-4 w-4 text-gray-400" />
        </button>
        
        {showActions && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowActions(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <button
                onClick={() => {
                  onView(employee.EmployeeID);
                  setShowActions(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiEye className="mr-2 h-4 w-4" />
                View
              </button>
              <button
                onClick={() => {
                  onEdit(employee.EmployeeID);
                  setShowActions(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiEdit className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(employee);
                  setShowActions(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}