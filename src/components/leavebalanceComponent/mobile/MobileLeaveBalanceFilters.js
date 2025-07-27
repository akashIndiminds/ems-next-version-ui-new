"use client";
import { useState } from "react";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiCalendar,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";

const MobileLeaveBalanceFilters = ({ 
  filters, 
  setFilters, 
  leaveTypes, 
  departments,
  onApplyFilters,
  onClearFilters 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    onClearFilters();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== 'all'
  ).length;

  return (
    <>
      {/* Filter Button */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center space-x-2">
            <FiFilter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <FiChevronDown 
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-t-2xl mt-20 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="overflow-y-auto max-h-[50vh] p-4 space-y-4">
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline h-4 w-4 mr-1" />
                  Year
                </label>
                <select
                  value={filters.year || ''}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All Years</option>
                  {[2024, 2023, 2022].map(year => (
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm"
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm"
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="good">Good</option>
                  <option value="low">Low</option>
                  <option value="exhausted">Exhausted</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <button
                onClick={handleApply}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClear}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <FiRefreshCw className="h-4 w-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileLeaveBalanceFilters;