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
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-semibold text-gray-900 truncate">
          Welcome back, {user.fullName}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {timeUtils.formatDateTime(new Date().toISOString())}
        </p>
      </div>
      
      <div className="flex-shrink-0">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-70 text-sm font-medium"
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}

