// src/components/employees/mobile/MobileEmployeeCard.js
'use client';

import { FiPhone, FiMail, FiMoreVertical, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

export default function MobileEmployeeCard({ 
  employee, 
  onView, 
  onEdit, 
  onDelete 
}) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl mx-3 mb-3 overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Header Section - More Compact */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center flex-1 min-w-0">
            {/* Avatar with gradient and better sizing */}
            <div className="relative flex-shrink-0">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {employee.FirstName?.[0]}{employee.LastName?.[0]}
              </div>
              {/* Status indicator */}
              <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                employee.IsActive ? 'bg-green-400' : 'bg-gray-400'
              }`} />
            </div>
            
            {/* Employee Info - More compact */}
            <div className="ml-3 flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate leading-tight">
                {employee.FullName || `${employee.FirstName} ${employee.LastName}`}
              </h3>
              <div className="flex items-center mt-0.5 space-x-2">
                <span className="text-xs font-medium text-gray-500">
                  {employee.EmployeeCode}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  employee.DepartmentName === 'Unassigned' 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {employee.DepartmentName}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions Menu - More subtle */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FiMoreVertical className="h-4 w-4 text-gray-400" />
            </button>
            
            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      onView(employee.EmployeeID);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiEye className="mr-2 h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      onEdit(employee.EmployeeID);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiEdit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(employee);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Info - Inline and compact */}
        <div className="space-y-1.5">
          <div className="flex items-center text-xs text-gray-600">
            <FiMail className="h-3.5 w-3.5 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{employee.Email}</span>
          </div>
          {employee.MobileNumber && (
            <div className="flex items-center text-xs text-gray-600">
              <FiPhone className="h-3.5 w-3.5 mr-2 text-gray-400 flex-shrink-0" />
              <span>{employee.MobileNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Compact with better visual hierarchy */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500">
            Joined {formatDate(employee.DateOfJoining)}
          </span>
          {employee.BloodGroup && (
            <>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                {employee.BloodGroup}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}