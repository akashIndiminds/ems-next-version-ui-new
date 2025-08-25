// src/components/dashboard/mobile/MobileAttendanceMarking.js
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Clock, CheckCircle, AlertTriangle, MapPin, Zap } from 'lucide-react';

const MobileAttendanceMarking = ({
  todayStatus,
  userLocation,
  timeUtils,
  handleCheckIn,
  handleCheckOut,
  getLiveWorkingHours,
  checkInLoading,
  checkOutLoading,
  gettingLocation
}) => {
  const liveWorkingHours = getLiveWorkingHours();

  const getStatusInfo = () => {
    if (todayStatus?.CheckInTime && !todayStatus?.CheckOutTime) {
      return { text: 'Working', color: 'emerald', pulse: true };
    } else if (todayStatus?.CheckOutTime) {
      return { text: 'Completed', color: 'blue', pulse: false };
    }
    return { text: 'Not Started', color: 'orange', pulse: false };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 md:hidden overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 bg-${statusInfo.color}-500 ${statusInfo.pulse ? 'animate-pulse' : ''}`} />
            <h2 className="text-sm font-semibold text-gray-900">{statusInfo.text}</h2>
          </div>
          <span className="text-xs text-gray-500">{timeUtils.formatTimeUTC(new Date().toISOString())}</span>
        </div>

        {/* Location */}
        {userLocation && (
          <div className="flex items-center text-xs text-gray-600 mt-1">
            <MapPin className="h-3 w-3 mr-1 text-blue-500" />
            <span className="truncate">{userLocation.locationName || 'Assigned Location'}</span>
            {!userLocation.hasCoordinates && <AlertTriangle className="h-3 w-3 ml-1 text-amber-500" />}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Working Hours - Prominent */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-xs font-medium text-indigo-700">
                {liveWorkingHours ? 'Live Hours' : 'Total Hours'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-indigo-900">
                {liveWorkingHours
                  ? timeUtils.formatWorkingHours(liveWorkingHours)
                  : todayStatus?.WorkingHours
                  ? timeUtils.formatWorkingHours(todayStatus.WorkingHours)
                  : '0h 0m'}
              </div>
              {todayStatus?.RequiredHours && (
                <div className="text-xs text-indigo-600">/ {todayStatus.RequiredHours}h</div>
              )}
            </div>
          </div>

          {todayStatus?.RequiredHours && (
            <div className="mt-2 bg-indigo-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    ((liveWorkingHours || todayStatus?.WorkingHours || 0) /
                      todayStatus.RequiredHours) *
                      100
                  )}%`
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Time Cards */}
        <div className="flex gap-2">
          {/* Check In */}
          <div className={`flex-1 p-3 rounded-2xl ${
            todayStatus?.CheckInTime ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center mb-1">
              <FiCheckCircle className={`h-4 w-4 mr-1 ${todayStatus?.CheckInTime ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span className="text-xs font-medium text-gray-600">Check-in</span>
            </div>
            <div className={`text-lg font-bold ${todayStatus?.CheckInTime ? 'text-emerald-900' : 'text-gray-400'}`}>
              {todayStatus?.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--:--'}
            </div>
            {todayStatus?.CheckInTime && todayStatus?.IsLate && (
              <div className="text-xs text-orange-600 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {todayStatus.LateMinutes}m late
              </div>
            )}
          </div>

          {/* Check Out */}
          <div className={`flex-1 p-3 rounded-2xl ${
            todayStatus?.CheckOutTime ? 'bg-purple-50 border border-purple-200'
              : todayStatus?.CheckInTime ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center mb-1">
              <FiXCircle className={`h-4 w-4 mr-1 ${todayStatus?.CheckOutTime ? 'text-purple-600' : todayStatus?.CheckInTime ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="text-xs font-medium text-gray-600">Check-out</span>
            </div>
            <div className={`text-lg font-bold ${todayStatus?.CheckOutTime ? 'text-purple-900' : todayStatus?.CheckInTime ? 'text-blue-900' : 'text-gray-400'}`}>
              {todayStatus?.CheckOutTime
                ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime)
                : todayStatus?.CheckInTime
                ? 'Ready'
                : '--:--'}
            </div>
            {todayStatus?.CheckOutTime && todayStatus?.IsEarlyLeave && (
              <div className="text-xs text-amber-600 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {todayStatus.EarlyLeaveMinutes}m early
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="pt-2">
          {!userLocation?.hasCoordinates ? (
            <div className="w-full flex items-center justify-center text-amber-700 bg-amber-50 py-3 rounded-2xl border-2 border-amber-200 text-sm font-medium">
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
              Location setup required
            </div>
          ) : !todayStatus?.CheckInTime ? (
            <button
              onClick={handleCheckIn}
              disabled={checkInLoading || gettingLocation}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-2xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center font-semibold disabled:opacity-70"
            >
              <FiCheckCircle className="mr-2 h-5 w-5" />
              {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In Now'}
            </button>
          ) : !todayStatus?.CheckOutTime ? (
            <button
              onClick={handleCheckOut}
              disabled={checkOutLoading || gettingLocation}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3.5 rounded-2xl shadow-lg hover:from-rose-600 hover:to-rose-700 active:scale-[0.98] transition-all flex items-center justify-center font-semibold disabled:opacity-70"
            >
              <FiXCircle className="mr-2 h-5 w-5" />
              {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying Location...' : 'Check Out Now'}
            </button>
          ) : (
            <div className="w-full flex items-center justify-center text-emerald-700 bg-emerald-50 py-3 rounded-2xl border-2 border-emerald-200 text-sm font-medium">
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
              Day completed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileAttendanceMarking;
