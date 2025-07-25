
// components/modals/LeaveRevokeModal.js
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';

export function LeaveRevokeModal({ 
  isOpen, 
  onClose, 
  leave,
  revokeReason,
  setRevokeReason,
  onRevoke,
  isLoading 
}) {
  if (!isOpen || !leave) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRevoke();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revoke Leave</h3>
              <p className="text-gray-700 mt-2">
                Are you sure you want to revoke this leave? This action will restore the employee's leave balance.
              </p>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-800">
                <div className="font-semibold text-gray-900">{leave.EmployeeName}</div>
                <div className="text-gray-800 mt-1">{leave.LeaveTypeName}</div>
                <div className="text-gray-800 mt-1">
                  {format(parseISO(leave.FromDate), 'MMM d, yyyy')} to {format(parseISO(leave.ToDate), 'MMM d, yyyy')}
                </div>
                <div className="text-gray-800 mt-1">
                  {leave.TotalDays} {leave.TotalDays === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Reason for Revocation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                placeholder="Please provide a reason for revoking this leave..."
                maxLength={500}
                required
              />
              <div className="text-xs text-gray-600 mt-1">
                {revokeReason.length}/500 characters (minimum 10 characters)
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!revokeReason.trim() || revokeReason.trim().length < 10 || isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Revoking...' : 'Revoke Leave'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

