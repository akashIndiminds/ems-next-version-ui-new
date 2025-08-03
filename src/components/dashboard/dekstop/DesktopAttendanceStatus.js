// components/dashboard/desktop/DesktopAttendanceStatus.js
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const DesktopAttendanceStatus = ({ 
  todayStatus, 
  userLocation,
  timeUtils, 
  currentTime, 
  handleCheckIn, 
  handleCheckOut,
  getLiveWorkingHours,
  checkInLoading,
  checkOutLoading,
  gettingLocation
}) => {
  const liveWorkingHours = getLiveWorkingHours();

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <FiClock className="w-4 h-4 mr-2 text-gray-600" />
            Today's Attendance
          </h2>
          <span className="text-xs text-gray-500">
            {timeUtils.formatDateTime(new Date().toISOString())}
          </span>
        </div>
      </div>

      <div className="p-4">
        {todayStatus ? (
          <div className="space-y-4">
            {/* Compact Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Check In */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-emerald-100 rounded mr-2">
                    <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-emerald-700">Check-in</span>
                </div>
                <div className="text-lg font-semibold text-emerald-900 mb-0.5">
                  {todayStatus.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
                </div>
                {todayStatus.CheckInTime && (
                  <div className="text-xs text-emerald-600">
                    {timeUtils.formatDateLocale(todayStatus.CheckInTime)}
                  </div>
                )}
              </div>
              
              {/* Check Out */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-purple-100 rounded mr-2">
                    <FiXCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-purple-700">Check-out</span>
                </div>
                <div className="text-lg font-semibold text-purple-900 mb-0.5">
                  {todayStatus.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
                </div>
                {todayStatus.CheckOutTime && (
                  <div className="text-xs text-purple-600">
                    {timeUtils.formatDateLocale(todayStatus.CheckOutTime)}
                  </div>
                )}
              </div>
              
              {/* Working Hours */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-blue-100 rounded mr-2 relative">
                    <FiClock className="w-3 h-3 text-blue-600" />
                    {liveWorkingHours && (
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-blue-700">
                    {liveWorkingHours ? 'Live Hours' : 'Total Hours'}
                  </span>
                </div>
                <div className="text-lg font-semibold text-blue-900 mb-0.5">
                  {liveWorkingHours ? timeUtils.formatWorkingHours(liveWorkingHours) :
                   todayStatus.CheckInTime && todayStatus.CheckOutTime 
                    ? timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)
                    : todayStatus.CheckInTime 
                      ? timeUtils.calculateWorkingHours(todayStatus.CheckInTime, currentTime.toISOString())
                      : '--'
                  }
                </div>
                {liveWorkingHours && (
                  <div className="text-xs text-blue-600">
                    <span className="inline-flex items-center">
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse mr-1"></span>
                      Live tracking
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Live Timer Section */}
            {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="text-center">
                  <div className="text-xs font-medium text-blue-700 mb-1">Time since check-in</div>
                  <div className="text-xl font-semibold text-blue-900 mb-1">
                    {liveWorkingHours ? timeUtils.formatWorkingHours(liveWorkingHours) : 
                     timeUtils.calculateWorkingHours(todayStatus.CheckInTime, currentTime.toISOString())}
                  </div>
                  <div className="flex items-center justify-center text-xs text-blue-600">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                    Live tracking active
                  </div>
                </div>
              </div>
            )}

            {/* Compact Action Buttons */}
            <div className="flex justify-center">
              {!userLocation || !userLocation.hasCoordinates ? (
                <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Location setup required
                </div>
              ) : !todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkInLoading || gettingLocation}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                  {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In'}
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkOutLoading || gettingLocation}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiXCircle className="w-4 h-4 mr-2" />
                  {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying Location...' : 'Check Out'}
                </button>
              ) : (
                <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Attendance completed for today
                </div>
              )}
            </div>

            {/* Compact Completed Day Summary */}
            {todayStatus.CheckInTime && todayStatus.CheckOutTime && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-emerald-700 mb-2">Today's Summary</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-emerald-600 text-xs font-medium mb-0.5">Duration</div>
                      <div className="text-lg font-semibold text-emerald-900">
                        {timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h
                      </div>
                    </div>
                    <div>
                      <div className="text-emerald-600 text-xs font-medium mb-0.5">Status</div>
                      <div className="text-lg font-semibold text-emerald-900">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No Attendance Today */
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiClock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No attendance today</h3>
            <p className="text-sm text-gray-600 mb-4">Start your day by checking in</p>
            
            {!userLocation || !userLocation.hasCoordinates ? (
              <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Location setup required
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading || gettingLocation}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiCheckCircle className="w-4 h-4 mr-2" />
                {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopAttendanceStatus;
