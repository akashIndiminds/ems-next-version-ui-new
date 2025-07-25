// components/desktop/DesktopLeaveManagementContent.js
'use client';

import React from 'react';
import { 
  FiUser, FiEye, FiCheck, FiX, FiEdit3, FiXCircle,
  FiClock, FiCheckCircle, FiAlertTriangle
} from 'react-icons/fi';
import { format, parseISO, isAfter, isBefore, differenceInHours } from 'date-fns';
import { MdManageHistory } from "react-icons/md";

export function DesktopLeaveManagementContent({
  currentData,
  activeTab,
  isLoading,
  currentPagination,
  onUpdatePagination,
  onView,
  onApprove,
  onReject,
  onModify,
  onRevoke,
  onViewHistory,
  canManageLeaves,
  isAdmin,
  currentUser
}) {
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
          <FiClock className="mr-1 h-3 w-3" />
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
        message: `Cannot modify/revoke (less than 12 hours remaining)`
      };
    }
    
    return {
      canModify: true,
      message: `${Math.floor(hoursDifference)} hours remaining to modify/revoke`
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className={`p-6 border-b border-gray-200 ${
        activeTab === 'pending' 
          ? 'bg-gradient-to-r from-amber-50 to-orange-50' 
          : 'bg-gradient-to-r from-green-50 to-blue-50'
      }`}>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          {activeTab === 'pending' ? (
            <>
              <FiClock className="mr-3 text-amber-600" />
              Pending Approvals ({currentPagination.total})
              {isLoading && <div className="ml-3 animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent"></div>}
            </>
          ) : (
            <>
              <FiCheckCircle className="mr-3 text-green-600" />
              Approved Leaves ({currentPagination.total})
              {isLoading && <div className="ml-3 animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>}
            </>
          )}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              {activeTab === 'approved' && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Approved By
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((leave, index) => {
              const timeInfo = activeTab === 'approved' ? getTimeRemainingInfo(leave) : null;
              
              return (
                <tr key={leave.LeaveApplicationID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{leave.EmployeeName}</div>
                        <div className="text-sm text-gray-500">{leave.EmployeeCode}</div>
                        <div className="text-xs text-gray-500">{leave.DepartmentName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {leave.LeaveTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>
                      <div className="font-medium">
                        {format(parseISO(leave.FromDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">to</div>
                      <div className="font-medium">
                        {format(parseISO(leave.ToDate), 'MMM d, yyyy')}
                      </div>
                      {activeTab === 'approved' && !leave.IsRevoked && timeInfo && (
                        <div className={`text-xs mt-1 ${timeInfo.canModify ? 'text-green-600' : 'text-red-600'}`}>
                          {timeInfo.message}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {leave.TotalDays} {leave.TotalDays === 1 ? 'day' : 'days'}
                    {leave.ModifiedDate && (
                      <div className="text-xs text-blue-600 mt-1">
                        Modified
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLeaveStatusBadge(leave)}
                  </td>
                  {activeTab === 'approved' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <div className="font-medium">{leave.ApproverName || 'System'}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(leave)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      
                      {activeTab === 'approved' && canManageLeaves && (
                        <button
                          onClick={() => onViewHistory(leave)}
                          className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50 transition-colors"
                          title="View History"
                        >
                          <MdManageHistory className="h-4 w-4" />
                        </button>
                      )}
                      
                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => onApprove(leave.LeaveApplicationID)}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onReject(leave.LeaveApplicationID)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {activeTab === 'approved' && canModifyLeave(leave) && (
                        <button
                          onClick={() => onModify(leave)}
                          className="text-amber-600 hover:text-amber-800 p-1 rounded hover:bg-amber-50 transition-colors"
                          title="Modify Dates"
                        >
                          <FiEdit3 className="h-4 w-4" />
                        </button>
                      )}
                      
                      {activeTab === 'approved' && canRevokeLeave(leave) && (
                        <button
                          onClick={() => onRevoke(leave)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
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
            {currentData.length === 0 && !isLoading && (
              <tr>
                <td colSpan={activeTab === 'approved' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                  {activeTab === 'pending' 
                    ? 'No pending leave applications'
                    : 'No approved leaves found'
                  }
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={activeTab === 'approved' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
                    Loading {activeTab} leaves...
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {currentPagination.total > currentPagination.limit && (
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPagination.page - 1) * currentPagination.limit) + 1} to{' '}
            {Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)} of{' '}
            {currentPagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdatePagination(activeTab, { page: currentPagination.page - 1 })}
              disabled={currentPagination.page === 1 || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm">
              {currentPagination.page}
            </span>
            <button
              onClick={() => onUpdatePagination(activeTab, { page: currentPagination.page + 1 })}
              disabled={currentPagination.page * currentPagination.limit >= currentPagination.total || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}