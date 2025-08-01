// src/components/dashboard/MobileAttendanceStatus.js
import { FiClock, FiCheckCircle, FiXCircle, FiPlay, FiPause } from 'react-icons/fi';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const MobileAttendanceStatus = ({ 
  todayStatus, 
  userLocation,
  timeUtils, 
  handleCheckIn, 
  handleCheckOut,
  checkInLoading,
  checkOutLoading,
  gettingLocation
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h2 className="text-sm font-medium text-gray-900 flex items-center">
          <FiClock className="mr-2 text-emerald-600 h-4 w-4" />
          Today's Status
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {timeUtils.formatDateTime(new Date().toISOString())}
        </p>
      </div>

      <div className="p-3 space-y-3">
        {todayStatus ? (
          <>
            {/* Compact Status Info */}
            <div className="space-y-1.5">
              {/* Check In Status */}
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center mr-2.5">
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
                  <div className="text-sm font-medium text-emerald-900">
                    {todayStatus.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
                  </div>
                </div>
              </div>

              {/* Check Out Status */}
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-lg flex items-center justify-center mr-2.5">
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
                  <div className="text-sm font-medium text-rose-900">
                    {todayStatus.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--:--'}
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center mr-2.5">
                    <FiClock className="h-3 w-3 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {todayStatus.CheckInTime && !todayStatus.CheckOutTime ? 'Live Hours' : 'Total Hours'}
                    </span>
                    {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
                      <span className="inline-flex items-center ml-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse mr-1"></div>
                        <span className="text-xs text-purple-600">Live</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-900">
                    {todayStatus.WorkingHours ? timeUtils.formatWorkingHours(todayStatus.WorkingHours) : '0h 0m'}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Timer Banner */}
            {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2.5 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs font-medium text-blue-700">Time since check-in</span>
                  </div>
                  <div className="text-sm font-medium text-blue-900">
                    {todayStatus.WorkingHours ? timeUtils.formatWorkingHours(todayStatus.WorkingHours) : '0h 0m'}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center pt-1">
              {!userLocation || !userLocation.hasCoordinates ? (
                <div className="w-full flex items-center text-amber-700 bg-amber-100 py-2.5 rounded-lg border border-amber-200 font-medium justify-center">
                  <AlertTriangle className="mr-2 text-amber-600 h-4 w-4" />
                  <span className="text-sm">Location required</span>
                </div>
              ) : !todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkInLoading || gettingLocation}
                  className="w-full min-h-[44px] bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 rounded-lg hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.98] flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-70"
                >
                  <FiCheckCircle className="mr-2 h-4 w-4" />
                  {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying...' : 'Check In Now'}
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkOutLoading || gettingLocation}
                  className="w-full min-h-[44px] bg-gradient-to-r from-rose-600 to-rose-700 text-white py-2.5 rounded-lg hover:from-rose-700 hover:to-rose-800 active:scale-[0.98] flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-70"
                >
                  <FiXCircle className="mr-2 h-4 w-4" />
                  {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying...' : 'Check Out Now'}
                </button>
              ) : (
                <div className="w-full flex items-center text-emerald-700 bg-emerald-50 py-2.5 rounded-lg border border-emerald-200 font-medium justify-center">
                  <CheckCircle className="mr-2 text-emerald-600 h-4 w-4" />
                  <span className="text-sm">Completed for today</span>
                </div>
              )}
            </div>
          </>
        ) : (
          /* No Attendance Today */
          <div className="text-center py-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FiClock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1 text-sm">No attendance today</p>
            <p className="text-xs text-gray-400 mb-3">Start your day by checking in</p>
            {!userLocation || !userLocation.hasCoordinates ? (
              <div className="w-full flex items-center text-amber-700 bg-amber-100 py-2.5 rounded-lg border border-amber-200 font-medium justify-center">
                <AlertTriangle className="mr-2 text-amber-600 h-4 w-4" />
                <span className="text-sm">Location required</span>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading || gettingLocation}
                className="w-full min-h-[44px] bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 rounded-lg hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.98] flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-70"
              >
                <FiCheckCircle className="mr-2 h-4 w-4" />
                {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying...' : 'Check In Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAttendanceStatus;