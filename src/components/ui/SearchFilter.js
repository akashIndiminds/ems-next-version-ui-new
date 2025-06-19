// src/components/ui/SearchFilter.js
'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiRefreshCw } from 'react-icons/fi';

export default function SearchFilter({
  data = [],
  searchFields = [],
  filters = [],
  onFilteredData,
  placeholder = 'Search...',
  showFilterCount = true,
  className = '',
  autoFilter = true,
  resetTrigger = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Auto-generate filter options from data
  const enhancedFilters = useMemo(() => {
    return filters.map(filter => {
      if (filter.type === 'select' && filter.autoOptions && data.length > 0) {
        const uniqueValues = [...new Set(
          data.map(item => {
            const value = getNestedValue(item, filter.dataKey || filter.key);
            return value;
          }).filter(Boolean)
        )].sort();

        const options = uniqueValues.map(value => ({
          value: value.toString(),
          label: filter.optionFormatter ? filter.optionFormatter(value) : value
        }));

        return { ...filter, options };
      }
      return filter;
    });
  }, [filters, data]);

  // Get nested object values (e.g., 'user.name' from user object)
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Filter data based on search term and active filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue && filterValue !== '' && filterValue !== 'all') {
        const filter = enhancedFilters.find(f => f.key === filterKey);
        if (filter) {
          result = result.filter(item => {
            const itemValue = getNestedValue(item, filter.dataKey || filter.key);
            
            if (filter.type === 'date') {
              if (filter.dateComparison === 'after') {
                return new Date(itemValue) >= new Date(filterValue);
              } else if (filter.dateComparison === 'before') {
                return new Date(itemValue) <= new Date(filterValue);
              } else {
                return new Date(itemValue).toDateString() === new Date(filterValue).toDateString();
              }
            } else if (filter.type === 'range') {
              const [min, max] = filterValue.split('-').map(Number);
              const value = Number(itemValue);
              return value >= min && value <= max;
            } else if (filter.customFilter) {
              return filter.customFilter(item, filterValue);
            } else {
              return itemValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
            }
          });
        }
      }
    });

    return result;
  }, [data, searchTerm, activeFilters, searchFields, enhancedFilters]);

  // Auto-trigger callback when filtered data changes
  useMemo(() => {
    if (autoFilter && onFilteredData) {
      onFilteredData(filteredData);
    }
  }, [filteredData, autoFilter, onFilteredData]);

  // Reset filters when trigger changes
  useMemo(() => {
    if (resetTrigger !== null) {
      setSearchTerm('');
      setActiveFilters({});
    }
  }, [resetTrigger]);

  const activeFilterCount = Object.values(activeFilters).filter(value => 
    value && value !== '' && value !== 'all'
  ).length;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    if (key === null) {
      // Clear all filters
      setActiveFilters(value || {});
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const clearFilter = (filterKey) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const resetAll = () => {
    clearAllFilters();
  };

  return (
    <div className={`bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                placeholder={placeholder}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Filter Toggle */}
            {enhancedFilters.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 border rounded-xl font-medium text-sm transition-all duration-200 ${
                  showFilters || activeFilterCount > 0
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiFilter className="mr-2 h-4 w-4" />
                Filters
                {showFilterCount && activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
                <FiChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                  showFilters ? 'rotate-180' : ''
                }`} />
              </button>
            )}

            {/* Reset Button */}
            {(searchTerm || activeFilterCount > 0) && (
              <button
                onClick={resetAll}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm transition-all duration-200"
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{data.length}</span> results
          </span>
          {(searchTerm || activeFilterCount > 0) && (
            <span className="text-blue-600">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
            </span>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && enhancedFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {enhancedFilters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {filter.label}
                  </label>
                  {filter.type === 'select' ? (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">{filter.placeholder || `All ${filter.label}`}</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === 'date' ? (
                    <input
                      type="date"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : filter.type === 'range' ? (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">{filter.placeholder || `All ${filter.label}`}</option>
                      {filter.rangeOptions?.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={filter.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
              {enhancedFilters.map((filter) => {
                const value = activeFilters[filter.key];
                if (!value || value === '' || value === 'all') return null;

                let displayValue = value;
                if (filter.type === 'select') {
                  const option = filter.options?.find(opt => opt.value === value);
                  displayValue = option?.label || value;
                } else if (filter.type === 'range') {
                  const range = filter.rangeOptions?.find(opt => opt.value === value);
                  displayValue = range?.label || value;
                } else if (filter.type === 'date') {
                  displayValue = new Date(value).toLocaleDateString();
                }

                return (
                  <span
                    key={filter.key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {filter.label}: {displayValue}
                    <button
                      onClick={() => clearFilter(filter.key)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors duration-200"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for using SearchFilter with state management
export function useSearchFilter(initialData = [], config = {}) {
  const [filteredData, setFilteredData] = useState(initialData);
  const [resetTrigger, setResetTrigger] = useState(0);

  const reset = () => {
    setResetTrigger(prev => prev + 1);
  };

  const SearchFilterComponent = (props) => (
    <SearchFilter
      {...config}
      {...props}
      data={initialData}
      onFilteredData={setFilteredData}
      resetTrigger={resetTrigger}
    />
  );

  return {
    filteredData,
    setFilteredData,
    reset,
    SearchFilterComponent
  };
}

// Preset filter configurations for common use cases
export const employeeFilters = [
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    dataKey: 'DepartmentName',
    autoOptions: true,
    placeholder: 'All Departments'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    dataKey: 'IsActive',
    placeholder: 'All Status',
    options: [
      { value: '1', label: 'Active' },
      { value: '0', label: 'Inactive' }
    ]
  },
  {
    key: 'bloodGroup',
    label: 'Blood Group',
    type: 'select',
    dataKey: 'BloodGroup',
    autoOptions: true,
    placeholder: 'All Blood Groups'
  },
  {
    key: 'joiningDate',
    label: 'Joining Date From',
    type: 'date',
    dataKey: 'DateOfJoining',
    dateComparison: 'after',
    placeholder: 'Select date'
  }
];

export const attendanceFilters = [
  {
    key: 'date',
    label: 'Date',
    type: 'date',
    dataKey: 'AttendanceDate',
    placeholder: 'Select date'
  },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    dataKey: 'DepartmentName',
    autoOptions: true,
    placeholder: 'All Departments'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    dataKey: 'Status',
    placeholder: 'All Status',
    options: [
      { value: 'present', label: 'Present' },
      { value: 'absent', label: 'Absent' },
      { value: 'late', label: 'Late' }
    ]
  }
];

export const leaveFilters = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    dataKey: 'Status',
    placeholder: 'All Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' }
    ]
  },
  {
    key: 'leaveType',
    label: 'Leave Type',
    type: 'select',
    dataKey: 'LeaveType',
    autoOptions: true,
    placeholder: 'All Types'
  },
  {
    key: 'fromDate',
    label: 'From Date',
    type: 'date',
    dataKey: 'StartDate',
    dateComparison: 'after',
    placeholder: 'Select start date'
  },
  {
    key: 'toDate',
    label: 'To Date',
    type: 'date',
    dataKey: 'EndDate',
    dateComparison: 'before',
    placeholder: 'Select end date'
  }
];

// Advanced filters for complex scenarios
export const advancedFilters = {
  salaryRange: {
    key: 'salary',
    label: 'Salary Range',
    type: 'range',
    dataKey: 'Salary',
    rangeOptions: [
      { value: '0-25000', label: '₹0 - ₹25,000' },
      { value: '25000-50000', label: '₹25,000 - ₹50,000' },
      { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
      { value: '100000-999999', label: '₹1,00,000+' }
    ]
  },
  experience: {
    key: 'experience',
    label: 'Experience',
    type: 'range',
    dataKey: 'Experience',
    rangeOptions: [
      { value: '0-1', label: '0-1 years' },
      { value: '1-3', label: '1-3 years' },
      { value: '3-5', label: '3-5 years' },
      { value: '5-999', label: '5+ years' }
    ]
  },
  customSearch: {
    key: 'skills',
    label: 'Skills',
    type: 'text',
    dataKey: 'Skills',
    placeholder: 'Search by skills...',
    customFilter: (item, value) => {
      return item.Skills?.some(skill => 
        skill.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
};