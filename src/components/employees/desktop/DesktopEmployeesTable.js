// src/components/employees/desktop/DesktopEmployeesTable.js
'use client';

import { FiUsers, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Pagination from '@/components/ui/Pagination';

export default function DesktopEmployeesTable({ 
  employees,
  filteredEmployees,
  searchTerm,
  activeFilters,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onView,
  onEdit,
  onDelete,
  onAddEmployee,
  loading 
}) {
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FiUsers className="mr-3 text-blue-600" />
          Employees ({filteredEmployees.length})
          {searchTerm || Object.values(activeFilters).some(v => v) ? (
            <span className="ml-2 text-sm font-normal text-gray-700">
              (filtered from {employees.length} total)
            </span>
          ) : null}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Employee Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Joining Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedEmployees.map((employee, index) => (
              <tr
                key={employee.EmployeeID}
                className={`transition-colors duration-150 hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {employee.FirstName?.[0]}{employee.LastName?.[0]}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {employee.FullName || `${employee.FirstName} ${employee.LastName}`}
                      </div>
                      <div className="text-sm text-gray-700">{employee.Email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {employee.EmployeeCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    employee.DepartmentName === 'Unassigned' 
                      ? 'bg-gray-100 text-gray-800 border border-gray-300' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {employee.DepartmentName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {employee.MobileNumber || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(employee.DateOfJoining)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                    employee.IsActive 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {employee.IsActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onView(employee.EmployeeID)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      title="View Details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit(employee.EmployeeID)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                      title="Edit Employee"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      title="Delete Employee"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedEmployees.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-700">
              {searchTerm || Object.values(activeFilters).some(v => v) ? 
                'Try adjusting your search terms or filters.' : 
                'Get started by adding a new employee.'
              }
            </p>
            {!searchTerm && !Object.values(activeFilters).some(v => v) && (
              <div className="mt-6">
                <button
                  onClick={onAddEmployee}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                  Add Employee
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
}