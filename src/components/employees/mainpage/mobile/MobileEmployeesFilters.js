// src/components/employees/mobile/MobileEmployeesFilters.js
'use client';

import { useState } from 'react';
import { FiX, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

export default function MobileEmployeesFilters({ 
  isOpen, 
  onClose, 
  filters = [], 
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn">
      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-slideUp">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Filters & Search</h3>
            {activeFiltersCount > 0 && (
              <p className="text-sm text-blue-600 font-medium">{activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors duration-200"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters List */}
        {filters.length > 0 && (
          <div className="overflow-y-auto max-h-96">
            {filters.map((filter) => (
              <div key={filter.key} className="border-b border-gray-100">
                <button
                  onClick={() => setExpandedFilter(
                    expandedFilter === filter.key ? null : filter.key
                  )}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{filter.label}</span>
                    {activeFilters[filter.key] && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
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
                  <div className="px-4 pb-4 space-y-2 animate-slideDown">
                    {filter.type === 'select' && filter.options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect(filter.key, 
                          activeFilters[filter.key] === option.value ? '' : option.value
                        )}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          activeFilters[filter.key] === option.value
                            ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200'
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
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Apply Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}