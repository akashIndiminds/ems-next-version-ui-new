// src/components/departments/MobileDepartmentList.js
import { FiUsers, FiEdit, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import { useState } from 'react';
import { DeleteAlert } from '@/components/ui/AlertDialog';

const MobileDepartmentList = ({ 
  departments, 
  handleEdit, 
  handleDelete, 
  formatCurrency, 
  userRole 
}) => {
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    department: null,
    loading: false
  });

  const showDeleteDialog = (department) => {
    setDeleteDialog({
      isOpen: true,
      department: department,
      loading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.department) return;
    
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    
    try {
      await handleDelete(deleteDialog.department.DepartmentID);
      setDeleteDialog({ isOpen: false, department: null, loading: false });
    } catch (error) {
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, department: null, loading: false });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MdBusiness className="mr-2 text-purple-600 h-5 w-5" />
            Departments
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {departments.map((department) => (
            <div 
              key={department.DepartmentID} 
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <MdBusiness className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {department.DepartmentName}
                      </h3>
                      <div className="ml-2 flex items-center space-x-1">
                        {userRole === 'admin' && (
                          <>
                            <button
                              onClick={() => handleEdit(department)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => showDeleteDialog(department)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <FiChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      {department.DepartmentCode} • {department.ManagerName || 'No Manager'}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center text-blue-600">
                        <FiUsers className="mr-1 h-3 w-3" />
                        <span className="font-medium">{department.TotalEmployees || 0}</span>
                      </div>
                      <div className="text-emerald-600 font-medium">
                        {formatCurrency(department.Budget)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteAlert
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={`department "${deleteDialog.department?.DepartmentName}"`}
        loading={deleteDialog.loading}
      />
    </>
  );
};

export default MobileDepartmentList;