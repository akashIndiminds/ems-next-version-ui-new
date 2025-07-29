// src/components/dashboard/MobileAttendanceStatus.js
import { FiClock, FiCheckCircle, FiXCircle, FiPlay, FiPause } from 'react-icons/fi';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const MobileAttendanceStatus = ({ 
  todayStatus, 
  timeUtils, 
  currentTime, 
  handleCheckIn, 
  handleCheckOut,
  getLiveWorkingHours 
}) => {
  const liveWorkingHours = getLiveWorkingHours();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiClock className="mr-2 text-emerald-600 h-5 w-5" />
          Today's Status
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {timeUtils.formatDateTime(new Date().toISOString())}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {todayStatus ? (
          <>
            {/* Compact Status Info */}
            <div className="space-y-2">
              {/* Check In Status */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <FiPlay className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Check In</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {todayStatus.CheckInTime ? 'Recorded' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-900">
                    {todayStatus.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
                  </div>
                </div>
              </div>

              {/* Check Out Status */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center mr-3">
                    <FiPause className="h-3 w-3 text-rose-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Check Out</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {todayStatus.CheckOutTime ? 'Recorded' : todayStatus.CheckInTime ? 'Ready' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-rose-900">
                    {todayStatus.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <FiClock className="h-3 w-3 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {liveWorkingHours ? 'Live Hours' : 'Total Hours'}
                    </span>
                    {liveWorkingHours && (
                      <span className="inline-flex items-center ml-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse mr-1"></div>
                        <span className="text-xs text-purple-600">Live</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-900">
                    {todayStatus.CheckInTime && todayStatus.CheckOutTime 
                      ? `${timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h`
                      : liveWorkingHours 
                        ? `${liveWorkingHours}h`
                        : '0h 0m'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Live Timer Banner */}
            {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs font-medium text-blue-700">Time since check-in</span>
                  </div>
                  <div className="text-sm font-bold text-blue-900">
                    {timeUtils.formatTimeDifference(todayStatus.CheckInTime, currentTime.toISOString())}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center pt-2">
              {!todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <FiCheckCircle className="mr-2 h-4 w-4" />
                  Check In Now
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 rounded-xl hover:from-rose-700 hover:to-rose-800 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <FiXCircle className="mr-2 h-4 w-4" />
                  Check Out Now
                </button>
              ) : (
                <div className="w-full flex items-center text-emerald-700 bg-emerald-50 py-3 rounded-xl border border-emerald-200 font-medium justify-center">
                  <CheckCircle className="mr-2 text-emerald-600 h-4 w-4" />
                  <span className="text-sm">Completed for today</span>
                </div>
              )}
            </div>

            {/* Completed Summary */}
            {/* {todayStatus.CheckInTime && todayStatus.CheckOutTime && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-green-700">Today's Summary</div>
                  <div className="flex gap-4 text-xs">
                    <div className="text-right">
                      <div className="text-green-600 font-medium">Session</div>
                      <div className="text-green-900 font-bold">
                        {timeUtils.formatTimeDifference(todayStatus.CheckInTime, todayStatus.CheckOutTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-medium">Hours</div>
                      <div className="text-green-900 font-bold">
                        {timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </>
        ) : (
          /* No Attendance Today */
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiClock className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No attendance today</p>
            <p className="text-xs text-gray-400 mb-4">Start your day by checking in</p>
            <button
              onClick={handleCheckIn}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Check In Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAttendanceStatus;