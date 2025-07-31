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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
      {/* Main Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Employees
            </h1>
            <p className="text-sm text-gray-500">
              {filteredCount !== totalEmployees ? (
                <span>{filteredCount} of {totalEmployees} employees</span>
              ) : (
                <span>{totalEmployees} total employees</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle - More modern */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiList className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('card')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'card' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiGrid className="h-4 w-4" />
              </button>
            </div>
            
            {/* Action buttons with better styling */}
            <button
              onClick={onToggleSearch}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                showSearch 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiSearch className="h-4 w-4" />
            </button>
            
            <button
              onClick={onToggleFilters}
              className="relative p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            >
              <FiFilter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <button
              onClick={onAddEmployee}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Bar - Slide down animation */}
      {showSearch && (
        <div className="px-4 py-3 bg-white border-t border-gray-100 animate-slideDown">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}