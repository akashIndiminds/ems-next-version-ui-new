// src/components/departments/mobile/MobileDepartmentCards.js
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:hidden">
        {/* Header - Professional & Compact */}
        <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <h2 className="text-base font-semibold text-slate-900 flex items-center">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <MdBusiness className="h-4 w-4 text-blue-600" />
            </div>
            Departments
          </h2>
        </div>

        <div className="p-3 space-y-3">
          {departments.map((department) => (
            <div 
              key={department.DepartmentID} 
              className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              {/* Header - Optimized Layout */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <MdBusiness className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate mb-1">
                      {department.DepartmentName}
                    </h3>
                    <div className="flex items-center text-xs text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                        {department.DepartmentCode}
                      </span>
                    </div>
                  </div>
                </div>
                
                {userRole === 'admin' && (
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => toggleMenu(department.DepartmentID)}
                      className="w-8 h-8 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <FiMoreVertical className="h-4 w-4 text-slate-500" />
                    </button>
                    
                    {activeMenu === department.DepartmentID && (
                      <div className="absolute right-0 top-9 w-32 bg-white rounded-lg shadow-lg border border-slate-200 z-10 py-1">
                        <button
                          onClick={() => {
                            handleEdit(department);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                        >
                          <FiEdit className="mr-2 h-4 w-4 text-blue-600" />
                          Edit
                        </button>
                        <button
                          onClick={() => showDeleteDialog(department)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <FiTrash2 className="mr-2 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manager Info - Compact */}
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-1 font-medium">Manager</div>
                <div className="text-sm text-slate-900 font-medium">
                  {department.ManagerName || 'Not Assigned'}
                </div>
              </div>

              {/* Stats - Professional Grid Layout */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-blue-600 font-medium">Employees</div>
                    <FiUsers className="h-3 w-3 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    {department.TotalEmployees || 0}
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-100">
                  <div className="text-xs text-emerald-600 font-medium mb-1">Budget</div>
                  <div className="text-sm font-bold text-emerald-900 leading-tight">
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