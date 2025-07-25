// src/components/departments/DesktopPagination.js

const DesktopPagination = ({ 
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
    <div className="hidden md:flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200 bg-gray-50 px-6">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> results
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm cursor-pointer text-black border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        
        <span className="px-4 py-2 text-sm font-medium text-gray-700">
          {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-black cursor-pointer text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DesktopPagination;