// components/modals/LeaveModifyModal.js
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';

export function LeaveModifyModal({ 
  isOpen, 
  onClose, 
  leave,
  modifyData,
  setModifyData,
  onModify,
  isLoading 
}) {
  if (!isOpen || !leave) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onModify();
  };

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    return Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">Modify Leave Dates</h3>
              <p className="text-gray-700 mt-2">
                Update the leave dates for <span className="font-medium text-gray-900">{leave.EmployeeName}</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={modifyData.fromDate}
                    onChange={(e) => setModifyData(prev => ({ ...prev, fromDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={modifyData.toDate}
                    onChange={(e) => setModifyData(prev => ({ ...prev, toDate: e.target.value }))}
                    min={modifyData.fromDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Reason for Modification <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={modifyData.reason}
                  onChange={(e) => setModifyData(prev => ({ ...prev, reason: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Please provide a reason for modifying the dates..."
                  maxLength={500}
                  required
                />
                <div className="text-xs text-gray-600 mt-1">
                  {modifyData.reason.length}/500 characters (minimum 10 characters)
                </div>
              </div>

              {/* Calculate new total days */}
              {modifyData.fromDate && modifyData.toDate && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-900">
                    <div className="font-medium">New Duration: <span className="font-semibold">{
                      calculateDays(modifyData.fromDate, modifyData.toDate)
                    } days</span></div>
                    <div className="font-medium mt-1">Original Duration: <span className="font-semibold">{leave.TotalDays} days</span></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!modifyData.fromDate || !modifyData.toDate || !modifyData.reason.trim() || modifyData.reason.trim().length < 10 || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Modifying...' : 'Modify Leave'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}