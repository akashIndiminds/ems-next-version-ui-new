// src/components/departments/desktop/DesktopDepartmentSearch.js
import { FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';

const DesktopDepartmentSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  viewMode, 
  setViewMode, 
  filteredCount 
}) => {
  return (
    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black transition-all duration-200"
            placeholder="Search departments..."
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

        {/* View Toggle and Results Count */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredCount}</span> departments found
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Card View"
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Table View"
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDepartmentSearch;