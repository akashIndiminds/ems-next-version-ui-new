// src/components/departments/MobilePagination.js
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Mobile Pagination */}
      <div className="p-4 space-y-3">
        {/* Results Info */}
        <div className="text-center text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> results
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FiChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
              {currentPage}
            </span>
            <span className="text-sm text-gray-500">of</span>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
              {totalPages}
            </span>
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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