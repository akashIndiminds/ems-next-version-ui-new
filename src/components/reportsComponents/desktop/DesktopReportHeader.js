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
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getReportIcon()}</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {getReportTitle()}
                </h1>
                <p className="text-gray-600 mt-1">
                  {getReportDescription()}
                </p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(lastUpdated).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 group"
            >
              <FiRefreshCw className={`w-4 h-4 text-gray-600 mr-2 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="font-medium text-gray-700">
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                <FiDownload className="w-4 h-4 mr-2" />
                <span className="font-medium">Export</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-2">
                  <button
                    onClick={onExportPDF}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <FiDownload className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Export PDF</p>
                      <p className="text-xs text-gray-500">Formatted report with charts</p>
                    </div>
                  </button>
                  <button
                    onClick={onExportExcel}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FiDownload className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Export Excel</p>
                      <p className="text-xs text-gray-500">Spreadsheet for analysis</p>
                    </div>
                  </button>
                  <button
                    onClick={onExportCSV}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiDownload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Export CSV</p>
                      <p className="text-xs text-gray-500">Raw data for import</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center space-x-2 border-l border-gray-300 pl-3">
              <button
                onClick={onPrint}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Print Report"
              >
                <FiPrinter className="w-5 h-5" />
              </button>
              
              <button
                onClick={onShare}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Share Report"
              >
                <FiShare2 className="w-5 h-5" />
              </button>

              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Settings">
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      <div className="px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">System Status: Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Real-time Data</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-gray-500">
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