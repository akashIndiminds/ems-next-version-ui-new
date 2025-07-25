// components/mobile/MobileLeaveManagementContent.js
'use client';

import React from 'react';
import { MobileLeaveCard } from './MobileLeaveCard';

export function MobileLeaveManagementContent({
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
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (currentData.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <div className="text-gray-500 font-medium">
            {activeTab === 'pending' 
              ? 'No pending leave applications'
              : 'No approved leaves found'
            }
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {activeTab === 'pending' 
              ? 'New leave requests will appear here'
              : 'Approved leaves will be listed here'
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Content */}
      <div className="p-4 space-y-4">
        {currentData.map((leave) => (
          <MobileLeaveCard
            key={leave.LeaveApplicationID}
            leave={leave}
            activeTab={activeTab}
            onView={onView}
            onApprove={onApprove}
            onReject={onReject}
            onModify={onModify}
            onRevoke={onRevoke}
            onViewHistory={onViewHistory}
            canManageLeaves={canManageLeaves}
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Pagination */}
      {currentPagination.total > currentPagination.limit && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {((currentPagination.page - 1) * currentPagination.limit) + 1}-
              {Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)} of{' '}
              {currentPagination.total}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onUpdatePagination(activeTab, { page: currentPagination.page - 1 })}
                disabled={currentPagination.page === 1 || isLoading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium">
                {currentPagination.page}
              </div>
              <button
                onClick={() => onUpdatePagination(activeTab, { page: currentPagination.page + 1 })}
                disabled={currentPagination.page * currentPagination.limit >= currentPagination.total || isLoading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}