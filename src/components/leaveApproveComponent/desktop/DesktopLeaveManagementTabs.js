// components/desktop/DesktopLeaveManagementTabs.js
'use client';

import React from 'react';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

export function DesktopLeaveManagementTabs({ 
  activeTab, 
  onTabChange, 
  pendingCount, 
  approvedCount,
  isLoading 
}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => onTabChange('pending')}
            className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiClock className="inline mr-2" />
            Pending Approvals ({pendingCount})
            {activeTab === 'pending' && isLoading && (
              <div className="inline-block ml-2 animate-spin rounded-full h-3 w-3 border-2 border-amber-600 border-t-transparent"></div>
            )}
          </button>
          <button
            onClick={() => onTabChange('approved')}
            className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
              activeTab === 'approved'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiCheckCircle className="inline mr-2" />
            Approved Leaves ({approvedCount})
            {activeTab === 'approved' && isLoading && (
              <div className="inline-block ml-2 animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></div>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}
