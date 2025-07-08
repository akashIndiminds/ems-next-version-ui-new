// src/app/(dashboard)/reports/components/ReportTable.js
'use client';

import { useState } from 'react';
import { FiUsers, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ReportTable({ reportData, reportType }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!reportData?.records || reportData.records.length === 0) {
    return null;
  }

  // Get table data based on report type
  const getTableData = () => {
    switch (reportType) {
      case 'attendance':
        return reportData.records || [];
      case 'leave':
        return reportData.records || [];
      case 'employee':
        return reportData.employees || [];
      case 'department':
        return reportData.departments || [];
      case 'monthly':
        return reportData.records || [];
      default:
        return reportData.records || [];
    }
  };

  const tableData = getTableData();

  // Define columns based on report type
  const getColumns = () => {
    switch (reportType) {
      case 'attendance':
        return [
          { key: 'EmployeeName', label: 'Employee Name', sortable: true },
          { key: 'EmployeeCode', label: 'Employee Code', sortable: true },
          { key: 'DepartmentName', label: 'Department', sortable: true },
          { key: 'TotalWorkingDays', label: 'Working Days', sortable: true },
          { key: 'PresentDays', label: 'Present Days', sortable: true },
          { key: 'AbsentDays', label: 'Absent Days', sortable: true },
          { key: 'LateDays', label: 'Late Days', sortable: true },
          { key: 'AttendancePercentage', label: 'Attendance %', sortable: true, format: 'percentage' },
          { key: 'TotalWorkingHours', label: 'Working Hours', sortable: true, format: 'hours' }
        ];
      case 'leave':
        return [
          { key: 'EmployeeName', label: 'Employee Name', sortable: true },
          { key: 'LeaveTypeName', label: 'Leave Type', sortable: true },
          { key: 'FromDate', label: 'From Date', sortable: true, format: 'date' },
          { key: 'ToDate', label: 'To Date', sortable: true, format: 'date' },
          { key: 'TotalDays', label: 'Days', sortable: true },
          { key: 'ApplicationStatus', label: 'Status', sortable: true, format: 'status' },
          { key: 'AppliedDate', label: 'Applied Date', sortable: true, format: 'date' },
          { key: 'ApprovedByName', label: 'Approved By', sortable: true }
        ];
      case 'employee':
        return [
          { key: 'EmployeeCode', label: 'Employee Code', sortable: true },
          { key: 'EmployeeName', label: 'Full Name', sortable: true },
          { key: 'Email', label: 'Email', sortable: true },
          { key: 'DepartmentName', label: 'Department', sortable: true },
          { key: 'DesignationName', label: 'Designation', sortable: true },
          { key: 'DateOfJoining', label: 'Join Date', sortable: true, format: 'date' },
          { key: 'IsActive', label: 'Status', sortable: true, format: 'activeStatus' },
          { key: 'TenureMonths', label: 'Tenure (Months)', sortable: true }
        ];
      case 'department':
        return [
          { key: 'DepartmentCode', label: 'Dept Code', sortable: true },
          { key: 'DepartmentName', label: 'Department Name', sortable: true },
          { key: 'ManagerName', label: 'Manager', sortable: true },
          { key: 'TotalEmployees', label: 'Total Employees', sortable: true },
          { key: 'ActiveEmployees', label: 'Active Employees', sortable: true },
          { key: 'Budget', label: 'Budget', sortable: true, format: 'currency' },
          { key: 'AttendancePercentage', label: 'Avg Attendance %', sortable: true, format: 'percentage' }
        ];
      case 'monthly':
        return [
          { key: 'EmployeeName', label: 'Employee Name', sortable: true },
          { key: 'DepartmentName', label: 'Department', sortable: true },
          { key: 'TotalWorkingDays', label: 'Working Days', sortable: true },
          { key: 'PresentDays', label: 'Present', sortable: true },
          { key: 'AbsentDays', label: 'Absent', sortable: true },
          { key: 'LateDays', label: 'Late', sortable: true },
          { key: 'TotalWorkingHours', label: 'Total Hours', sortable: true, format: 'hours' },
          { key: 'AttendancePercentage', label: 'Attendance %', sortable: true, format: 'percentage' }
        ];
      default:
        return Object.keys(tableData[0] || {}).slice(0, 8).map(key => ({
          key,
          label: key.replace(/([A-Z])/g, ' $1').trim(),
          sortable: true
        }));
    }
  };

  const columns = getColumns();

  // Format cell values
  const formatCellValue = (value, format) => {
    if (value === null || value === undefined) return 'N/A';

    switch (format) {
      case 'date':
        return value ? new Date(value).toLocaleDateString('en-IN') : 'N/A';
      case 'percentage':
        return `${parseFloat(value || 0).toFixed(1)}%`;
      case 'hours':
        return `${parseFloat(value || 0).toFixed(1)}h`;
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0
        }).format(value || 0);
      case 'status':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Approved' ? 'bg-green-100 text-green-800' :
            value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            value === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value}
          </span>
        );
      case 'activeStatus':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? 'Active' : 'Inactive'}
          </span>
        );
      default:
        return value;
    }
  };

  // Filter and search data
  const filteredData = tableData.filter(item => {
    if (!searchTerm) return true;
    
    return Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiUsers className="mr-3 text-emerald-600" />
            Detailed Data Table
          </h3>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        {/* Results info */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {paginatedData.length} of {filteredData.length} results
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr 
                key={index} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                {columns.map(column => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(row[column.key], column.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No data message */}
      {paginatedData.length === 0 && (
        <div className="text-center py-12">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No records available for the selected filters.'}
          </p>
        </div>
      )}
    </div>
  );
}