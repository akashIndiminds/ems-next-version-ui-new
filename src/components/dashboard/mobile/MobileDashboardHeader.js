// components/dashboard/mobile/MobileDashboardHeader.js
'use client';

import { FiRefreshCw, FiUser, FiUsers, FiSettings } from 'react-icons/fi';

export default function MobileDashboardHeader({ 
  user, 
  timeUtils, 
  handleRefresh, 
  refreshing 
}) {
  const getRoleIcon = () => {
    switch(user.role) {
      case 'admin': return FiSettings;
      case 'manager': return FiUsers;
      default: return FiUser;
    }
  };

  const getRoleColor = () => {
    switch(user.role) {
      case 'admin': return 'text-purple-600';
      case 'manager': return 'text-blue-600';
      default: return 'text-emerald-600';
    }
  };

  const getRoleBadge = () => {
    switch(user.role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div>
      {/* Top Row - Title, Role Badge, and Refresh Button */}
      <div className="flex items-center justify-between mb-3">
 <div className="space-y-1">
        <p className="text-sm text-gray-700 font-medium">
          Welcome back, {user.fullName}!
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {timeUtils.formatDateTime(new Date().toISOString())}
          </p>
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
      
      {/* Welcome Message with Company Info */}
     
    </div>
  );
}