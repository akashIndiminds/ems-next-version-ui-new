// src/app/(dashboard)/employees/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, departmentAPI } from '@/app/lib/api';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SearchFilter, { employeeFilters } from '@/components/ui/SearchFilter';
import { DeleteAlert } from '@/components/ui/AlertDialog';
import Pagination from '@/components/ui/Pagination';

export default function EmployeesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.role === 'employee') {
      router.push('/dashboard');
      return;
    }
    fetchEmployees();
    fetchDepartments();
  }, [user]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll({
        companyId: user.company.companyId,
        page: currentPage,
        limit: 50 // Fetch more for client-side filtering
      });
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getByCompany(user.company.companyId);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    try {
      setDeleteLoading(true);
      const response = await employeeAPI.delete(employeeToDelete.EmployeeID);
      if (response.data.success) {
        toast.success('Employee deleted successfully');
        setShowDeleteAlert(false);
        setEmployeeToDelete(null);
        fetchEmployees();
      }
    } catch (error) {
      toast.error('Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteAlert(true);
  };

  const handleFilterChange = (key, value) => {
    if (key === null) {
      // Clear all filters
      setActiveFilters(value);
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Default filter configuration if employeeFilters is not available
  const defaultFilters = [
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: []
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ]
    },
    {
      key: 'bloodGroup',
      label: 'Blood Group',
      type: 'select',
      options: [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
      ]
    },
    {
      key: 'joiningDate',
      label: 'Joined After',
      type: 'date'
    }
  ];

  // Create filter options with departments - handle undefined employeeFilters
  const filterConfig = (employeeFilters || defaultFilters).map(filter => {
    if (filter.key === 'department') {
      return {
        ...filter,
        options: departments.map(dept => ({
          value: dept.DepartmentID.toString(),
          label: dept.DepartmentName
        }))
      };
    }
    return filter;
  });

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(emp => {
    // Search filter
    const matchesSearch = !searchTerm || 
      emp.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.EmployeeCode?.toLowerCase().includes(searchTerm.toLowerCase());

    // Department filter
    const matchesDepartment = !activeFilters.department || 
      emp.DepartmentID?.toString() === activeFilters.department;

    // Status filter
    const matchesStatus = !activeFilters.status || 
      emp.IsActive?.toString() === activeFilters.status;

    // Blood group filter
    const matchesBloodGroup = !activeFilters.bloodGroup || 
      emp.BloodGroup === activeFilters.bloodGroup;

    // Joining date filter
    const matchesJoiningDate = !activeFilters.joiningDate || 
      (emp.DateOfJoining && new Date(emp.DateOfJoining) >= new Date(activeFilters.joiningDate));

    return matchesSearch && matchesDepartment && matchesStatus && matchesBloodGroup && matchesJoiningDate;
  });

  // Pagination
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Employee Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your organization's employees
            </p>
          </div>
          <button
            onClick={() => router.push('/employees/new')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus className="mr-2" />
            Add Employee
          </button>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterConfig}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          placeholder="Search employees by name, email, or employee code..."
        />

        {/* Employees Table */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiUsers className="mr-3 text-blue-600" />
              Employees ({filteredEmployees.length})
              {searchTerm || Object.values(activeFilters).some(v => v) ? (
                <span className="ml-2 text-sm font-normal text-gray-600">
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEmployees.map((employee, index) => (
                  <tr key={employee.EmployeeID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                          <div className="text-sm text-gray-600">{employee.Email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {employee.EmployeeCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.DepartmentName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.MobileNumber || 'N/A'}
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
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={() => router.push(`/employees/${employee.EmployeeID}/view`)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/employees/${employee.EmployeeID}/edit`)}
                          className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                          title="Edit Employee"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(employee)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          title="Delete Employee"
                        >
                          <FiTrash2 className="h-4 w-4" />
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
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || Object.values(activeFilters).some(v => v) ? 
                    'Try adjusting your search terms or filters.' : 
                    'Get started by adding a new employee.'
                  }
                </p>
                {!searchTerm && !Object.values(activeFilters).some(v => v) && (
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/employees/new')}
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

          {/* Pagination */}
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

        {/* Delete Alert Dialog */}
        <DeleteAlert
          isOpen={showDeleteAlert}
          onClose={() => {
            setShowDeleteAlert(false);
            setEmployeeToDelete(null);
          }}
          onConfirm={handleDeleteEmployee}
          itemName={`employee ${employeeToDelete?.FirstName} ${employeeToDelete?.LastName}`}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}