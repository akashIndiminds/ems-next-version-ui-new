"use client";
import React from 'react';
import {
  FiFilter, FiRefreshCw, FiCalendar, FiUsers, FiDownload, FiX
} from "react-icons/fi";

const DesktopLeaveBalanceFilters = ({
  filters = {
    year: '',
    department: '',
    leaveType: '',
    balanceStatus: '',
    searchTerm: ''
  },
  setFilters,
  leaveTypes = [],
  departments = [],
  onApplyFilters,
  onClearFilters,
  onExport,
  loading = false
}) => {
  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    // Auto-apply filters on desktop
    if (onApplyFilters) {
      onApplyFilters(newFilters);
    }
  };

  const handleClear = () => {
    const clearedFilters = {
      year: '',
      department: '',
      leaveType: '',
      balanceStatus: '',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== 'all'
  ).length;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <FiFilter className="h-5 w-5 text-gray-600" />
          <h3 className="text-base font-medium text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClear}
            disabled={activeFiltersCount === 0}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw className="h-4 w-4 mr-2" />
            Clear All
          </button>
          
          <button
            onClick={onExport}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            <FiDownload className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Employee
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchTerm || ''}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Name, code, department..."
                className="w-full px-3 py-2.5 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {filters.searchTerm && (
                <button
                  onClick={() => handleFilterChange('searchTerm', '')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline h-4 w-4 mr-1" />
              Year
            </label>
            <select
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUsers className="inline h-4 w-4 mr-1" />
              Department
            </label>
            <select
              value={filters.department || ''}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Departments</option>
              {departments?.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Leave Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </label>
            <select
              value={filters.leaveType || ''}
              onChange={(e) => handleFilterChange('leaveType', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Leave Types</option>
              {leaveTypes?.map(type => (
                <option key={type.LeaveTypeID} value={type.LeaveTypeID}>
                  {type.LeaveTypeName}
                </option>
              ))}
            </select>
          </div>

          {/* Balance Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balance Status
            </label>
            <select
              value={filters.balanceStatus || ''}
              onChange={(e) => handleFilterChange('balanceStatus', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="good">Good (&gt;2 days)</option>
              <option value="low">Low (≤2 days)</option>
              <option value="exhausted">Exhausted (0 days)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('balanceStatus', filters.balanceStatus === 'low' ? '' : 'low')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.balanceStatus === 'low'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Low Balance
          </button>
          
          <button
            onClick={() => handleFilterChange('balanceStatus', filters.balanceStatus === 'exhausted' ? '' : 'exhausted')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.balanceStatus === 'exhausted'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Exhausted
          </button>
          
          <button
            onClick={() => handleFilterChange('year', filters.year === currentYear ? '' : currentYear)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.year === currentYear
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Current Year
          </button>
          
          <button
            onClick={() => handleFilterChange('balanceStatus', filters.balanceStatus === 'good' ? '' : 'good')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.balanceStatus === 'good'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Good Balance
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopLeaveBalanceFilters;