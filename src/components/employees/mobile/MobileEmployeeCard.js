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
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mx-4 mb-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center flex-1">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
              {employee.FirstName?.[0]}{employee.LastName?.[0]}
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {employee.FullName || `${employee.FirstName} ${employee.LastName}`}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-600 truncate">
                {employee.EmployeeCode}
              </span>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                employee.IsActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.IsActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <FiMoreVertical className="h-5 w-5 text-gray-400" />
          </button>
          
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button
                  onClick={() => {
                    onView(employee.EmployeeID);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiEye className="mr-3 h-4 w-4" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    onEdit(employee.EmployeeID);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiEdit className="mr-3 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(employee);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 className="mr-3 h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Department */}
      <div className="mb-3">
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
          employee.DepartmentName === 'Unassigned' 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {employee.DepartmentName}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <FiMail className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{employee.Email}</span>
        </div>
        {employee.MobileNumber && (
          <div className="flex items-center text-sm text-gray-600">
            <FiPhone className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{employee.MobileNumber}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>Joined: {formatDate(employee.DateOfJoining)}</span>
        {employee.BloodGroup && (
          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full">
            {employee.BloodGroup}
          </span>
        )}
      </div>
    </div>
  );
}