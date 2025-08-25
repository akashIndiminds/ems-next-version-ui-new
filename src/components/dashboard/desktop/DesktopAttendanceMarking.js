import { Clock, CheckCircle, XCircle, MapPin, Activity, AlertTriangle, Calendar } from 'lucide-react';

const DesktopAttendanceMarking = ({ 
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

  // Get attendance status
  const getAttendanceStatus = () => {
    if (!todayStatus) return { text: 'Not Marked', color: 'text-gray-500', bg: 'bg-gray-100', dot: 'bg-gray-400' };
    if (todayStatus.CheckInTime && !todayStatus.CheckOutTime) {
      return { text: 'Present', color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-400 animate-pulse' };
    }
    if (todayStatus.CheckInTime && todayStatus.CheckOutTime) {
      return { text: 'Completed', color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-400' };
    }
    return { text: 'Absent', color: 'text-red-700', bg: 'bg-red-100', dot: 'bg-red-400' };
  };

  const status = getAttendanceStatus();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Compact Header with Location */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-500 rounded-lg mr-2">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-medium text-gray-900">Today's Attendance</h2>
              {userLocation && (
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-32">
                    {userLocation.locationName || 'Location not set'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <Calendar className="mr-1 h-3 w-3" />
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center">
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`}></div>
              <span className={`text-xs font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {todayStatus ? (
          <div className="space-y-3">
            {/* Compact Status Cards - 4 columns */}
            <div className="grid grid-cols-4 gap-2">
              {/* Check In */}
              <div className={`p-2 rounded-lg border transition-colors ${
                todayStatus.CheckInTime 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center mb-1">
                  <CheckCircle className={`h-3 w-3 mr-1 ${
                    todayStatus.CheckInTime ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="text-xs font-medium text-gray-600">Check-in</span>
                </div>
                <div className={`text-sm font-semibold ${
                  todayStatus.CheckInTime ? 'text-green-900' : 'text-gray-400'
                }`}>
                  {todayStatus.CheckInTime 
                    ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) 
                    : '--:--'
                  }
                </div>
                {todayStatus.CheckInTime && todayStatus.IsLate && (
                  <div className="text-xs text-orange-600 mt-0.5">
                    +{todayStatus.LateMinutes}m
                  </div>
                )}
              </div>
              
              {/* Check Out */}
              <div className={`p-2 rounded-lg border transition-colors ${
                todayStatus.CheckOutTime 
                  ? 'bg-purple-50 border-purple-200' 
                  : todayStatus.CheckInTime 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center mb-1">
                  <XCircle className={`h-3 w-3 mr-1 ${
                    todayStatus.CheckOutTime 
                      ? 'text-purple-600' 
                      : todayStatus.CheckInTime 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                  }`} />
                  <span className="text-xs font-medium text-gray-600">Check-out</span>
                </div>
                <div className={`text-sm font-semibold ${
                  todayStatus.CheckOutTime 
                    ? 'text-purple-900' 
                    : todayStatus.CheckInTime 
                      ? 'text-blue-900' 
                      : 'text-gray-400'
                }`}>
                  {todayStatus.CheckOutTime 
                    ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) 
                    : todayStatus.CheckInTime 
                      ? 'Ready' 
                      : '--:--'
                  }
                </div>
                {todayStatus.CheckOutTime && todayStatus.IsEarlyLeave && (
                  <div className="text-xs text-amber-600 mt-0.5">
                    -{todayStatus.EarlyLeaveMinutes}m
                  </div>
                )}
              </div>
              
              {/* Working Hours */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                <div className="flex items-center mb-1">
                  <Activity className="h-3 w-3 text-indigo-600 mr-1" />
                  <span className="text-xs font-medium text-gray-600">Hours</span>
                  {liveWorkingHours && (
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse ml-auto"></div>
                  )}
                </div>
                <div className="text-sm font-semibold text-indigo-900">
                  {liveWorkingHours 
                    ? timeUtils.formatWorkingHours(liveWorkingHours)
                    : todayStatus.WorkingHours 
                      ? timeUtils.formatWorkingHours(todayStatus.WorkingHours)
                      : '0h 0m'
                  }
                </div>
                {todayStatus.RequiredHours && (
                  <div className="text-xs text-indigo-600 mt-0.5">
                    /{todayStatus.RequiredHours}h
                  </div>
                )}
              </div>

              {/* Status */}
              <div className={`p-2 rounded-lg border ${status.bg.replace('100', '50')} border-${status.color.split('-')[1]}-200`}>
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 rounded-full mr-1 ${status.dot.split(' ')[0]}`}></div>
                  <span className="text-xs font-medium text-gray-600">Status</span>
                </div>
                <div className={`text-sm font-semibold ${status.color}`}>
                  {status.text}
                </div>
                {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
                  <div className="text-xs text-green-600 mt-0.5">
                    Active
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            {todayStatus.RequiredHours && (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Daily Progress</span>
                  <span className="text-xs font-medium text-gray-700">
                    {Math.round(((liveWorkingHours || todayStatus.WorkingHours || 0) / todayStatus.RequiredHours) * 100)}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-indigo-500 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, ((liveWorkingHours || todayStatus.WorkingHours || 0) / todayStatus.RequiredHours) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Current Status Alert */}
            {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-1 bg-blue-500 rounded mr-2">
                      <Activity className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-900">Currently Working</span>
                      <div className="text-xs text-blue-600">
                        Since {timeUtils.formatTimeUTC(todayStatus.CheckInTime)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-900">
                      {liveWorkingHours 
                        ? timeUtils.formatWorkingHours(liveWorkingHours)
                        : timeUtils.calculateWorkingHours(todayStatus.CheckInTime, currentTime.toISOString())
                      }
                    </div>
                    <div className="flex items-center text-xs text-blue-600">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse mr-1"></div>
                      Live
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center pt-1">
              {!userLocation || !userLocation.hasCoordinates ? (
                <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Location setup required
                </div>
              ) : !todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkInLoading || gettingLocation}
                  className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {checkInLoading 
                    ? 'Checking In...' 
                    : gettingLocation 
                      ? 'Verifying...' 
                      : 'Check In'
                  }
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkOutLoading || gettingLocation}
                  className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <XCircle className="w-4 w-4 mr-2" />
                  {checkOutLoading 
                    ? 'Checking Out...' 
                    : gettingLocation 
                      ? 'Verifying...' 
                      : 'Check Out'
                  }
                </button>
              ) : (
                <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed for today
                </div>
              )}
            </div>
          </div>
        ) : (
          /* No Attendance Today */
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Ready to start?</h3>
            <p className="text-sm text-gray-600 mb-4">Mark your attendance to begin tracking</p>
            
            {!userLocation || !userLocation.hasCoordinates ? (
              <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Location setup required
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading || gettingLocation}
                className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {checkInLoading 
                  ? 'Checking In...' 
                  : gettingLocation 
                    ? 'Verifying...' 
                    : 'Check In Now'
                }
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopAttendanceMarking;