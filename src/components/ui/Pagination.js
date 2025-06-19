// src/components/ui/Pagination.js
'use client';

import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  itemsPerPage = 10,
  totalItems = 0,
  showInfo = true,
  size = 'default' // 'small', 'default', 'large'
}) {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base'
  };

  const buttonSize = sizeClasses[size] || sizeClasses.default;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Calculate display range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Info Text */}
      {showInfo && (
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing{' '}
          <span className="font-semibold text-gray-900">{startItem}</span>
          {' '}to{' '}
          <span className="font-semibold text-gray-900">{endItem}</span>
          {' '}of{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span>
          {' '}results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            ${buttonSize} 
            flex items-center justify-center 
            border border-gray-300 rounded-lg 
            bg-white hover:bg-gray-50 
            text-gray-700 hover:text-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed 
            disabled:hover:bg-white disabled:hover:text-gray-700
            transition-all duration-200 
            font-medium shadow-sm hover:shadow
          `}
          title="Previous page"
        >
          <FiChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className={`${buttonSize} flex items-center justify-center text-gray-400`}>
                  <FiMoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`
                    ${buttonSize} 
                    flex items-center justify-center 
                    border rounded-lg font-medium
                    transition-all duration-200 shadow-sm
                    ${page === currentPage
                      ? 'border-blue-500 bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:shadow'
                    }
                  `}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Page Info */}
        <div className="sm:hidden flex items-center">
          <span className={`${buttonSize} text-gray-600 font-medium`}>
            {currentPage} of {totalPages}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            ${buttonSize} 
            flex items-center justify-center 
            border border-gray-300 rounded-lg 
            bg-white hover:bg-gray-50 
            text-gray-700 hover:text-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed 
            disabled:hover:bg-white disabled:hover:text-gray-700
            transition-all duration-200 
            font-medium shadow-sm hover:shadow
          `}
          title="Next page"
        >
          Next
          <FiChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Quick Jump (Optional) */}
      <div className="hidden lg:flex items-center space-x-2 order-3">
        <span className="text-sm text-gray-600">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                handlePageChange(page);
                e.target.value = '';
              }
            }
          }}
          placeholder={currentPage}
        />
      </div>
    </div>
  );
}

// Alternative Compact Pagination
export function CompactPagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>
      
      <span className="px-4 py-2 text-sm font-medium text-gray-700">
        {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}