// src/components/departments/MobileDepartmentCards.js
import { FiUsers, FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import { useState } from 'react';
import { DeleteAlert } from '@/components/ui/AlertDialog';

const MobileDepartmentCards = ({ 
  departments, 
  handleEdit, 
  handleDelete, 
  formatCurrency, 
  userRole 
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    department: null,
    loading: false
  });

  const toggleMenu = (departmentId) => {
    setActiveMenu(activeMenu === departmentId ? null : departmentId);
  };

  const showDeleteDialog = (department) => {
    setDeleteDialog({
      isOpen: true,
      department: department,
      loading: false
    });
    setActiveMenu(null);
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

        <div className="p-4 space-y-3">
          {departments.map((department) => (
            <div 
              key={department.DepartmentID} 
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <MdBusiness className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {department.DepartmentName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Code: {department.DepartmentCode}
                    </p>
                  </div>
                </div>
                
                {userRole === 'admin' && (
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(department.DepartmentID)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiMoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                    
                    {activeMenu === department.DepartmentID && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            handleEdit(department);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <FiEdit className="mr-2 h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => showDeleteDialog(department)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <FiTrash2 className="mr-2 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stats - Horizontal Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {/* Manager */}
                <div className="bg-gray-50 rounded-lg p-2 min-w-[100px] flex-shrink-0">
                  <div className="text-xs text-gray-600">Manager</div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {department.ManagerName || 'Not Assigned'}
                  </div>
                </div>

                {/* Employees */}
                <div className="bg-blue-50 rounded-lg p-2 min-w-[80px] flex-shrink-0 border border-blue-100">
                  <div className="text-xs text-blue-600">Employees</div>
                  <div className="text-sm font-semibold text-blue-900 flex items-center">
                    <FiUsers className="mr-1 h-3 w-3" />
                    {department.TotalEmployees || 0}
                  </div>
                </div>

                {/* Budget */}
                <div className="bg-emerald-50 rounded-lg p-2 min-w-[90px] flex-shrink-0 border border-emerald-100">
                  <div className="text-xs text-emerald-600">Budget</div>
                  <div className="text-sm font-semibold text-emerald-900">
                    {formatCurrency(department.Budget)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Click outside to close menu */}
        {activeMenu && (
          <div 
            className="fixed inset-0 z-5"
            onClick={() => setActiveMenu(null)}
          />
        )}
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

export default MobileDepartmentCards;