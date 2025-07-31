// src/components/ui/Pagination.js
'use client';

import { FiChevronLeft, FiChevronRight, FiMoreHorizontal, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  itemsPerPage = 10,
  totalItems = 0,
  showInfo = true,
  size = 'default', // 'small', 'default', 'large'
  showQuickJump = false
}) {
  const sizeClasses = {
    small: {
      button: 'px-2 py-1 text-xs h-8 min-w-[32px]',
      input: 'w-12 px-1 py-1 text-xs h-7',
      text: 'text-xs'
    },
    default: {
      button: 'px-3 py-2 text-sm h-9 min-w-[36px]',
      input: 'w-16 px-2 py-1 text-sm h-8',
      text: 'text-sm'
    },
    large: {
      button: 'px-4 py-3 text-base h-11 min-w-[44px]',
      input: 'w-20 px-3 py-2 text-base h-10',
      text: 'text-base'
    }
  };

  const classes = sizeClasses[size] || sizeClasses.default;

  // Improved visible pages calculation for better mobile experience
  const getVisiblePages = () => {
    if (totalPages <= 1) return [];
    
    // For mobile: show fewer pages
    const isMobile = window.innerWidth < 640;
    const maxVisible = isMobile ? 3 : 7;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const delta = Math.floor((maxVisible - 3) / 2); // Reserve space for first, last, and current

    // Always show first page
    pages.push(1);

    if (currentPage - delta > 2) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll to top on page change for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickJump = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(e.target.value);
      if (page >= 1 && page <= totalPages) {
        handlePageChange(page);
        e.target.value = '';
        e.target.blur();
      }
    }
  };

  // Calculate display range
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col space-y-3">
      {/* Main Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Info Text - Desktop */}
        {showInfo && (
          <div className={`${classes.text} text-gray-600 order-2 sm:order-1 hidden sm:block`}>
            Showing{' '}
            <span className="font-semibold text-gray-900">{startItem.toLocaleString()}</span>
            {' '}to{' '}
            <span className="font-semibold text-gray-900">{endItem.toLocaleString()}</span>
            {' '}of{' '}
            <span className="font-semibold text-gray-900">{totalItems.toLocaleString()}</span>
            {' '}results
          </div>
        )}

        {/* Mobile Info - Compact */}
        {showInfo && (
          <div className={`${classes.text} text-gray-600 order-2 sm:order-1 block sm:hidden text-center`}>
            <span className="font-semibold text-gray-900">{startItem}-{endItem}</span>
            {' '}of{' '}
            <span className="font-semibold text-gray-900">{totalItems.toLocaleString()}</span>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center space-x-1 order-1 sm:order-2">
          {/* First Page Button - Desktop Only */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`
              ${classes.button} 
              hidden lg:flex items-center justify-center 
              border border-gray-300 rounded-lg 
              bg-white hover:bg-gray-50 
              text-gray-700 hover:text-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:hover:bg-white disabled:hover:text-gray-700
              transition-all duration-200 
              font-medium shadow-sm hover:shadow
            `}
            title="First page"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </button>

          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              ${classes.button} 
              flex items-center justify-center 
              border rounded-lg font-medium
              transition-all duration-200 shadow-sm
              ${currentPage === 1
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-md'
              }
            `}
            title="Previous page"
          >
            <FiChevronLeft className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page Numbers - Desktop */}
          <div className="hidden sm:flex items-center space-x-1">
            {visiblePages.map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className={`${classes.button} flex items-center justify-center text-gray-400`}>
                    <FiMoreHorizontal className="h-4 w-4" />
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`
                      ${classes.button} 
                      flex items-center justify-center 
                      border rounded-lg font-medium
                      transition-all duration-200 shadow-sm
                      ${page === currentPage
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg ring-2 ring-blue-200 hover:bg-blue-700 hover:border-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-md'
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
            <span className="px-3 py-2 text-sm font-medium text-gray-800 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm">
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              ${classes.button} 
              flex items-center justify-center 
              border rounded-lg font-medium
              transition-all duration-200 shadow-sm
              ${currentPage === totalPages
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-md'
              }
            `}
            title="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight className="h-4 w-4 sm:ml-1" />
          </button>

          {/* Last Page Button - Desktop Only */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`
              ${classes.button} 
              hidden lg:flex items-center justify-center 
              border border-gray-300 rounded-lg 
              bg-white hover:bg-gray-50 
              text-gray-700 hover:text-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:hover:bg-white disabled:hover:text-gray-700
              transition-all duration-200 
              font-medium shadow-sm hover:shadow
            `}
            title="Last page"
          >
            <FiChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Jump - Desktop Only */}
      {showQuickJump && totalPages > 10 && (
        <div className="hidden lg:flex items-center justify-center space-x-2">
          <span className={`${classes.text} text-gray-600`}>Jump to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            className={`${classes.input} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center`}
            onKeyPress={handleQuickJump}
            placeholder={currentPage.toString()}
          />
          <span className={`${classes.text} text-gray-500`}>of {totalPages}</span>
        </div>
      )}
    </div>
  );
}

// Enhanced Compact Pagination for Mobile
export function CompactPagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  showNumbers = false 
}) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
        title="Previous page"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>
      
      {/* Page Numbers for Mobile - Optional */}
      {showNumbers && totalPages <= 5 && (
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`
                w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                ${page === currentPage
                  ? 'bg-blue-600 text-white shadow-md border-2 border-blue-500'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>
      )}
      
      {/* Current Page Info */}
      {!showNumbers && (
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
            {currentPage} of {totalPages}
          </span>
        </div>
      )}
      
      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
        title="Next page"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// Mobile-First Simple Pagination
export function MobilePagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  showDetails = true 
}) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Main Navigation */}
      <div className="flex items-center justify-between w-full max-w-sm">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
        >
          <FiChevronLeft className="h-4 w-4" />
          <span>Prev</span>
        </button>

        {/* Page Indicator */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-900">
            Page {currentPage}
          </span>
          <span className="text-xs text-gray-500">
            of {totalPages}
          </span>
        </div>

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
        >
          <span>Next</span>
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Navigation Dots for small number of pages */}
      {totalPages <= 8 && (
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${page === currentPage
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
                }
              `}
              title={`Go to page ${page}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Ultra Compact Pagination for Tight Spaces
export function MiniPagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        title="Previous"
      >
        <FiChevronLeft className="h-3 w-3" />
      </button>
      
      <span className="px-2 py-1 text-xs font-medium text-gray-700 min-w-[40px] text-center">
        {currentPage}/{totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        title="Next"
      >
        <FiChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}