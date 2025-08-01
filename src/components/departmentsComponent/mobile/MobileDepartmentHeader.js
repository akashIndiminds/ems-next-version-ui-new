// components/departmentsComponent/mobile/MobileDepartmentHeader.js
'use client';

import { FiPlus } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';

export default function MobileDepartmentHeader({ userRole, onAddClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      {/* Main Title Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl">
            <MdBusiness className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Departments
            </h1>
          </div>
        </div>
        
        {/* Add Button - Only show for admin */}
        {userRole === 'admin' && (
          <button
            onClick={onAddClick}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label="Add Department"
          >
            <FiPlus className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Subtitle */}
      <p className="text-xs text-gray-600 leading-relaxed">
        Manage your organization's departments
      </p>
    </div>
  );
}