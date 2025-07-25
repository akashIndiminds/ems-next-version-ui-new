
// components/desktop/DesktopLeaveManagementHeader.js
'use client';

import React from 'react';
import { FiArrowLeft, FiRefreshCw, FiDownload } from 'react-icons/fi';
import Link from 'next/link';

export function DesktopLeaveManagementHeader({ 
  onRefresh, 
  onExport, 
  isLoading 
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link 
          href="/leaves" 
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="mr-2 h-5 w-5" />
          Back to Leaves
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Leave Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage pending approvals and approved leave requests
          </p>
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FiDownload className="mr-2 h-4 w-4" />
          Export
        </button>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}

