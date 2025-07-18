// src/app/(dashboard)/reports/components/ReportSummary.js
'use client';

import { FiUsers, FiTrendingUp, FiClock, FiBarChart, FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

export default function ReportSummary({ summary, reportType }) {
  
  const getSummaryIcon = (key) => {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('total') || keyLower.includes('employees')) return FiUsers;
    if (keyLower.includes('present') || keyLower.includes('approved') || keyLower.includes('active')) return FiCheckCircle;
    if (keyLower.includes('absent') || keyLower.includes('rejected') || keyLower.includes('inactive')) return FiXCircle;
    if (keyLower.includes('pending') || keyLower.includes('late')) return FiAlertCircle;
    if (keyLower.includes('percentage') || keyLower.includes('avg')) return FiTrendingUp;
    if (keyLower.includes('hours') || keyLower.includes('time')) return FiClock;
    if (keyLower.includes('days') || keyLower.includes('records')) return FiCalendar;
    
    return FiBarChart;
  };

  const getSummaryColor = (key) => {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('approved') || keyLower.includes('present') || keyLower.includes('active')) {
      return 'from-emerald-500 to-emerald-600';
    }
    if (keyLower.includes('pending') || keyLower.includes('late')) {
      return 'from-amber-500 to-amber-600';
    }
    if (keyLower.includes('rejected') || keyLower.includes('absent') || keyLower.includes('inactive')) {
      return 'from-red-500 to-red-600';
    }
    if (keyLower.includes('percentage') || keyLower.includes('avg')) {
      return 'from-purple-500 to-purple-600';
    }
    
    return 'from-blue-500 to-blue-600';
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return 'N/A';
    
    const keyLower = key.toLowerCase();
    
    // Format percentages
    if (keyLower.includes('percentage')) {
      return `${parseFloat(value).toFixed(1)}%`;
    }
    
    // Format hours
    if (keyLower.includes('hours') && keyLower.includes('avg')) {
      return `${parseFloat(value).toFixed(1)}h`;
    }
    
    // Format currency
    if (keyLower.includes('budget') || keyLower.includes('amount')) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
      }).format(value);
    }
    
    // Format large numbers
    if (typeof value === 'number' && value >= 1000) {
      return value.toLocaleString();
    }
    
    return value;
  };

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Get relevant summary cards based on report type
  const getRelevantSummary = () => {
    const allSummary = Object.entries(summary);
    
    switch (reportType) {
      case 'attendance':
        return allSummary.filter(([key]) => 
          ['totalEmployees', 'totalRecords', 'totalPresentDays', 'totalAbsentDays', 'overallAttendancePercentage', 'avgWorkingHours'].includes(key)
        );
      case 'leave':
        return allSummary.filter(([key]) => 
          ['totalEmployees', 'totalApplications', 'pendingApplications', 'approvedApplications', 'rejectedApplications', 'totalApprovedDays'].includes(key)
        );
      case 'employee':
        return allSummary.filter(([key]) => 
          ['totalEmployees', 'activeEmployees', 'inactiveEmployees'].includes(key)
        );
      case 'department':
        return allSummary.filter(([key]) => 
          ['totalDepartments', 'totalEmployees', 'totalBudget'].includes(key)
        );
      default:
        return allSummary.slice(0, 6); // Show first 6 items for other reports
    }
  };

  const relevantSummary = getRelevantSummary();

  if (!relevantSummary.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {relevantSummary.map(([key, value]) => {
        const IconComponent = getSummaryIcon(key);
        const colorClass = getSummaryColor(key);
        
        return (
          <div 
            key={key} 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
          >
            {/* Gradient accent bar */}
            <div className={`h-1 bg-gradient-to-r ${colorClass}`}></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
                    {formatLabel(key)}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatValue(key, value)}
                  </p>
                  
                  {/* Additional context for certain metrics */}
                  {key.toLowerCase().includes('percentage') && value > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${colorClass}`}
                          style={{ width: `${Math.min(value, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Trend indicator for specific metrics */}
              {(key.toLowerCase().includes('percentage') || key.toLowerCase().includes('avg')) && (
                <div className="mt-4 flex items-center text-sm">
                  {value >= 80 ? (
                    <span className="text-emerald-600 flex items-center">
                      <FiTrendingUp className="w-4 h-4 mr-1" />
                      Excellent
                    </span>
                  ) : value >= 60 ? (
                    <span className="text-amber-600 flex items-center">
                      <FiBarChart className="w-4 h-4 mr-1" />
                      Good
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      Needs Attention
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}