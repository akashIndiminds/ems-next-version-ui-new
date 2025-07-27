// src/components/employees/edit/mobile/MobileEditEmployeeHeader.js
'use client';

import { FiArrowLeft, FiX } from 'react-icons/fi';

export default function MobileEditEmployeeHeader({ 
  onBack, 
  currentStep, 
  totalSteps,
  employeeName 
}) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Edit Employee</h1>
            <p className="text-xs text-gray-500">{employeeName}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}