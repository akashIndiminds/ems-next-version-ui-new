// src/components/employees/mobile/MobileEmployeesContent.js
'use client';

import { FiUsers, FiPlus } from 'react-icons/fi';
import MobileEmployeeCard from './MobileEmployeeCard';
import MobileEmployeeListItem from './MobileEmployeeListItem';
import MobileEmployeesStats from './MobileEmployeesStats';

export default function MobileEmployeesContent({ 
  employees, 
  departments,
  filteredEmployees,
  searchTerm,
  activeFilters,
  onView, 
  onEdit, 
  onDelete,
  onAddEmployee,
  loading,
  viewMode = 'list' // 'list' or 'card'
}) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading employees...</p>
        </div>
      </div>
    );
  }

  const hasFilters = searchTerm || Object.values(activeFilters).some(v => v);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Stats Section */}
      <MobileEmployeesStats employees={employees} departments={departments} />

      {/* Search Results Info */}
      {hasFilters && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-800">
            Found {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>
      )}

      {/* Employees List/Cards */}
      <div className="pb-6">
        {filteredEmployees.length > 0 ? (
          <div className={viewMode === 'list' ? '' : 'pt-3'}>
            {viewMode === 'list' ? (
              // List View - Compact
              <div className="bg-white">
                {filteredEmployees.map((employee) => (
                  <MobileEmployeeListItem
                    key={employee.EmployeeID}
                    employee={employee}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            ) : (
              // Card View - Detailed
              <div>
                {filteredEmployees.map((employee) => (
                  <MobileEmployeeCard
                    key={employee.EmployeeID}
                    employee={employee}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasFilters ? 'No employees found' : 'No employees yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                {hasFilters 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Get started by adding your first employee to the system.'
                }
              </p>
              {!hasFilters && (
                <button
                  onClick={onAddEmployee}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <FiPlus className="mr-2 h-5 w-5" />
                  Add First Employee
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View Mode Indicator */}
      {/* {filteredEmployees.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs">
          {viewMode === 'list' ? '📋 List View' : '📱 Card View'}
        </div>
      )} */}
    </div>
  );
}