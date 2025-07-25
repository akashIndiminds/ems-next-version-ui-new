// components/modals/LeaveViewModal.js
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';

export function LeaveViewModal({ 
  isOpen, 
  onClose, 
  leave 
}) {
  if (!isOpen || !leave) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Leave Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Employee Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-900">Name:</span> <span className="text-gray-800">{leave.EmployeeName}</span></p>
                <p><span className="font-medium text-gray-900">Code:</span> <span className="text-gray-800">{leave.EmployeeCode}</span></p>
                <p><span className="font-medium text-gray-900">Department:</span> <span className="text-gray-800">{leave.DepartmentName}</span></p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Leave Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-900">Type:</span> <span className="text-gray-800">{leave.LeaveTypeName}</span></p>
                <p><span className="font-medium text-gray-900">From:</span> <span className="text-gray-800">{format(parseISO(leave.FromDate), 'MMM d, yyyy')}</span></p>
                <p><span className="font-medium text-gray-900">To:</span> <span className="text-gray-800">{format(parseISO(leave.ToDate), 'MMM d, yyyy')}</span></p>
                <p><span className="font-medium text-gray-900">Total Days:</span> <span className="text-gray-800">{leave.TotalDays}</span></p>
                {leave.ApproverName && (
                  <p><span className="font-medium text-gray-900">Approved By:</span> <span className="text-gray-800">{leave.ApproverName}</span></p>
                )}
                {leave.ModifiedDate && (
                  <>
                    <p><span className="font-medium text-gray-900">Modified By:</span> <span className="text-gray-800">{leave.ModifierName}</span></p>
                    <p><span className="font-medium text-gray-900">Modified Date:</span> <span className="text-gray-800">{format(parseISO(leave.ModifiedDate), 'MMM d, yyyy')}</span></p>
                  </>
                )}
                {leave.IsRevoked && (
                  <>
                    <p><span className="font-medium text-gray-900">Revoked By:</span> <span className="text-gray-800">{leave.RevokerName}</span></p>
                    <p><span className="font-medium text-gray-900">Revoked Date:</span> <span className="text-gray-800">{format(parseISO(leave.RevokedDate), 'MMM d, yyyy')}</span></p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {leave.Reason && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Reason</h4>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border">{leave.Reason}</p>
            </div>
          )}

          {leave.ModificationReason && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Modification Reason</h4>
              <p className="text-gray-800 bg-blue-50 p-3 rounded-lg border border-blue-200">{leave.ModificationReason}</p>
            </div>
          )}

          {leave.RevocationReason && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Revocation Reason</h4>
              <p className="text-gray-800 bg-red-50 p-3 rounded-lg border border-red-200">{leave.RevocationReason}</p>
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

