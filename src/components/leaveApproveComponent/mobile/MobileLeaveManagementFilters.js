// components/leaveapprovecomponent/MobileLeaveManagementFilters.js
'use client';

import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export function MobileLeaveManagementFilters({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  dateRange,
  setDateRange,
  departments,
  showFilters,
  setShowFilters,
  resetFilters,
  hasActiveFilters
}) {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Search Bar */}
      <div className="p-4 pb-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-gray-50"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'text-blue-600 bg-blue-100' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiFilter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="px-4 pb-4 space-y-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between pt-3">
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-sm"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}