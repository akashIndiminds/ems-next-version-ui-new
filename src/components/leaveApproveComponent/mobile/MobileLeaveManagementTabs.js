// components/mobile/MobileLeaveManagementTabs.js
'use client';

import React from 'react';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

export function MobileLeaveManagementTabs({ 
  activeTab, 
  onTabChange, 
  pendingCount, 
  approvedCount,
  isLoading 
}) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex">
        <button
          onClick={() => onTabChange('pending')}
          className={`flex-1 flex items-center justify-center py-4 px-3 text-sm font-semibold transition-colors duration-200 ${
            activeTab === 'pending'
              ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiClock className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">Pending</span>
          <span className="ml-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">
            {pendingCount}
          </span>
          {activeTab === 'pending' && isLoading && (
            <div className="ml-2 animate-spin rounded-full h-3 w-3 border-2 border-amber-600 border-t-transparent"></div>
          )}
        </button>
        
        <button
          onClick={() => onTabChange('approved')}
          className={`flex-1 flex items-center justify-center py-4 px-3 text-sm font-semibold transition-colors duration-200 ${
            activeTab === 'approved'
              ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiCheckCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Approved</span>
          <span className="sm:hidden">Approved</span>
          <span className="ml-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
            {approvedCount}
          </span>
          {activeTab === 'approved' && isLoading && (
            <div className="ml-2 animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></div>
          )}
        </button>
      </div>
    </div>
  );
}
