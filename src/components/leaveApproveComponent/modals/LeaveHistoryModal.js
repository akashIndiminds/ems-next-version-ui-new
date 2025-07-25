// components/modals/LeaveHistoryModal.js
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';

export function LeaveHistoryModal({ 
  isOpen, 
  onClose, 
  leave,
  leaveHistory 
}) {
  if (!isOpen || !leave) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl max-w-4xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Leave Modification History</h3>
            <p className="text-gray-600 mt-1">
              {leave.EmployeeName} - {leave.LeaveTypeName}
            </p>
          </div>
          
          {leaveHistory.length > 0 ? (
            <div className="space-y-4">
              {leaveHistory.map((history, index) => (
                <div key={history.HistoryID} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{history.ModificationType}</span>
                    <span className="text-sm text-gray-500">
                      {format(parseISO(history.ModifiedDate), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {history.ModificationType === 'DateChange' && (
                      <>
                        <div>
                          <span className="font-medium text-gray-700">Old Dates:</span>
                          <div className="text-gray-600">
                            {history.OldFromDate ? format(parseISO(history.OldFromDate), 'MMM d, yyyy') : '-'} to{' '}
                            {history.OldToDate ? format(parseISO(history.OldToDate), 'MMM d, yyyy') : '-'}
                          </div>
                          <div className="text-gray-600">
                            Days: {history.OldTotalDays || '-'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">New Dates:</span>
                          <div className="text-gray-600">
                            {history.NewFromDate ? format(parseISO(history.NewFromDate), 'MMM d, yyyy') : '-'} to{' '}
                            {history.NewToDate ? format(parseISO(history.NewToDate), 'MMM d, yyyy') : '-'}
                          </div>
                          <div className="text-gray-600">
                            Days: {history.NewTotalDays || '-'}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {history.ModificationType === 'StatusChange' && (
                      <>
                        <div>
                          <span className="font-medium text-gray-700">Old Status:</span>
                          <div className="text-gray-600">{history.OldStatus || '-'}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">New Status:</span>
                          <div className="text-gray-600">{history.NewStatus || '-'}</div>
                        </div>
                      </>
                    )}
                    
                    {history.ModificationType === 'Revocation' && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Leave Revoked</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <span className="font-medium text-gray-700">Modified By:</span>
                    <span className="text-gray-600 ml-2">{history.ModifierName}</span>
                  </div>
                  
                  {history.Reason && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Reason:</span>
                      <div className="text-gray-600 mt-1 bg-gray-50 p-2 rounded border">
                        {history.Reason}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No modification history found for this leave.
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
