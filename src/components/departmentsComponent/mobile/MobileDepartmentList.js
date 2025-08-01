// src/components/departments/mobile/MobileDepartmentList.js
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

        <div className="divide-y divide-slate-100">
          {departments.map((department) => (
            <div 
              key={department.DepartmentID} 
              className="px-4 py-3 hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <MdBusiness className="h-4 w-4 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">
                        {department.DepartmentName}
                      </h3>
                      <div className="ml-2 flex items-center space-x-1">
                        {userRole === 'admin' && (
                          <>
                            <button
                              onClick={() => handleEdit(department)}
                              className="w-8 h-8 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => showDeleteDialog(department)}
                              className="w-8 h-8 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {/* <FiChevronRight className="h-4 w-4 text-slate-400" /> */}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                        {department.DepartmentCode}
                      </span>
                      <span>•</span>
                      <span className="truncate">{department.ManagerName || 'No Manager'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        <FiUsers className="mr-1 h-3 w-3" />
                        <span className="font-semibold">{department.TotalEmployees || 0}</span>
                      </div>
                      <div className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
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