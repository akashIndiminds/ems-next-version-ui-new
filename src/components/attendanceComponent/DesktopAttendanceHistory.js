// src/components/attendanceComponent/DesktopAttendanceHistory.js
import { FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

const DesktopAttendanceHistory = ({ 
  attendanceRecords, 
  dateRange, 
  setDateRange, 
  timeUtils,
  getStatusColor 
}) => {
  return (
    <div className="hidden md:block bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <FiCalendar className="mr-2 text-gray-600 w-4 h-4" />
            Recent History ({attendanceRecords.length})
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.toDate}
              onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check In</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check Out</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hours</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceRecords.length > 0 ? (
              attendanceRecords.slice(0, 10).map((record, index) => (
                <tr key={record.AttendanceID} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {format(new Date(record.AttendanceDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                    {record.CheckInTime ? timeUtils.formatTimeUTC(record.CheckInTime) : '--'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                    {record.CheckOutTime ? timeUtils.formatTimeUTC(record.CheckOutTime) : '--'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.WorkingHours ? timeUtils.formatWorkingHours(record.WorkingHours) : '0h 0m'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(record.AttendanceStatus)}`}>
                      {record.AttendanceStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  <div className="text-gray-400 mb-1">📋</div>
                  <div className="text-sm">No attendance records found</div>
                  <div className="text-xs text-gray-400 mt-1">Your attendance history will appear here</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesktopAttendanceHistory;
