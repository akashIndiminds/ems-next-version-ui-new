// src/components/attendanceComponent/DesktopTodayStatus.js
import { format } from 'date-fns';
import { 
  FiChevronsRight, 
  FiPauseCircle, 
  FiPlayCircle, 
  FiTablet,
  FiTarget,
  FiPlay,
  FiPause,
  FiClock,
  FiTrendingUp,
  FiChevronRight,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi';

const DesktopTodayStatus = ({ 
  todayStatus, 
  userLocation, 
  handleCheckIn, 
  handleCheckOut, 
  checkInLoading, 
  checkOutLoading, 
  gettingLocation, 
  timeUtils
}) => {
  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Today's Status</h2>
        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded font-medium">
          {format(new Date(), 'MMM d, yyyy')}
        </span>
      </div>

      {/* Compact Grid Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Status Card */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiTablet className="h-4 w-4 text-white" />
            </div>
            <div className={`w-2 h-2 rounded-full ${
              todayStatus?.CheckInTime ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Status</h3>
          <div className="text-sm font-semibold text-blue-900 mb-0.5">
            {!todayStatus || !todayStatus.CheckInTime ? 'Not Marked' : 
             todayStatus.CheckOutTime ? 'Complete' : 'Active'}
          </div>
          <p className="text-xs text-blue-600 leading-tight">
            {!todayStatus || !todayStatus.CheckInTime ? 'Ready to check in' : 
             todayStatus.CheckOutTime ? 'Day completed' : 'Currently working'}
          </p>
        </div>

        {/* Check In Card */}
        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <FiPlayCircle className="h-4 w-4 text-white" />
            </div>
            <FiChevronsRight className="text-emerald-400 h-4 w-4" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Check In</h3>
          <div className="text-sm font-semibold text-emerald-900 mb-0.5">
            {todayStatus?.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
          </div>
          <p className="text-xs text-emerald-600 leading-tight">
            {todayStatus?.CheckInTime ? 'Entry recorded' : 'Not checked in'}
          </p>
        </div>

        {/* Check Out Card */}
        <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
              <FiPauseCircle className="h-4 w-4 text-white" />
            </div>
            <FiChevronRight className="text-rose-400 h-4 w-4" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Check Out</h3>
          <div className="text-sm font-semibold text-rose-900 mb-0.5">
            {todayStatus?.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
          </div>
          <p className="text-xs text-rose-600 leading-tight">
            {todayStatus?.CheckOutTime ? 'Exit recorded' : 
             todayStatus?.CheckInTime ? 'Ready to checkout' : 'Not checked out'}
          </p>
        </div>

        {/* Working Hours Card */}
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <FiClock className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center">
              {todayStatus?.CheckInTime && !todayStatus?.CheckOutTime ? (
                <div className="flex items-center text-xs text-purple-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse mr-1"></div>
                  Live
                </div>
              ) : (
                <FiTrendingUp className="text-purple-400 h-4 w-4" />
              )}
            </div>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Working Hours</h3>
          <div className="text-sm font-semibold text-purple-900 mb-0.5">
            {todayStatus?.WorkingHours ? timeUtils.formatWorkingHours(todayStatus.WorkingHours) : '0h 0m'}
          </div>
          <p className="text-xs text-purple-600 leading-tight">
            {todayStatus?.CheckInTime && !todayStatus?.CheckOutTime ? 'In progress' : 'Total today'}
          </p>
        </div>
      </div>

      {/* Compact Action Button */}
      <div className="flex justify-center">
        {!userLocation || !userLocation.hasCoordinates ? (
          <div className="flex items-center text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 text-sm">
            <FiAlertTriangle className="mr-2 text-amber-600 h-4 w-4" />
            <span>
              {!userLocation ? 'Location assignment required' : 'Location coordinates required'}
            </span>
          </div>
        ) : !todayStatus || !todayStatus.CheckInTime ? (
          <button
            onClick={handleCheckIn}
            disabled={checkInLoading || gettingLocation}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 flex items-center transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-70 text-sm font-medium"
          >
            <FiPlay className="mr-2 h-4 w-4" />
            {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In'}
          </button>
        ) : !todayStatus.CheckOutTime ? (
          <button
            onClick={handleCheckOut}
            disabled={checkOutLoading || gettingLocation}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-lg hover:bg-rose-700 flex items-center transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-70 text-sm font-medium"
          >
            <FiPauseCircle className="mr-2 h-4 w-4" />
            {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying Location...' : 'Check Out'}
          </button>
        ) : (
          <div className="flex items-center text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 text-sm">
            <FiCheckCircle className="mr-2 text-emerald-600 h-4 w-4" />
            <span>Attendance completed for today</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopTodayStatus;