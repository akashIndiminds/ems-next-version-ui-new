// src/components/departments/MobileDepartmentSearch.js
import { FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';

const MobileDepartmentSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  viewMode, 
  setViewMode, 
  filteredCount 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiSearch className="mr-2 text-blue-600 h-5 w-5" />
          Search & Filter
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
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

        {/* Results and View Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredCount}</span> departments
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDepartmentSearch;