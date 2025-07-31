// src/components/attendanceComponent/MobileAttendanceHistory.js
import { FiCalendar, FiClock, FiFilter, FiX, FiChevronRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

const MobileAttendanceHistory = ({ 
  attendanceRecords, 
  dateRange, 
  setDateRange, 
  timeUtils,
  getStatusColor 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  // Memoize processed records for performance
  const processedRecords = useMemo(() => {
    return attendanceRecords.slice(0, 10).map(record => ({
      ...record,
      formattedDate: format(new Date(record.AttendanceDate), 'MMM d'),
      formattedDay: format(new Date(record.AttendanceDate), 'EEE'),
      checkInTime: record.CheckInTime ? timeUtils.formatTimeUTC(record.CheckInTime) : null,
      checkOutTime: record.CheckOutTime ? timeUtils.formatTimeUTC(record.CheckOutTime) : null,
      workingHours: record.WorkingHours ? timeUtils.formatWorkingHours(record.WorkingHours) : '0h'
    }));
  }, [attendanceRecords, timeUtils]);

  const toggleFilters = () => setShowFilters(!showFilters);
  
  const toggleRecord = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return <FiCheck className="h-3 w-3" />;
      case 'absent': return <FiX className="h-3 w-3" />;
      case 'late': return <FiAlertCircle className="h-3 w-3" />;
      default: return <FiClock className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FiCalendar className="text-white h-3.5 w-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">History</h2>
              <p className="text-xs text-gray-600">{attendanceRecords.length} records</p>
            </div>
          </div>
          
          {/* Compact Filter Button */}
          <button
            onClick={toggleFilters}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            {showFilters ? <FiX className="h-4 w-4" /> : <FiFilter className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Compact Date Filters */}
      {showFilters && (
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 block">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                style={{ fontSize: '16px' }}
              />
              <input
                type="date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Compact Records List */}
      <div className="divide-y divide-gray-100">
        {processedRecords.length > 0 ? (
          processedRecords.map((record) => (
            <div key={record.AttendanceID} className="hover:bg-gray-50 transition-colors duration-200">
              {/* Compact Main Row */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {/* Smaller Status Icon */}
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${getStatusColor(record.AttendanceStatus)}`}>
                      {getStatusIcon(record.AttendanceStatus)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.formattedDate}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.formattedDay}
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Status Badge */}
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(record.AttendanceStatus)}`}>
                    {record.AttendanceStatus}
                  </div>
                </div>

                {/* Compact Time Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Check In */}
                  <div className="text-center p-1.5 bg-green-50 rounded border border-green-100">
                    <div className="text-xs text-green-700 mb-0.5">In</div>
                    <div className="text-xs font-medium text-green-900">
                      {record.checkInTime || '--:--'}
                    </div>
                  </div>

                  {/* Check Out */}
                  <div className="text-center p-1.5 bg-red-50 rounded border border-red-100">
                    <div className="text-xs text-red-700 mb-0.5">Out</div>
                    <div className="text-xs font-medium text-red-900">
                      {record.checkOutTime || '--:--'}
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="text-center p-1.5 bg-blue-50 rounded border border-blue-100">
                    <div className="text-xs text-blue-700 mb-0.5">Hrs</div>
                    <div className="text-xs font-medium text-blue-900">
                      {record.workingHours}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 px-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No records found</p>
            <p className="text-xs text-gray-500">Your attendance history will appear here</p>
          </div>
        )}
      </div>

      {/* Compact Load More */}
      {attendanceRecords.length > 10 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded transition-colors">
            View all {attendanceRecords.length} records
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileAttendanceHistory;
