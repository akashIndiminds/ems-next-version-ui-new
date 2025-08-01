// src/components/departments/mobile/MobileDepartmentSearch.js
import { FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';

const MobileDepartmentSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  viewMode, 
  setViewMode, 
  filteredCount 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:hidden">
      {/* Header - Professional & Compact */}
      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50">
        <h2 className="text-base font-semibold text-slate-900 flex items-center">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
            <FiSearch className="h-4 w-4 text-indigo-600" />
          </div>
          Search & Filter
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar - Enhanced Design */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg bg-white placeholder-slate-500 focus:outline-none  text-sm text-slate-900 transition-colors"
            placeholder="Search departments..."
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
            </button>
          )}
        </div>

        {/* Results and View Toggle - Professional Layout */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{filteredCount}</span> departments
          </div>
          
          {/* View Mode Toggle - Enhanced Design with List as Active */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDepartmentSearch;