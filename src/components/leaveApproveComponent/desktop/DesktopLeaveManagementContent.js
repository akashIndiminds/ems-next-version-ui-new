// components/desktop/DesktopLeaveManagementContent.js
"use client";
import React from 'react';
import { 
  FiUser, FiEye, FiCheck, FiX, FiEdit3, FiXCircle,
  FiClock, FiCheckCircle, FiAlertTriangle, FiCalendar
} from 'react-icons/fi';
import { MdManageHistory } from "react-icons/md";
import { format, parseISO, isAfter, isBefore, differenceInHours } from 'date-fns';

export function DesktopLeaveManagementContent({
  currentData = [],
  activeTab,
  isLoading,
  currentPagination = { page: 1, limit: 10, total: 0 },
  onUpdatePagination,
  onView,
  onApprove,
  onReject,
  onModify,
  onRevoke,
  onViewHistory,
  canManageLeaves = false,
  isAdmin = false,
  currentUser = {}
}) {
  // Status badge helper
  const getLeaveStatusBadge = (leave) => {
    if (activeTab === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <FiClock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    }

    if (leave.IsRevoked) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FiXCircle className="mr-1 h-3 w-3" />
          Revoked
        </span>
      );
    }

    const today = new Date();
    const fromDate = parseISO(leave.FromDate);
    const toDate = parseISO(leave.ToDate);

    if (isBefore(toDate, today)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <FiCheckCircle className="mr-1 h-3 w-3" />
          Completed
        </span>
      );
    } else if (isAfter(fromDate, today)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FiCalendar className="mr-1 h-3 w-3" />
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiAlertTriangle className="mr-1 h-3 w-3" />
          Ongoing
        </span>
      );
    }
  };

  // Permission helpers
  const canModifyOrRevokeLeave = (leave) => {
    if (!isAdmin && currentUser?.role !== 'manager') return false;
    if (leave.IsRevoked) return false;
    
    const now = new Date();
    const leaveStartDate = parseISO(leave.FromDate);
    const hoursDifference = differenceInHours(leaveStartDate, now);
    
    return hoursDifference >= 12;
  };

  const canRevokeLeave = (leave) => {
    if (!isAdmin) return false;
    return canModifyOrRevokeLeave(leave);
  };

  const canModifyLeave = (leave) => {
    if (!canManageLeaves) return false;
    return canModifyOrRevokeLeave(leave);
  };

  const getTimeRemainingInfo = (leave) => {
    const now = new Date();
    const leaveStartDate = parseISO(leave.FromDate);
    const hoursDifference = differenceInHours(leaveStartDate, now);
    
    if (hoursDifference < 12) {
      return {
        canModify: false,
        message: `Cannot modify/revoke (less than 12 hours remaining)`,
        color: 'text-red-600'
      };
    }
    
    return {
      canModify: true,
      message: `${Math.floor(hoursDifference)} hours remaining to modify/revoke`,
      color: 'text-green-600'
    };
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`p-6 border-b border-gray-200 ${
        activeTab === 'pending' 
          ? 'bg-gradient-to-r from-amber-50 to-orange-50' 
          : 'bg-gradient-to-r from-green-50 to-blue-50'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            {activeTab === 'pending' ? (
              <>
                <FiClock className="mr-3 h-5 w-5 text-amber-600" />
                Pending Approvals
              </>
            ) : (
              <>
                <FiCheckCircle className="mr-3 h-5 w-5 text-green-600" />
                Approved Leaves
              </>
            )}
          </h2>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {currentPagination.total} total records
            </span>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates & Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {activeTab === 'approved' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved By
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((leave, index) => {
              const timeInfo = activeTab === 'approved' ? getTimeRemainingInfo(leave) : null;
              
              return (
                <tr key={leave.LeaveApplicationID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Employee Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {leave.EmployeeName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {leave.EmployeeCode}
                        </div>
                        <div className="text-xs text-gray-500">
                          {leave.DepartmentName}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Leave Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {leave.LeaveTypeName}
                    </div>
                    {leave.ModifiedDate && (
                      <div className="text-xs text-blue-600 mt-1">
                        Modified
                      </div>
                    )}
                  </td>
                  
                  {/* Dates & Duration */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">
                        {format(parseISO(leave.FromDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">to</div>
                      <div className="font-medium">
                        {format(parseISO(leave.ToDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {leave.TotalDays} {leave.TotalDays === 1 ? 'day' : 'days'}
                      </div>
                      {activeTab === 'approved' && !leave.IsRevoked && timeInfo && (
                        <div className={`text-xs mt-1 ${timeInfo.color}`}>
                          {timeInfo.message}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLeaveStatusBadge(leave)}
                  </td>
                  
                  {/* Approved By (only for approved tab) */}
                  {activeTab === 'approved' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          {leave.ApproverName || 'System'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {leave.ApprovedDate ? format(parseISO(leave.ApprovedDate), 'MMM d, yyyy') : '-'}
                        </div>
                        {leave.ModifiedDate && (
                          <div className="text-xs text-blue-600 mt-1">
                            Modified by {leave.ModifierName}
                          </div>
                        )}
                        {leave.IsRevoked && (
                          <div className="text-xs text-red-600 mt-1">
                            Revoked by {leave.RevokerName}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* View Details */}
                      <button
                        onClick={() => onView(leave)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      
                      {/* View History (approved tab only) */}
                      {activeTab === 'approved' && canManageLeaves && (
                        <button
                          onClick={() => onViewHistory(leave)}
                          className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                          title="View History"
                        >
                          <MdManageHistory className="h-4 w-4" />
                        </button>
                      )}
                      
                      {/* Pending Actions */}
                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => onApprove(leave.LeaveApplicationID)}
                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                            title="Approve"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onReject(leave.LeaveApplicationID)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                            title="Reject"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {/* Approved Actions */}
                      {activeTab === 'approved' && canModifyLeave(leave) && (
                        <button
                          onClick={() => onModify(leave)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-md transition-colors"
                          title="Modify Dates"
                        >
                          <FiEdit3 className="h-4 w-4" />
                        </button>
                      )}
                      
                      {activeTab === 'approved' && canRevokeLeave(leave) && (
                        <button
                          onClick={() => onRevoke(leave)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="Revoke Leave"
                        >
                          <FiXCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Empty State */}
        {currentData.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              {activeTab === 'pending' ? (
                <FiClock className="h-12 w-12" />
              ) : (
                <FiCheckCircle className="h-12 w-12" />
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {activeTab === 'pending' 
                ? 'No pending leave applications'
                : 'No approved leaves found'
              }
            </h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'pending'
                ? 'All leave applications have been processed'
                : 'Try adjusting your filters to see more results'
              }
            </p>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
              <span className="text-sm text-gray-600">
                Loading {activeTab} leaves...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {currentPagination.total > currentPagination.limit && (
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Showing {((currentPagination.page - 1) * currentPagination.limit) + 1} to{' '}
              {Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)} of{' '}
              {currentPagination.total} results
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdatePagination(activeTab, { page: currentPagination.page - 1 })}
              disabled={currentPagination.page === 1 || isLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {/* Page Numbers */}
              {Array.from({ length: Math.ceil(currentPagination.total / currentPagination.limit) }, (_, i) => i + 1)
                .filter(page => {
                  const current = currentPagination.page;
                  return page === 1 || page === Math.ceil(currentPagination.total / currentPagination.limit) || 
                         (page >= current - 1 && page <= current + 1);
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 py-1 text-sm text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => onUpdatePagination(activeTab, { page })}
                      disabled={isLoading}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPagination.page === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))
              }
            </div>
            
            <button
              onClick={() => onUpdatePagination(activeTab, { page: currentPagination.page + 1 })}
              disabled={currentPagination.page * currentPagination.limit >= currentPagination.total || isLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}