// src/components/attendanceComponent/DesktopTodayStatus.js
import { format } from 'date-fns';

const DesktopTodayStatus = ({ 
  todayStatus, 
  userLocation, 
  handleCheckIn, 
  handleCheckOut, 
  checkInLoading, 
  checkOutLoading, 
  gettingLocation, 
  timeUtils,
  FiTarget,
  FiPlay,
  FiPause,
  FiClock,
  FiTrendingUp,
  FiChevronRight,
  FiAlertTriangle,
  FiCheckCircle
}) => {
  return (
    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Today's Status</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
          {format(new Date(), 'MMM d, yyyy')}
        </span>
      </div>

      {/* Desktop Grid Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Status Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 lg:p-5 border border-blue-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiTarget className="h-6 w-6 text-white" />
            </div>
            <div className={`w-3 h-3 rounded-full ${
              todayStatus?.CheckInTime ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`}></div>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Status</h3>
          <div className="text-xl font-bold text-blue-900 mb-1">
            {!todayStatus || !todayStatus.CheckInTime ? 'Not Marked' : 
             todayStatus.CheckOutTime ? 'Complete' : 'Active'}
          </div>
          <p className="text-xs text-blue-700">
            {!todayStatus || !todayStatus.CheckInTime ? 'Ready to check in' : 
             todayStatus.CheckOutTime ? 'Day completed' : 'Currently working'}
          </p>
        </div>

        {/* Check In Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 lg:p-5 border border-emerald-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiPlay className="h-6 w-6 text-white" />
            </div>
            <FiChevronRight className="text-emerald-400 h-5 w-5" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Check In</h3>
          <div className="text-xl font-bold text-emerald-900 mb-1">
            {todayStatus?.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
          </div>
          <p className="text-xs text-emerald-700">
            {todayStatus?.CheckInTime ? 'Entry recorded' : 'Not checked in'}
          </p>
        </div>

        {/* Check Out Card */}
        <div className="bg-gradient-to-br from-rose-50 to-red-100 rounded-2xl p-4 lg:p-5 border border-rose-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiPause className="h-6 w-6 text-white" />
            </div>
            <FiChevronRight className="text-rose-400 h-5 w-5" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Check Out</h3>
          <div className="text-xl font-bold text-rose-900 mb-1">
            {todayStatus?.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
          </div>
          <p className="text-xs text-rose-700">
            {todayStatus?.CheckOutTime ? 'Exit recorded' : 
             todayStatus?.CheckInTime ? 'Ready to checkout' : 'Not checked out'}
          </p>
        </div>

        {/* Working Hours Card */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-4 lg:p-5 border border-purple-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiClock className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center">
              {todayStatus?.CheckInTime && !todayStatus?.CheckOutTime ? (
                <div className="flex items-center text-xs text-purple-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-1"></div>
                  Live
                </div>
              ) : (
                <FiTrendingUp className="text-purple-400 h-5 w-5" />
              )}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Working Hours</h3>
          <div className="text-xl font-bold text-purple-900 mb-1">
            {todayStatus?.WorkingHours ? timeUtils.formatWorkingHours(todayStatus.WorkingHours) : '0h 0m'}
          </div>
          <p className="text-xs text-purple-700">
            {todayStatus?.CheckInTime && !todayStatus?.CheckOutTime ? 'In progress' : 'Total today'}
          </p>
        </div>
      </div>

      {/* Action Button - Desktop */}
      <div className="flex justify-center">
        {!userLocation || !userLocation.hasCoordinates ? (
          <div className="flex items-center text-amber-700 bg-amber-100 px-8 py-4 rounded-xl border border-amber-200 font-medium shadow-sm">
            <FiAlertTriangle className="mr-3 text-amber-600 h-5 w-5" />
            <span>
              {!userLocation ? 'Location assignment required' : 'Location coordinates required'}
            </span>
          </div>
        ) : !todayStatus || !todayStatus.CheckInTime ? (
          <button
            onClick={handleCheckIn}
            disabled={checkInLoading || gettingLocation}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-lg"
          >
            <FiPlay className="mr-3 h-5 w-5" />
            {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In'}
          </button>
        ) : !todayStatus.CheckOutTime ? (
          <button
            onClick={handleCheckOut}
            disabled={checkOutLoading || gettingLocation}
            className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-xl hover:from-rose-700 hover:to-rose-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-lg"
          >
            <FiPause className="mr-3 h-5 w-5" />
            {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying Location...' : 'Check Out'}
          </button>
        ) : (
          <div className="flex items-center text-emerald-700 bg-emerald-100 px-8 py-4 rounded-xl border border-emerald-200 font-medium shadow-sm">
            <FiCheckCircle className="mr-3 text-emerald-600 h-5 w-5" />
            <span>Attendance completed for today</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopTodayStatus;