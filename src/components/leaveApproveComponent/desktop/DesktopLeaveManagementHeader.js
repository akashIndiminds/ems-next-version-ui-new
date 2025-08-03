
// components/desktop/DesktopLeaveManagementHeader.js
"use client";
import React from 'react';
import { FiArrowLeft, FiRefreshCw, FiDownload } from 'react-icons/fi';
import Link from 'next/link';

export function DesktopLeaveManagementHeader({ 
  onRefresh, 
  onExport, 
  isLoading 
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left Section - Navigation & Title */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/leaves" 
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Leaves
        </Link>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Leave Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage pending approvals and approved leave requests
          </p>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onExport}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <FiDownload className="mr-2 h-4 w-4" />
          Export
        </button>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}