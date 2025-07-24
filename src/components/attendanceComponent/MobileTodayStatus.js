// src/components/attendanceComponent/MobileTodayStatus.js
import { Target, Play, Pause, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const MobileTodayStatus = ({ 
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 max-w-md mx-auto md:hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">Today's Status</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          {format(new Date(), 'MMM d, yyyy')}
        </span>
      </div>

      {/* Current Status - Compact */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-3 mb-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-xs">Status</h3>
              <p className="text-blue-800 font-semibold text-sm">
                {!todayStatus || !todayStatus.CheckInTime ? 'Not Marked' : 
                 todayStatus.CheckOutTime ? '✅ Done' : '🟢 Active'}
              </p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            todayStatus?.CheckInTime ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`}></div>
        </div>
      </div>

      {/* Time Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Check In & Out Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Check In Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg p-3 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-white" />
              </div>
              <Clock className="h-3 w-3 text-emerald-600" />
            </div>
            <h3 className="font-medium text-gray-900 text-xs mb-1">Check In</h3>
            <div className="text-lg font-bold text-emerald-900 mb-1">
              {todayStatus?.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
            </div>
            <p className="text-xs text-emerald-700">
              {todayStatus?.CheckInTime ? 'Recorded' : 'Pending'}
            </p>
          </div>

          {/* Check Out Card */}
          <div className="bg-gradient-to-br from-rose-50 to-red-100 rounded-lg p-3 border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <Pause className="h-4 w-4 text-white" />
              </div>
              <Clock className="h-3 w-3 text-rose-600" />
            </div>
            <h3 className="font-medium text-gray-900 text-xs mb-1">Check Out</h3>
            <div className="text-lg font-bold text-rose-900 mb-1">
              {todayStatus?.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
            </div>
            <p className="text-xs text-rose-700">
              {todayStatus?.CheckOutTime ? 'Recorded' : todayStatus?.CheckInTime ? 'Ready' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Working Hours Card - Full Width */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-xs">Working Hours</h3>
                <div className="text-lg font-bold text-purple-900">
                  {todayStatus?.WorkingHours ? timeUtils.formatWorkingHours(todayStatus.WorkingHours) : '0h 0m'}
                </div>
              </div>
            </div>
            <div className="text-right">
              {todayStatus?.CheckInTime && !todayStatus?.CheckOutTime ? (
                <div className="flex items-center text-xs text-purple-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-1"></div>
                  Live
                </div>
              ) : (
                <CheckCircle className="h-4 w-4 text-purple-600" />
              )}
              <p className="text-xs text-purple-700 mt-1">
                {todayStatus?.CheckInTime && !todayStatus?.CheckOutTime ? 'In progress' : 'Total today'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button - Mobile Optimized */}
      <div className="flex justify-center">
        {!userLocation || !userLocation.hasCoordinates ? (
          <div className="flex items-center text-amber-700 bg-amber-100 px-4 py-2 rounded-lg border border-amber-200 font-medium w-full justify-center">
            <AlertTriangle className="mr-2 text-amber-600 h-4 w-4" />
            <span className="text-sm">Location required</span>
          </div>
        ) : !todayStatus || !todayStatus.CheckInTime ? (
          <button
            onClick={handleCheckIn}
            disabled={checkInLoading || gettingLocation}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 font-medium w-full justify-center"
          >
            <Play className="mr-2 h-4 w-4" />
            {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying...' : 'Check In'}
          </button>
        ) : !todayStatus.CheckOutTime ? (
          <button
            onClick={handleCheckOut}
            disabled={checkOutLoading || gettingLocation}
            className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-2.5 rounded-lg hover:from-rose-700 hover:to-rose-800 flex items-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 font-medium w-full justify-center"
          >
            <Pause className="mr-2 h-4 w-4" />
            {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying...' : 'Check Out'}
          </button>
        ) : (
          <div className="flex items-center text-emerald-700 bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-200 font-medium w-full justify-center">
            <CheckCircle className="mr-2 text-emerald-600 h-4 w-4" />
            <span className="text-sm">Completed for today</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTodayStatus;