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
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
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

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div key={department.DepartmentID} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
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
                  
                  {department.Budget && (
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                      <span className="text-sm font-medium text-emerald-700">Budget</span>
                      <span className="text-sm font-semibold text-emerald-900">
                        ₹{department.Budget.toLocaleString()}
                      </span>
                    </div>
                  )}
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
                
                <div onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {!editingDepartment && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department Code</label>
                        <input
                          type="text"
                          required
                          value={formData.departmentCode}
                          onChange={(e) => setFormData({...formData, departmentCode: e.target.value.toUpperCase()})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black"
                        placeholder="Human Resources"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (Optional)</label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black"
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
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      {editingDepartment ? 'Update' : 'Add'} Department
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}