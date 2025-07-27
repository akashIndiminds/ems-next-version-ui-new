// src/components/employees/new/mobile/MobileAddEmployeeHeader.js
'use client';

import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

export default function MobileAddEmployeeHeader({ 
  onBack,
  onReset,
  currentStep = 1,
  totalSteps = 3
}) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Add Employee
              </h1>
              <p className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                index + 1 <= currentStep
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}