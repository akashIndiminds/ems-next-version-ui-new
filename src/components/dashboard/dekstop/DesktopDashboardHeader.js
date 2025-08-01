// components/dashboard/desktop/DesktopDashboardHeader.js
'use client';

import { FiRefreshCw } from 'react-icons/fi';

export default function DesktopDashboardHeader({ 
  user, 
  timeUtils, 
  handleRefresh, 
  refreshing 
}) {
  return (
    <div className="flex flex-row justify-between items-start gap-6">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-1 text-sm md:text-base text-gray-600 leading-relaxed">
          Welcome back, {user.fullName}! Here's what's happening today.
        </p>
        <div className="mt-2 text-xs md:text-sm text-gray-500">
          {timeUtils.formatDateTime(new Date().toISOString())}
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium"
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}