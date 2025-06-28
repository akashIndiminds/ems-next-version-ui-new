// src/app/(dashboard)/departments/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { departmentAPI } from '@/app/lib/api';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiSearch, FiGrid, FiList, FiX } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import toast from 'react-hot-toast';

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200 bg-gray-50 px-6">
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
          className="px-3 py-2  text-black cursor-pointer text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    departmentCode: '',
    departmentName: '',
    budget: ''
  });

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 cards per page or 10 rows for table
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  // Auto-detect currency based on user location or company settings
  const currencySymbol = useMemo(() => {
    // You can enhance this logic based on user.company.country or user.location
    const userCountry = user?.company?.country || user?.country || 'IN';
    const currencyMap = {
      'IN': '₹',
      'US': '$',
      'GB': '£',
      'EU': '€',
      'default': '₹'
    };
    return currencyMap[userCountry] || currencyMap.default;
  }, [user]);

  useEffect(() => {
    fetchDepartments();
  }, [user]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getByCompany(user.company.companyId);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;
    
    return departments.filter(department => 
      department.DepartmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.DepartmentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.ManagerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const currentDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDepartments.slice(startIndex, endIndex);
  }, [filteredDepartments, currentPage, itemsPerPage]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        const response = await departmentAPI.update(editingDepartment.DepartmentID, {
          DepartmentName: formData.departmentName,
          Budget: formData.budget
        });
        if (response.data.success) {
          toast.success('Department updated successfully');
          setEditingDepartment(null);
        }
      } else {
        const response = await departmentAPI.create({
          CompanyID: user.company.companyId,
          DepartmentCode: formData.departmentCode,
          DepartmentName: formData.departmentName,
          Budget: formData.budget || 0
        });
        if (response.data.success) {
          toast.success('Department created successfully');
        }
      }
      setShowAddModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save department');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      departmentCode: department.DepartmentCode,
      departmentName: department.DepartmentName,
      budget: department.Budget || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      const response = await departmentAPI.delete(id);
      if (response.data.success) {
        toast.success('Department deleted successfully');
        fetchDepartments();
      }
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  const resetForm = () => {
    setFormData({
      departmentCode: '',
      departmentName: '',
      budget: ''
    });
    setEditingDepartment(null);
  };

  const formatCurrency = (amount) => {
    if (!amount) return `${currencySymbol}0`;
    return `${currencySymbol}${Number(amount).toLocaleString()}`;
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Department Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your organization's departments
            </p>
          </div>
          {user.role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <FiPlus className="mr-2" />
              Add Department
            </button>
          )}
        </div>

        {/* Search and View Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                placeholder="Search departments..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* View Toggle and Results Count */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredDepartments.length}</span> departments found
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'card'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Card View"
                >
                  <FiGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Table View"
                >
                  <FiList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {currentDepartments.length === 0 ? (
            <div className="text-center py-12">
              <MdBusiness className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new department.'}
              </p>
            </div>
          ) : (
            <>
              {/* Card View */}
              {viewMode === 'card' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentDepartments.map((department) => (
                      <div key={department.DepartmentID} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden">
                        {/* Gradient accent bar */}
                        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-300">
                                <MdBusiness className="h-7 w-7 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">{department.DepartmentName}</h3>
                                <p className="text-sm text-gray-600 font-medium">Code: {department.DepartmentCode}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                              <span className="text-sm font-medium text-gray-600">Manager</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {department.ManagerName || 'Not Assigned'}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                              <span className="text-sm font-medium text-blue-700">Employees</span>
                              <span className="text-sm font-semibold text-blue-900 flex items-center">
                                <FiUsers className="inline mr-1" />
                                {department.TotalEmployees || 0}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                              <span className="text-sm font-medium text-emerald-700">Budget</span>
                              <span className="text-sm font-semibold text-emerald-900">
                                {formatCurrency(department.Budget)}
                              </span>
                            </div>
                          </div>

                          {user.role === 'admin' && (
                            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                              <button
                                onClick={() => handleEdit(department)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                title="Edit"
                              >
                                <FiEdit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(department.DepartmentID)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                title="Delete"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manager
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employees
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Budget
                        </th>
                        {user.role === 'admin' && (
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentDepartments.map((department) => (
                        <tr key={department.DepartmentID} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                <MdBusiness className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900">{department.DepartmentName}</div>
                                <div className="text-sm text-gray-500">Code: {department.DepartmentCode}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {department.ManagerName || 'Not Assigned'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm font-medium text-blue-900">
                              <FiUsers className="mr-1 h-4 w-4" />
                              {department.TotalEmployees || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-emerald-900">
                              {formatCurrency(department.Budget)}
                            </div>
                          </td>
                          {user.role === 'admin' && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(department)}
                                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                  title="Edit"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(department.DepartmentID)}
                                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                  title="Delete"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredDepartments.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>

        {/* Add/Edit Department Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}></div>
              
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {editingDepartment ? 'Update department details' : 'Create a new department for your organization'}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {!editingDepartment && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department Code</label>
                        <input
                          type="text"
                          required
                          value={formData.departmentCode}
                          onChange={(e) => setFormData({...formData, departmentCode: e.target.value.toUpperCase()})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="HR, IT, SALES"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name</label>
                      <input
                        type="text"
                        required
                        value={formData.departmentName}
                        onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Human Resources"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Budget (Optional) - {currencySymbol}
                      </label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1000000"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      {editingDepartment ? 'Update' : 'Add'} Department
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}