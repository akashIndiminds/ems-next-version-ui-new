// src/components/departments/desktop/DesktopDepartmentContent.js
import { useState } from 'react';
import { FiUsers, FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import { DeleteAlert } from '@/components/ui/AlertDialog';

const DesktopDepartmentContent = ({ 
  departments, 
  viewMode, 
  handleEdit, 
  handleDelete, 
  formatCurrency, 
  userRole 
}) => {
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    departmentId: null,
    departmentName: '',
    loading: false
  });

  const openDeleteDialog = (department) => {
    setDeleteDialog({
      isOpen: true,
      departmentId: department.DepartmentID,
      departmentName: department.DepartmentName,
      loading: false
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      departmentId: null,
      departmentName: '',
      loading: false
    });
  };

  const confirmDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    
    try {
      // Call the original handleDelete function
      await handleDelete(deleteDialog.departmentId);
      closeDeleteDialog();
    } catch (error) {
      console.error('Delete failed:', error);
      // Keep dialog open on error, stop loading
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {viewMode === 'card' ? (
          /* Card View */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department) => (
                <div 
                  key={department.DepartmentID} 
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
                >
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

                    {userRole === 'admin' && (
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(department)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(department)}
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
        ) : (
          /* Table View */
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
                  {userRole === 'admin' && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((department) => (
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
                    {userRole === 'admin' && (
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
                            onClick={() => openDeleteDialog(department)}
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
      </div>

      {/* Custom Delete Dialog */}
      <DeleteAlert
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemName={`department "${deleteDialog.departmentName}"`}
        loading={deleteDialog.loading}
      />
    </>
  );
};

export default DesktopDepartmentContent;