import React, { useState } from 'react';
import { FiSearch, FiFilter, FiUser, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const MobileReportTable = ({ reportData, reportType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const itemsPerPage = 10;

  if (!reportData?.records || reportData.records.length === 0) {
    return (
      <div className="px-4">
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No data records available</p>
        </div>
      </div>
    );
  }

  const getTableData = () => {
    switch (reportType) {
      case 'attendance':
      case 'monthly':
        return reportData.records || [];
      case 'leave':
        return reportData.records || [];
      case 'employee':
        return reportData.employees || [];
      case 'department':
        return reportData.departments || [];
      default:
        return reportData.records || [];
    }
  };

  const tableData = getTableData();

  // Filter data based on search
  const filteredData = tableData.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return 'N/A';
    
    const keyLower = key?.toLowerCase() || '';
    
    if (keyLower.includes('date')) {
      return new Date(value).toLocaleDateString('en-IN');
    }
    if (keyLower.includes('percentage')) {
      return `${parseFloat(value).toFixed(1)}%`;
    }
    if (keyLower.includes('hours')) {
      return `${parseFloat(value).toFixed(1)}h`;
    }
    if (keyLower.includes('budget') || keyLower.includes('amount')) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
      }).format(value);
    }
    
    return value;
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toString().toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('present') || statusLower === 'true') {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('pending') || statusLower.includes('late')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (statusLower.includes('rejected') || statusLower.includes('absent') || statusLower === 'false') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const renderAttendanceCard = (record, index) => (
    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{record.EmployeeName}</h3>
            <p className="text-xs text-gray-500">{record.EmployeeCode}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(record.AttendanceStatus)}`}>
          {record.AttendanceStatus}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Department</p>
          <p className="font-medium text-gray-900">{record.DepartmentName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Present Days</p>
          <p className="font-medium text-gray-900">{record.PresentDays}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Attendance %</p>
          <p className="font-medium text-emerald-600">{formatValue(record.AttendancePercentage, 'percentage')}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Working Hours</p>
          <p className="font-medium text-blue-600">{formatValue(record.TotalWorkingHours, 'hours')}</p>
        </div>
      </div>
    </div>
  );

  const renderLeaveCard = (record, index) => (
    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <FiCalendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{record.EmployeeName}</h3>
            <p className="text-xs text-gray-500">{record.LeaveTypeName}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(record.ApplicationStatus)}`}>
          {record.ApplicationStatus}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">From Date</p>
          <p className="font-medium text-gray-900">{formatValue(record.FromDate, 'date')}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">To Date</p>
          <p className="font-medium text-gray-900">{formatValue(record.ToDate, 'date')}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total Days</p>
          <p className="font-medium text-blue-600">{record.TotalDays}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Applied Date</p>
          <p className="font-medium text-gray-600">{formatValue(record.AppliedDate, 'date')}</p>
        </div>
      </div>
    </div>
  );

  const renderEmployeeCard = (record, index) => (
    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{record.EmployeeName}</h3>
            <p className="text-xs text-gray-500">{record.EmployeeCode}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(record.IsActive)}`}>
          {record.IsActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Department</p>
          <p className="font-medium text-gray-900">{record.DepartmentName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Designation</p>
          <p className="font-medium text-gray-900">{record.DesignationName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Join Date</p>
          <p className="font-medium text-blue-600">{formatValue(record.DateOfJoining, 'date')}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Tenure</p>
          <p className="font-medium text-emerald-600">{record.TenureMonths} months</p>
        </div>
      </div>
    </div>
  );

  const renderDepartmentCard = (record, index) => (
    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{record.DepartmentName}</h3>
            <p className="text-xs text-gray-500">{record.DepartmentCode}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Manager</p>
          <p className="font-medium text-gray-900">{record.ManagerName || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total Employees</p>
          <p className="font-medium text-blue-600">{record.TotalEmployees}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Active Employees</p>
          <p className="font-medium text-emerald-600">{record.ActiveEmployees}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Budget</p>
          <p className="font-medium text-purple-600">{formatValue(record.Budget, 'budget')}</p>
        </div>
      </div>
    </div>
  );

  const renderCard = (record, index) => {
    switch (reportType) {
      case 'attendance':
      case 'monthly':
        return renderAttendanceCard(record, index);
      case 'leave':
        return renderLeaveCard(record, index);
      case 'employee':
        return renderEmployeeCard(record, index);
      case 'department':
        return renderDepartmentCard(record, index);
      default:
        return renderAttendanceCard(record, index);
    }
  };

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">📋 Detailed Records</h2>
          <p className="text-sm text-gray-500">{filteredData.length} total records</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Results Info */}
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            Found {filteredData.length} records matching "{searchTerm}"
          </p>
        </div>
      )}

      {/* Data Cards */}
      <div className="space-y-0">
        {paginatedData.length > 0 ? (
          paginatedData.map((record, index) => renderCard(record, startIndex + index))
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No records found</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No data available for the selected filters.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-gray-700 transition-colors touch-manipulation"
              style={{ minHeight: '40px' }}
            >
              Previous
            </button>

            {/* Page numbers for mobile */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors touch-manipulation ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ minWidth: '40px', minHeight: '40px' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-gray-700 transition-colors touch-manipulation"
              style={{ minHeight: '40px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Load More Button (Alternative to pagination) */}
      {totalPages > 1 && currentPage < totalPages && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl touch-manipulation"
            style={{ minHeight: '44px' }}
          >
            Load More Records
          </button>
        </div>
      )}

      {/* Scroll to top */}
      {currentPage > 1 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all touch-manipulation"
            style={{ minWidth: '48px', minHeight: '48px' }}
          >
            <FiClock className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileReportTable;