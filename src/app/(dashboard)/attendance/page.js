// src/app/(dashboard)/attendance/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceAPI } from '@/app/lib/api';
import { FiClock, FiMapPin, FiCalendar, FiDownload, FiCheckCircle, FiUser, FiTarget, FiXCircle, FiAlertTriangle, FiNavigation, FiRefreshCw, FiPlay, FiPause, FiTrendingUp, FiChevronRight } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { locationAPI } from '@/app/lib/api/locationAPI';
import timeUtils from '@/app/lib/utils/timeUtils';
import MobileTodayStatus from '@/components/attendanceComponent/MobileTodayStatus';
import DesktopTodayStatus from '@/components/attendanceComponent/DesktopTodayStatus';

export default function AttendancePage() {
  const { user } = useAuth();

  const [todayStatus, setTodayStatus] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationValidation, setLocationValidation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  const userLocation = user?.assignedLocation;

  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user, dateRange]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      const todayResponse = await attendanceAPI.getTodayStatus(user.employeeId);
      if (todayResponse.data.success) {
        setTodayStatus(todayResponse.data.data);
      }

      const recordsResponse = await attendanceAPI.getRecords({
        employeeId: user.employeeId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      });
      if (recordsResponse.data.success) {
        setAttendanceRecords(recordsResponse.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setGettingLocation(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setCurrentLocation(location);
          setGettingLocation(false);
          resolve(location);
        },
        (error) => {
          setGettingLocation(false);
          let message = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out.';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  const validateLocation = async () => {
    try {
      if (!userLocation) {
        toast.error('No location assigned to your account');
        return null;
      }

      if (!userLocation.hasCoordinates) {
        toast.error('Your assigned location needs coordinate setup');
        return null;
      }

      const position = await getCurrentLocation();

      const response = await locationAPI.validateLocation(
        userLocation.locationId,
        position.latitude,
        position.longitude,
        user.employeeId
      );

      console.log('🔍 Location validation response:', response.data);
      setLocationValidation(response.data);

      if (response.data.success) {
        toast.success(`✅ Location verified! Distance: ${response.data.data.distance}m from ${response.data.data.locationName}`);
        return position;
      } else {
        toast.error(`❌ ${response.data.message}`);
        return null;
      }
    } catch (error) {
      console.error('❌ Location validation error:', error);
      toast.error(error.message);
      return null;
    }
  };

  const testLocation = async () => {
    await validateLocation();
  };

  const handleCheckIn = async () => {
    try {
      setCheckInLoading(true);

      const position = await validateLocation();
      if (!position) {
        return;
      }

      const response = await attendanceAPI.checkIn({
        employeeId: user.employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceId: 1,
        remarks: 'Web check-in with location validation',
      });

      if (response.data.success) {
        toast.success('✅ Checked in successfully!');
        fetchAttendanceData();
      }
    } catch (error) {
      console.error('❌ Check-in error:', error);
      toast.error(error.response?.data?.message || 'Failed to check in');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setCheckOutLoading(true);

      const position = await validateLocation();
      if (!position) {
        return;
      }

      const response = await attendanceAPI.checkOut({
        employeeId: user.employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceId: 1,
        remarks: 'Web check-out with location validation',
      });

      if (response.data.success) {
        toast.success('✅ Checked out successfully!');
        fetchAttendanceData();
      }
    } catch (error) {
      console.error('❌ Check-out error:', error);
      toast.error(error.response?.data?.message || 'Failed to check out');
    } finally {
      setCheckOutLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'Absent':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'Late':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'OnLeave':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Attendance
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track your attendance with location verification
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={fetchAttendanceData}
              disabled={loading}
              className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 font-medium disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 flex items-center justify-center transition-colors duration-200 shadow-lg font-medium">
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Today's Status */}
      {/* Today's Status - Mobile Version */}
<MobileTodayStatus 
  todayStatus={todayStatus}
  userLocation={userLocation}
  handleCheckIn={handleCheckIn}
  handleCheckOut={handleCheckOut}
  checkInLoading={checkInLoading}
  checkOutLoading={checkOutLoading}
  gettingLocation={gettingLocation}
  timeUtils={timeUtils}
/>

{/* Today's Status - Desktop Version */}
<DesktopTodayStatus 
  todayStatus={todayStatus}
  userLocation={userLocation}
  handleCheckIn={handleCheckIn}
  handleCheckOut={handleCheckOut}
  checkInLoading={checkInLoading}
  checkOutLoading={checkOutLoading}
  gettingLocation={gettingLocation}
  timeUtils={timeUtils}
  FiTarget={FiTarget}
  FiPlay={FiPlay}
  FiPause={FiPause}
  FiClock={FiClock}
  FiTrendingUp={FiTrendingUp}
  FiChevronRight={FiChevronRight}
  FiAlertTriangle={FiAlertTriangle}
  FiCheckCircle={FiCheckCircle}
/>

        {/* Attendance History */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiCalendar className="mr-3 text-blue-600" />
                Recent History ({attendanceRecords.length})
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <input
                    type="date"
                    value={dateRange.fromDate}
                    onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500 font-medium">to</span>
                  <input
                    type="date"
                    value={dateRange.toDate}
                    onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.slice(0, 10).map((record, index) => (
                  <tr key={record.AttendanceID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {format(new Date(record.AttendanceDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.CheckInTime ? timeUtils.formatTimeUTC(record.CheckInTime) : '--'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.CheckOutTime ? timeUtils.formatTimeUTC(record.CheckOutTime) : '--'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                     {todayStatus?.WorkingHours ? timeUtils.formatWorkingHours(todayStatus.WorkingHours) : '0h 0m'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.AttendanceStatus)}`}>
                        {record.AttendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {attendanceRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <div className="text-gray-400 mb-2">📋</div>
                      <div>No attendance records found</div>
                      <div className="text-sm text-gray-400">Your attendance history will appear here</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}