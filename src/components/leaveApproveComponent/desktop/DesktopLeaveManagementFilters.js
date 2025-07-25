
// components/desktop/DesktopLeaveManagementFilters.js
'use client';

import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

export function DesktopLeaveManagementFilters({
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiFilter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        )}

        {/* Filter Actions */}
        {hasActiveFilters && (
          <div className="flex justify-end pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
