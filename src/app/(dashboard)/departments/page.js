// src/app/(dashboard)/departments/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { departmentAPI } from '@/app/lib/api';
import { FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import toast from 'react-hot-toast';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Department Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's departments
          </p>
        </div>
        {user.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Department
          </button>
        )}
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div key={department.DepartmentID} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MdBusiness className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{department.DepartmentName}</h3>
                    <p className="text-sm text-gray-500">Code: {department.DepartmentCode}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Manager</span>
                  <span className="text-sm font-medium text-gray-900">
                    {department.ManagerName || 'Not Assigned'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Employees</span>
                  <span className="text-sm font-medium text-gray-900">
                    <FiUsers className="inline mr-1" />
                    {department.TotalEmployees || 0}
                  </span>
                </div>
                {department.Budget && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Budget</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{department.Budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {user.role === 'admin' && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(department)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(department.DepartmentID)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}></div>
            
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!editingDepartment && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department Code</label>
                      <input
                        type="text"
                        required
                        value={formData.departmentCode}
                        onChange={(e) => setFormData({...formData, departmentCode: e.target.value.toUpperCase()})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="HR, IT, SALES"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department Name</label>
                    <input
                      type="text"
                      required
                      value={formData.departmentName}
                      onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Human Resources"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget (Optional)</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="1000000"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
  );
}