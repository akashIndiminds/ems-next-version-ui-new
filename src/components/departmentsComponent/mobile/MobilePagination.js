// src/components/departments/mobile/MobilePagination.js
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MobilePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}) => {
  // Early return if no pagination needed
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:hidden">
      {/* Mobile Pagination - Professional & Compact */}
      <div className="px-4 py-3 space-y-3">
        {/* Results Info - Compact */}
        <div className="text-center text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{startItem}</span>-<span className="font-semibold text-slate-900">{endItem}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalItems}</span> results
        </div>
        
        {/* Navigation - Enhanced Design */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border border-slate-200"
          >
            <FiChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg border border-blue-200">
              {currentPage}
            </span>
            <span className="text-sm text-slate-500">of</span>
            <span className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg border border-slate-200">
              {totalPages}
            </span>
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border border-slate-200"
          >
            Next
            <FiChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobilePagination;