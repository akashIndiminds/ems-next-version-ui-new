// src/components/employees/desktop/DesktopEmployeesFilters.js
'use client';

export default function DesktopEmployeesFilters({ 
  searchTerm,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange 
}) {
  const handleFilterSelect = (filterKey, value) => {
    onFilterChange(filterKey, value);
  };

  const clearAllFilters = () => {
    onFilterChange(null, {});
    onSearchChange('');
  };

  const activeFiltersCount = Object.values(activeFilters).filter(v => v).length;

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees by name, email, employee code, or department..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filters.map((filter) => (
          <div key={filter.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filter.label}
              {activeFilters[filter.key] && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Active
                </span>
              )}
            </label>
            
            {filter.type === 'select' && (
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterSelect(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All {filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {filter.type === 'date' && (
              <input
                type="date"
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterSelect(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}