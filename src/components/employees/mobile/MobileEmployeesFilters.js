// src/components/employees/mobile/MobileEmployeesFilters.js
'use client';

import { useState } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function MobileEmployeesFilters({ 
  isOpen, 
  onClose, 
  filters, 
  activeFilters, 
  onFilterChange,
  searchTerm,
  onSearchChange 
}) {
  const [expandedFilter, setExpandedFilter] = useState(null);

  if (!isOpen) return null;

  const handleFilterSelect = (filterKey, value) => {
    onFilterChange(filterKey, value);
  };

  const clearAllFilters = () => {
    onFilterChange(null, {});
    onSearchChange('');
  };

  const activeFiltersCount = Object.values(activeFilters).filter(v => v).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <p className="text-sm text-blue-600">{activeFiltersCount} active</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 font-medium"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 text-gray-600"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="overflow-y-auto max-h-96">
          {filters.map((filter) => (
            <div key={filter.key} className="border-b border-gray-100">
              <button
                onClick={() => setExpandedFilter(
                  expandedFilter === filter.key ? null : filter.key
                )}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div>
                  <span className="font-medium text-gray-900">{filter.label}</span>
                  {activeFilters[filter.key] && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Active
                    </span>
                  )}
                </div>
                {expandedFilter === filter.key ? (
                  <FiChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedFilter === filter.key && (
                <div className="px-4 pb-4 space-y-2">
                  {filter.type === 'select' && filter.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterSelect(filter.key, 
                        activeFilters[filter.key] === option.value ? '' : option.value
                      )}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        activeFilters[filter.key] === option.value
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  
                  {filter.type === 'date' && (
                    <input
                      type="date"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterSelect(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}