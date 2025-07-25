// src/app/(dashboard)/departments/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { departmentAPI } from '@/app/lib/api';
import { FiPlus } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import toast from 'react-hot-toast';

// Import responsive components
import MobileDepartmentSearch from '@/components/departmentsComponent/MobileDepartmentSearch';
import DesktopDepartmentSearch from '@/components/departmentsComponent/DesktopDepartmentSearch';
import MobileDepartmentCards from '@/components/departmentsComponent/MobileDepartmentCards';
import MobileDepartmentList from '@/components/departmentsComponent/MobileDepartmentList';
import DesktopDepartmentContent from '@/components/departmentsComponent/DesktopDepartmentContent';
import MobilePagination from '@/components/departmentsComponent/MobilePagination';
import DesktopPagination from '@/components/departmentsComponent/DesktopPagination';

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
  const [itemsPerPage] = useState(6); // 6 cards per page
  const [viewMode, setViewMode] = useState('card'); // 'card', 'list', or 'table'

  // Auto-detect currency based on user location
  const currencySymbol = useMemo(() => {
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
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Department Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your organization's departments
            </p>
          </div>
          {user.role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Department
            </button>
          )}
        </div>

        {/* Search and View Controls - Mobile Version */}
        <MobileDepartmentSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filteredCount={filteredDepartments.length}
        />

        {/* Search and View Controls - Desktop Version */}
        <DesktopDepartmentSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filteredCount={filteredDepartments.length}
        />

        {/* Content Area */}
        {currentDepartments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <MdBusiness className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new department.'}
            </p>
            {!searchTerm && user.role === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center mx-auto transition-all duration-200 shadow-lg font-medium"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Department
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            {viewMode === 'card' && (
              <MobileDepartmentCards 
                departments={currentDepartments}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                formatCurrency={formatCurrency}
                userRole={user.role}
              />
            )}

            {/* Mobile List View */}
            {viewMode === 'list' && (
              <MobileDepartmentList 
                departments={currentDepartments}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                formatCurrency={formatCurrency}
                userRole={user.role}
              />
            )}

            {/* Desktop Content */}
            <DesktopDepartmentContent 
              departments={currentDepartments}
              viewMode={viewMode}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              formatCurrency={formatCurrency}
              userRole={user.role}
            />

            {/* Pagination - Mobile Version */}
            <MobilePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredDepartments.length}
              itemsPerPage={itemsPerPage}
            />

            {/* Pagination - Desktop Version */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <DesktopPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredDepartments.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </>
        )}

        {/* Add/Edit Department Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}></div>
              
              <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
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
                  
                  <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="w-full sm:w-auto bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
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