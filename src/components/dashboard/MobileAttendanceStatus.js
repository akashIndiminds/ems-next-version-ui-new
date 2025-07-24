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

      <div className="p-4 space-y-4">
        {todayStatus ? (
          <>
            {/* Status Cards - Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Check In Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-3 min-w-[120px] flex-shrink-0 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <FiPlay className="h-4 w-4 text-white" />
                  </div>
                  <Clock className="h-3 w-3 text-emerald-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-xs mb-1">Check In</h3>
                <div className="text-lg font-bold text-emerald-900 mb-1">
                  {todayStatus.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
                </div>
                <p className="text-xs text-emerald-700">
                  {todayStatus.CheckInTime ? 'Recorded' : 'Pending'}
                </p>
              </div>

              {/* Check Out Card */}
              <div className="bg-gradient-to-br from-rose-50 to-red-100 rounded-xl p-3 min-w-[120px] flex-shrink-0 border border-rose-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                    <FiPause className="h-4 w-4 text-white" />
                  </div>
                  <Clock className="h-3 w-3 text-rose-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-xs mb-1">Check Out</h3>
                <div className="text-lg font-bold text-rose-900 mb-1">
                  {todayStatus.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
                </div>
                <p className="text-xs text-rose-700">
                  {todayStatus.CheckOutTime ? 'Recorded' : todayStatus.CheckInTime ? 'Ready' : 'Pending'}
                </p>
              </div>

              {/* Working Hours Card */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-3 min-w-[140px] flex-shrink-0 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <FiClock className="h-4 w-4 text-white" />
                  </div>
                  {liveWorkingHours && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-xs mb-1">
                  {liveWorkingHours ? 'Live Hours' : 'Total Hours'}
                </h3>
                <div className="text-lg font-bold text-purple-900 mb-1">
                  {todayStatus.CheckInTime && todayStatus.CheckOutTime 
                    ? `${timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h`
                    : liveWorkingHours 
                      ? `${liveWorkingHours}h`
                      : '0h 0m'
                  }
                </div>
                <p className="text-xs text-purple-700">
                  {liveWorkingHours ? 'In progress' : 'Total today'}
                </p>
              </div>
            </div>

            {/* Live Timer */}
            {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                <div className="text-center">
                  <div className="text-xs font-medium text-blue-700 mb-1">Time since check-in</div>
                  <div className="text-lg font-bold text-blue-900">
                    {timeUtils.formatTimeDifference(todayStatus.CheckInTime, currentTime.toISOString())}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-xs text-blue-600">Live</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center">
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
            {todayStatus.CheckInTime && todayStatus.CheckOutTime && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                <div className="text-center">
                  <div className="text-xs font-medium text-green-700 mb-2">Today's Summary</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-green-600 font-medium">Session</div>
                      <div className="text-green-900 font-bold">
                        {timeUtils.formatTimeDifference(todayStatus.CheckInTime, todayStatus.CheckOutTime)}
                      </div>
                    </div>
                    <div>
                      <div className="text-green-600 font-medium">Hours</div>
                      <div className="text-green-900 font-bold">
                        {timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Attendance Today */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiClock className="h-8 w-8 text-gray-400" />
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