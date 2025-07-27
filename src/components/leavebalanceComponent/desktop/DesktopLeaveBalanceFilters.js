"use client";
import {
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiUsers,
  FiDownload,
} from "react-icons/fi";

const DesktopLeaveBalanceFilters = ({
  filters,
  setFilters,
  leaveTypes,
  departments,
  onApplyFilters,
  onClearFilters,
  onExport,
  loading
}) => {
  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    // Auto-apply filters on desktop
    onApplyFilters(newFilters);
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
    onClearFilters();
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== 'all'
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FiFilter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClear}
            disabled={activeFiltersCount === 0}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className="h-4 w-4 mr-1" />
            Clear All
          </button>
          
          <button
            onClick={onExport}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            <FiDownload className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Employee
          </label>
          <input
            type="text"
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Name, code, department..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiCalendar className="inline h-4 w-4 mr-1" />
            Year
          </label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Years</option>
            {[2024, 2023, 2022, 2021, 2020].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiUsers className="inline h-4 w-4 mr-1" />
            Department
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Departments</option>
            {departments?.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Leave Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leave Type
          </label>
          <select
            value={filters.leaveType || ''}
            onChange={(e) => handleFilterChange('leaveType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balance Status
          </label>
          <select
            value={filters.balanceStatus || ''}
            onChange={(e) => handleFilterChange('balanceStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          onClick={() => handleFilterChange('balanceStatus', 'low')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.balanceStatus === 'low'
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Low Balance
        </button>
        <button
          onClick={() => handleFilterChange('balanceStatus', 'exhausted')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.balanceStatus === 'exhausted'
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Exhausted
        </button>
        <button
          onClick={() => handleFilterChange('year', new Date().getFullYear())}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.year === new Date().getFullYear()
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Current Year
        </button>
      </div>
    </div>
  );
};

export default DesktopLeaveBalanceFilters;