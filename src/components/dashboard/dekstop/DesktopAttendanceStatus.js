// src/components/dashboard/DesktopAttendanceStatus.js
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
    <div className="hidden md:block bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiClock className="mr-3 text-emerald-600 h-6 w-6" />
            Today's Attendance
          </h2>
          <div className="text-sm text-gray-500">
            {timeUtils.formatDateTime(new Date().toISOString())}
          </div>
        </div>
      </div>

      <div className="p-6">
        {todayStatus ? (
          <div className="space-y-6">
            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Check In */}
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm font-medium text-emerald-700 mb-2">Check-in</div>
                <div className="text-2xl font-bold text-emerald-900 mb-2">
                  {todayStatus.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
                </div>
                {todayStatus.CheckInTime && (
                  <div className="text-xs text-emerald-600">
                    {timeUtils.formatDateLocale(todayStatus.CheckInTime)}
                  </div>
                )}
              </div>
              
              {/* Check Out */}
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiXCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm font-medium text-purple-700 mb-2">Check-out</div>
                <div className="text-2xl font-bold text-purple-900 mb-2">
                  {todayStatus.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
                </div>
                {todayStatus.CheckOutTime && (
                  <div className="text-xs text-purple-600">
                    {timeUtils.formatDateLocale(todayStatus.CheckOutTime)}
                  </div>
                )}
              </div>
              
              {/* Working Hours */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <FiClock className="h-6 w-6 text-white" />
                  {liveWorkingHours && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-sm font-medium text-blue-700 mb-2">
                  {liveWorkingHours ? 'Current Working Hours' : 'Total Working Hours'}
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  {liveWorkingHours ? timeUtils.formatWorkingHours(liveWorkingHours) :
                   todayStatus.CheckInTime && todayStatus.CheckOutTime 
                    ? timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)
                    : todayStatus.CheckInTime 
                      ? timeUtils.calculateWorkingHours(todayStatus.CheckInTime, currentTime.toISOString())
                      : '--'
                  }
                </div>
                {liveWorkingHours && (
                  <div className="text-xs text-blue-600 animate-pulse">
                    Live tracking...
                  </div>
                )}
              </div>
            </div>
            
            {/* Live Timer Section */}
            {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-700 mb-2">Time since check-in</div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {liveWorkingHours ? timeUtils.formatWorkingHours(liveWorkingHours) : 
                     timeUtils.calculateWorkingHours(todayStatus.CheckInTime, currentTime.toISOString())}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-blue-600">Live tracking active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {!userLocation || !userLocation.hasCoordinates ? (
                <div className="flex items-center text-amber-700 bg-amber-50 px-8 py-4 rounded-xl border border-amber-200 font-medium text-lg">
                  <AlertTriangle className="mr-3 text-amber-600 h-5 w-5" />
                  <span>Location setup required</span>
                </div>
              ) : !todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkInLoading || gettingLocation}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FiCheckCircle className="mr-3 h-5 w-5" />
                  {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In Now'}
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkOutLoading || gettingLocation}
                  className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-xl hover:from-rose-700 hover:to-rose-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FiXCircle className="mr-3 h-5 w-5" />
                  {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying Location...' : 'Check Out Now'}
                </button>
              ) : (
                <div className="flex items-center text-emerald-700 bg-emerald-50 px-8 py-4 rounded-xl border border-emerald-200 font-medium text-lg">
                  <CheckCircle className="mr-3 text-emerald-600 h-5 w-5" />
                  <span>Attendance completed for today</span>
                </div>
              )}
            </div>

            {/* Completed Day Summary */}
            {todayStatus.CheckInTime && todayStatus.CheckOutTime && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-700 mb-4">Today's Summary</div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-green-600 font-medium mb-1">Session Duration</div>
                      <div className="text-2xl font-bold text-green-900">
                        {timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h
                      </div>
                    </div>
                    <div>
                      <div className="text-green-600 font-medium mb-1">Status</div>
                      <div className="text-lg font-semibold text-green-900">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No Attendance Today */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiClock className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xl font-medium mb-2">No attendance recorded for today</p>
            <p className="text-sm text-gray-400 mb-8">Start your day by checking in</p>
            
            {!userLocation || !userLocation.hasCoordinates ? (
              <div className="flex items-center text-amber-700 bg-amber-50 px-8 py-4 rounded-xl border border-amber-200 font-medium text-lg justify-center mx-auto max-w-sm">
                <AlertTriangle className="mr-3 text-amber-600 h-5 w-5" />
                <span>Location setup required</span>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading || gettingLocation}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center mx-auto transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FiCheckCircle className="mr-3 h-5 w-5" />
                {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopAttendanceStatus;