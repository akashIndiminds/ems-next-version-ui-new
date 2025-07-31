// src/app/(dashboard)/attendance/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceAPI } from '@/app/lib/api';
import { FiClock, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { locationAPI } from '@/app/lib/api/locationAPI';
import timeUtils from '@/app/lib/utils/timeUtils';
import MobileTodayStatus from '@/components/attendanceComponent/MobileTodayStatus';
import DesktopTodayStatus from '@/components/attendanceComponent/DesktopTodayStatus';
import MobileAttendanceHistory from '@/components/attendanceComponent/MobileAttendanceHistory';
import DesktopAttendanceHistory from '@/components/attendanceComponent/DesktopAttendanceHistory';

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
        deviceId: 5,
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
      <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Compact Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-gray-900">Attendance</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchAttendanceData}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <FiDownload className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Track attendance with location verification</p>
          
          {/* Mobile Status Bar */}
          <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mt-3">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Location enabled</span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
              Live
            </span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:gap-6 lg:items-start">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Attendance
              </h1>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl">
                Track your attendance with location verification
              </p>
              
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 mt-3">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Location enabled
                </span>
                <span className="text-gray-300">•</span>
                <span>Last updated: just now</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-2 lg:flex-col xl:flex-row">
              <button
                onClick={fetchAttendanceData}
                disabled={loading}
                className="group flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 
                           bg-white border border-gray-300 text-gray-700 font-medium text-sm md:text-base
                           rounded-xl hover:bg-gray-50 hover:border-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-sm hover:shadow-md
                           min-h-[44px] lg:min-w-[120px]"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
                <span className="sm:hidden">{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              <button className="group flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3
                                 bg-blue-600 text-white font-medium text-sm md:text-base
                                 rounded-xl hover:bg-blue-700 active:bg-blue-800
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                 transition-all duration-200 shadow-lg hover:shadow-xl
                                 min-h-[44px] lg:min-w-[120px]"
              >
                <FiDownload className="h-4 w-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </button>

              <button className="hidden xl:flex items-center justify-center gap-2 px-4 py-2.5
                                 bg-gray-100 text-gray-600 font-medium text-sm
                                 rounded-xl hover:bg-gray-200 hover:text-gray-700
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                                 transition-all duration-200
                                 min-h-[44px] min-w-[100px]"
              >
                <FiClock className="h-4 w-4" />
                <span>History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Status Components */}
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

        <DesktopTodayStatus 
          todayStatus={todayStatus}
          userLocation={userLocation}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          checkInLoading={checkInLoading}
          checkOutLoading={checkOutLoading}
          gettingLocation={gettingLocation}
          timeUtils={timeUtils}
        />

        {/* Attendance History Components */}
        <MobileAttendanceHistory 
          attendanceRecords={attendanceRecords}
          dateRange={dateRange}
          setDateRange={setDateRange}
          timeUtils={timeUtils}
          getStatusColor={getStatusColor}
        />

        <DesktopAttendanceHistory 
          attendanceRecords={attendanceRecords}
          dateRange={dateRange}
          setDateRange={setDateRange}
          timeUtils={timeUtils}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  );
}