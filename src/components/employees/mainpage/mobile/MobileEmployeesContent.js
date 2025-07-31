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
  viewMode = 'card' // 'list' or 'card'
}) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading employees...</p>
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
          <p className="text-sm text-blue-800 font-medium">
            Found {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>
      )}

      {/* Employees List/Cards */}
      <div className="pb-6">
        {filteredEmployees.length > 0 ? (
          <div className={viewMode === 'list' ? '' : 'pt-2'}>
            {viewMode === 'list' ? (
              // List View - Compact
              <div className="bg-white mx-3 mt-3 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {filteredEmployees.map((employee, index) => (
                  <div key={employee.EmployeeID}>
                    <MobileEmployeeListItem
                      employee={employee}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                    {index < filteredEmployees.length - 1 && (
                      <div className="mx-4 border-b border-gray-100"></div>
                    )}
                  </div>
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
          // Empty State
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {hasFilters ? 'No employees found' : 'No employees yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm leading-relaxed">
                {hasFilters 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Get started by adding your first employee to the system.'
                }
              </p>
              {!hasFilters && (
                <button
                  onClick={onAddEmployee}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiPlus className="mr-2 h-5 w-5" />
                  Add First Employee
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}