import React, { useState } from 'react';
import { FiMenu, FiDownload, FiShare2, FiRefreshCw } from 'react-icons/fi';

const MobileReportHeader = ({ 
  reportType, 
  onMenuToggle, 
  onRefresh, 
  isLoading,
  lastUpdated 
}) => {
  const [showActions, setShowActions] = useState(false);

  const getReportIcon = () => {
    const icons = {
      attendance: '📊',
      leave: '🏖️',
      employee: '👥',
      department: '🏢',
      monthly: '📅'
    };
    return icons[reportType] || '📊';
  };

  const getReportTitle = () => {
    const titles = {
      attendance: 'Attendance Report',
      leave: 'Leave Report',
      employee: 'Employee Report',
      department: 'Department Report',
      monthly: 'Monthly Summary'
    };
    return titles[reportType] || 'Reports';
  };

  return (
    <div className=" bg-white shadow-lg border-b border-gray-100">
      {/* Main Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FiMenu className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getReportIcon()}</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {getReportTitle()}
              </h1>
              {lastUpdated && (
                <p className="text-xs text-gray-500">
                  Updated {new Date(lastUpdated).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors touch-manipulation disabled:opacity-50"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FiRefreshCw className={`w-5 h-5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 transition-colors touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FiShare2 className="w-5 h-5 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Action Menu */}
      {showActions && (
        <div className="absolute right-4 top-16 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-10 min-w-48">
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 touch-manipulation">
            <FiDownload className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium">Export PDF</span>
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 touch-manipulation">
            <FiDownload className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium">Export Excel</span>
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 touch-manipulation">
            <FiShare2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Share Report</span>
          </button>
        </div>
      )}

      {/* Loading Bar */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default MobileReportHeader;