// components/dashboard/mobile/MobileDashboardHeader.js
'use client';

import { FiRefreshCw, FiActivity } from 'react-icons/fi';

export default function MobileDashboardHeader({ 
  user, 
  timeUtils, 
  handleRefresh, 
  refreshing 
}) {
  return (
     <div>
      {/* Top Row - Title and Refresh Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Dashboard
            </h1>
          </div>
        </div>
        
        {/* Refresh Button - Compact */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
          aria-label="Refresh Dashboard"
        >
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Welcome Message */}
      <div className="space-y-1">
        <p className="text-sm text-gray-700 font-medium">
          Welcome back, {user.fullName}!
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {timeUtils.formatDateTime(new Date().toISOString())}
        </p>
      </div>
</div>
  );
}