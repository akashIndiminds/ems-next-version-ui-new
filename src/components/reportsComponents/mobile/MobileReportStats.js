import React from 'react';
import { FiUsers, FiTrendingUp, FiClock, FiBarChart, FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const MobileReportStats = ({ summary, reportType }) => {
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
      return {
        gradient: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        icon: 'text-emerald-600'
      };
    }
    if (keyLower.includes('pending') || keyLower.includes('late')) {
      return {
        gradient: 'from-amber-500 to-amber-600',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        icon: 'text-amber-600'
      };
    }
    if (keyLower.includes('rejected') || keyLower.includes('absent') || keyLower.includes('inactive')) {
      return {
        gradient: 'from-red-500 to-red-600',
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: 'text-red-600'
      };
    }
    if (keyLower.includes('percentage') || keyLower.includes('avg')) {
      return {
        gradient: 'from-purple-500 to-purple-600',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        icon: 'text-purple-600'
      };
    }
    
    return {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: 'text-blue-600'
    };
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return 'N/A';
    
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('percentage')) {
      return `${parseFloat(value).toFixed(1)}%`;
    }
    
    if (keyLower.includes('hours') && keyLower.includes('avg')) {
      return `${parseFloat(value).toFixed(1)}h`;
    }
    
    if (keyLower.includes('budget') || keyLower.includes('amount')) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
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
        return allSummary.slice(0, 6);
    }
  };

  const relevantSummary = getRelevantSummary();

  if (!relevantSummary.length) {
    return (
      <div className="px-4">
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <FiBarChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No summary data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">📊 Report Summary</h2>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* Horizontal Scrolling Cards */}
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {relevantSummary.map(([key, value], index) => {
          const IconComponent = getSummaryIcon(key);
          const colors = getSummaryColor(key);
          
          return (
            <div 
              key={key}
              className="flex-shrink-0 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slideInFromBottom 0.6s ease-out forwards'
              }}
            >
              {/* Gradient accent */}
              <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl ${colors.bg}`}>
                    <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatValue(key, value)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 leading-tight">
                    {formatLabel(key)}
                  </h3>
                  
                  {/* Progress bar for percentages */}
                  {key.toLowerCase().includes('percentage') && value > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out`}
                          style={{ 
                            width: `${Math.min(value, 100)}%`,
                            animationDelay: `${index * 200 + 600}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <div className="mt-2 flex items-center text-xs">
                    {(key.toLowerCase().includes('percentage') || key.toLowerCase().includes('avg')) && (
                      value >= 80 ? (
                        <span className="text-emerald-600 flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                          Excellent
                        </span>
                      ) : value >= 60 ? (
                        <span className="text-amber-600 flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                          Good
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          Needs Attention
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Scroll indicator */}
        <div className="flex-shrink-0 w-4 flex items-center justify-center">
          <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      
      {/* Scroll hint */}
      <div className="text-center mt-2">
        <div className="inline-flex items-center text-xs text-gray-500">
          <div className="w-6 h-0.5 bg-gray-300 rounded mr-2"></div>
          Scroll for more stats
          <div className="w-6 h-0.5 bg-gray-300 rounded ml-2"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MobileReportStats;