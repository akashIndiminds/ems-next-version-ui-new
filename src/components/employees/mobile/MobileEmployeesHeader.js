// src/components/employees/mobile/MobileEmployeesHeader.js
'use client';

import { FiPlus, FiSearch, FiFilter, FiList, FiGrid } from 'react-icons/fi';

export default function MobileEmployeesHeader({ 
  onAddEmployee, 
  onToggleSearch, 
  onToggleFilters, 
  showSearch,
  activeFiltersCount,
  totalEmployees,
  filteredCount,
  viewMode = 'list', // 'list' or 'card'
  onViewModeChange
}) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              Employees
            </h1>
            <p className="text-sm text-gray-600">
              {filteredCount !== totalEmployees ? (
                <span>{filteredCount} of {totalEmployees} employees</span>
              ) : (
                <span>{totalEmployees} employees</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                <FiList className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('card')}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  viewMode === 'card' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                <FiGrid className="h-4 w-4" />
              </button>
            </div>
            
            {/* Search Toggle */}
            <button
              onClick={onToggleSearch}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showSearch 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiSearch className="h-5 w-5" />
            </button>
            
            {/* Filter Toggle */}
            <button
              onClick={onToggleFilters}
              className="relative p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            >
              <FiFilter className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {/* Add Employee Button */}
            <button
              onClick={onAddEmployee}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FiPlus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}