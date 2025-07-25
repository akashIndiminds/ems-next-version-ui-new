
// components/mobile/MobileLeaveCard.js
'use client';

import React from 'react';
import { 
  FiUser, FiCalendar, FiClock, FiCheckCircle, FiAlertTriangle,
  FiEye, FiCheck, FiX, FiEdit3, FiXCircle,
} from 'react-icons/fi';
import { format, parseISO, isAfter, isBefore, differenceInHours } from 'date-fns';
import { MdManageHistory } from 'react-icons/md';

export function MobileLeaveCard({ 
  leave, 
  activeTab, 
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
  const getLeaveStatusBadge = () => {
    if (activeTab === 'pending') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <FiClock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    }

    if (leave.IsRevoked) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <FiCheckCircle className="mr-1 h-3 w-3" />
          Completed
        </span>
      );
    } else if (isAfter(fromDate, today)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FiClock className="mr-1 h-3 w-3" />
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiAlertTriangle className="mr-1 h-3 w-3" />
          Ongoing
        </span>
      );
    }
  };

  const canModifyOrRevokeLeave = () => {
    if (!isAdmin && currentUser?.role !== 'manager') return false;
    if (leave.IsRevoked) return false;
    
    const now = new Date();
    const leaveStartDate = parseISO(leave.FromDate);
    const hoursDifference = differenceInHours(leaveStartDate, now);
    
    return hoursDifference >= 12;
  };

  const canRevokeLeave = () => {
    if (!isAdmin) return false;
    return canModifyOrRevokeLeave();
  };

  const canModifyLeave = () => {
    if (!canManageLeaves) return false;
    return canModifyOrRevokeLeave();
  };

  const getTimeRemainingInfo = () => {
    const now = new Date();
    const leaveStartDate = parseISO(leave.FromDate);
    const hoursDifference = differenceInHours(leaveStartDate, now);
    
    if (hoursDifference < 12) {
      return {
        canModify: false,
        message: `Cannot modify (${Math.floor(hoursDifference)}h remaining)`
      };
    }
    
    return {
      canModify: true,
      message: `${Math.floor(hoursDifference)}h to modify`
    };
  };

  const timeInfo = activeTab === 'approved' ? getTimeRemainingInfo() : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FiUser className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {leave.EmployeeName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {leave.EmployeeCode} • {leave.DepartmentName}
            </div>
          </div>
        </div>
        {getLeaveStatusBadge()}
      </div>

      {/* Leave Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">{leave.LeaveTypeName}</span>
          <span className="text-sm font-semibold text-gray-900">
            {leave.TotalDays} {leave.TotalDays === 1 ? 'day' : 'days'}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-gray-600">
          <FiCalendar className="mr-1 h-3 w-3" />
          <span>
            {format(parseISO(leave.FromDate), 'MMM d')} - {format(parseISO(leave.ToDate), 'MMM d, yyyy')}
          </span>
        </div>

        {activeTab === 'approved' && leave.ApproverName && (
          <div className="text-xs text-gray-600">
            Approved by {leave.ApproverName}
            {leave.ApprovedDate && (
              <span> on {format(parseISO(leave.ApprovedDate), 'MMM d')}</span>
            )}
          </div>
        )}

        {leave.ModifiedDate && (
          <div className="text-xs text-blue-600">
            Modified by {leave.ModifierName}
          </div>
        )}

        {leave.IsRevoked && (
          <div className="text-xs text-red-600">
            Revoked by {leave.RevokerName}
          </div>
        )}

        {timeInfo && !leave.IsRevoked && (
          <div className={`text-xs ${timeInfo.canModify ? 'text-green-600' : 'text-red-600'}`}>
            {timeInfo.message}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={() => onView(leave)}
          className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <FiEye className="h-3 w-3" />
          <span>View</span>
        </button>

        <div className="flex items-center space-x-1">
          {activeTab === 'approved' && canManageLeaves && (
            <button
              onClick={() => onViewHistory(leave)}
              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
              title="View History"
            >
              <MdManageHistory className="h-4 w-4" />
            </button>
          )}

          {activeTab === 'pending' && (
            <>
              <button
                onClick={() => onApprove(leave.LeaveApplicationID)}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                title="Approve"
              >
                <FiCheck className="h-4 w-4" />
              </button>
              <button
                onClick={() => onReject(leave.LeaveApplicationID)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject"
              >
                <FiX className="h-4 w-4" />
              </button>
            </>
          )}

          {activeTab === 'approved' && canModifyLeave() && (
            <button
              onClick={() => onModify(leave)}
              className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
              title="Modify"
            >
              <FiEdit3 className="h-4 w-4" />
            </button>
          )}

          {activeTab === 'approved' && canRevokeLeave() && (
            <button
              onClick={() => onRevoke(leave)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Revoke"
            >
              <FiXCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
