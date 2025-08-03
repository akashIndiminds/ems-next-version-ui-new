// Compact DesktopReportHeader.js
import React from 'react';
import { FiDownload, FiShare2, FiRefreshCw, FiPrinter, FiSettings } from 'react-icons/fi';

const DesktopReportHeader = ({ 
  reportType, 
  onRefresh, 
  isLoading, 
  lastUpdated,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onShare,
  onPrint
}) => {
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
      attendance: 'Attendance Analytics',
      leave: 'Leave Management Report',
      employee: 'Employee Overview',
      department: 'Department Analytics',
      monthly: 'Monthly Performance Summary'
    };
    return titles[reportType] || 'Analytics Dashboard';
  };

  const getReportDescription = () => {
    const descriptions = {
      attendance: 'Comprehensive attendance tracking and performance analytics',
      leave: 'Leave applications, approvals, and balance management',
      employee: 'Employee demographics, performance, and organizational insights',
      department: 'Department-wise metrics, budgets, and team analytics',
      monthly: 'Monthly performance summary with key performance indicators'
    };
    return descriptions[reportType] || 'Advanced reporting and analytics';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getReportIcon()}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {getReportTitle()}
                </h1>
                <p className="text-gray-600 text-sm">
                  {getReportDescription()}
                </p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Last updated: {new Date(lastUpdated).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 group text-sm"
            >
              <FiRefreshCw className={`w-4 h-4 text-gray-600 mr-1.5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="font-medium text-gray-700">
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow text-sm">
                <FiDownload className="w-4 h-4 mr-1.5" />
                <span className="font-medium">Export</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={onExportPDF}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                      <FiDownload className="w-3 h-3 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-xs">Export PDF</p>
                      <p className="text-xs text-gray-500">Formatted report with charts</p>
                    </div>
                  </button>
                  <button
                    onClick={onExportExcel}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <div className="w-6 h-6 bg-emerald-100 rounded flex items-center justify-center">
                      <FiDownload className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-xs">Export Excel</p>
                      <p className="text-xs text-gray-500">Spreadsheet for analysis</p>
                    </div>
                  </button>
                  <button
                    onClick={onExportCSV}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <FiDownload className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-xs">Export CSV</p>
                      <p className="text-xs text-gray-500">Raw data for import</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center space-x-1 border-l border-gray-300 pl-2">
              <button
                onClick={onPrint}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200"
                title="Print Report"
              >
                <FiPrinter className="w-4 h-4" />
              </button>
              
              <button
                onClick={onShare}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200"
                title="Share Report"
              >
                <FiShare2 className="w-4 h-4" />
              </button>

              <button className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200" title="Settings">
                <FiSettings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      <div className="px-6 py-3 bg-blue-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 text-xs">System Status: Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 text-xs">Real-time Data</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-500 text-xs">
            <span>Updated every 5 minutes</span>
            <span>•</span>
            <span>Data processed in real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopReportHeader;
