// src/app/(dashboard)/attendance/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceAPI } from '@/app/lib/api';
import { FiClock, FiMapPin, FiCalendar, FiDownload, FiCheckCircle, FiUser, FiTarget, FiXCircle, FiAlertTriangle, FiNavigation } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { locationAPI } from '@/app/lib/api/locationAPI';
export default function AttendancePage() {
  const { user } = useAuth();
  
  // State for attendance data
  const [todayStatus, setTodayStatus] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for location and validation
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationValidation, setLocationValidation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // State for check-in/out operations
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  
  // Date range for history
  const [dateRange, setDateRange] = useState({
    fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  // User's assigned location from AuthContext
  const userLocation = user?.assignedLocation;

  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user, dateRange]);

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      // Fetch today's status
      const todayResponse = await attendanceAPI.getTodayStatus(user.employeeId);
      if (todayResponse.data.success) {
        setTodayStatus(todayResponse.data.data);
      }

      // Fetch attendance records
      const recordsResponse = await attendanceAPI.getRecords({
        employeeId: user.employeeId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate
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

  // Get current location with high accuracy
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
            accuracy: position.coords.accuracy
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
          maximumAge: 0
        }
      );
    });
  };

  // Validate current location against assigned location
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

      // Get current position
      const position = await getCurrentLocation();
      
      // Validate with backend
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

  // Test location without marking attendance
  const testLocation = async () => {
    await validateLocation();
  };

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      setCheckInLoading(true);

      // Validate location first
      const position = await validateLocation();
      if (!position) {
        return;
      }

      // Proceed with check-in
      const response = await attendanceAPI.checkIn({
        employeeId: user.employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceId: 1,
        remarks: 'Web check-in with location validation'
      });

      if (response.data.success) {
        toast.success('✅ Checked in successfully!');
        fetchAttendanceData(); // Refresh data
      }
    } catch (error) {
      console.error('❌ Check-in error:', error);
      toast.error(error.response?.data?.message || 'Failed to check in');
    } finally {
      setCheckInLoading(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      setCheckOutLoading(true);

      // Validate location first
      const position = await validateLocation();
      if (!position) {
        return;
      }

      // Proceed with check-out
      const response = await attendanceAPI.checkOut({
        employeeId: user.employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceId: 1,
        remarks: 'Web check-out with location validation'
      });

      if (response.data.success) {
        toast.success('✅ Checked out successfully!');
        fetchAttendanceData(); // Refresh data
      }
    } catch (error) {
      console.error('❌ Check-out error:', error);
      toast.error(error.response?.data?.message || 'Failed to check out');
    } finally {
      setCheckOutLoading(false);
    }
  };

  // Get status color for attendance records
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'Absent': return 'text-red-700 bg-red-100 border-red-200';
      case 'Late': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'OnLeave': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Attendance Management
          </h1>
          <p className="mt-2 text-gray-600">
            Mark your attendance with location verification
          </p>
        </div>

        {/* Location Status Card */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiMapPin className="mr-3 text-green-600" />
              Location Status
            </h2>
          </div>
          
          <div className="p-6">
            {userLocation ? (
              <div className="space-y-6">
                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-900 text-lg">{userLocation.locationName}</h3>
                    <p className="text-blue-700 text-sm mt-1">Code: {userLocation.locationCode}</p>
                    <p className="text-blue-600 text-xs mt-2">{userLocation.address}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-900">Coordinates</h4>
                    <p className="text-purple-700 text-sm mt-1">
                      {userLocation.hasCoordinates ? (
                        `${userLocation.latitude?.toFixed(6)}, ${userLocation.longitude?.toFixed(6)}`
                      ) : (
                        'Not configured'
                      )}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-900">Allowed Radius</h4>
                    <p className="text-orange-700 text-2xl font-bold mt-1">{userLocation.allowedRadius || 100}m</p>
                  </div>
                </div>

                {/* Location Test Button */}
                <div className="text-center">
                  <button
                    onClick={testLocation}
                    disabled={gettingLocation || !userLocation.hasCoordinates}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 flex items-center mx-auto transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium"
                  >
                    <FiTarget className="mr-2" />
                    {gettingLocation ? 'Getting Location...' : 'Test My Location'}
                  </button>
                </div>

                {/* Location Validation Result */}
                {locationValidation && (
                  <div className={`p-4 rounded-xl border-2 ${
                    locationValidation.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      {locationValidation.success ? (
                        <FiCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <FiXCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <h4 className={`font-semibold ${
                        locationValidation.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        Location Validation
                      </h4>
                    </div>
                    <p className={`text-sm ${
                      locationValidation.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {locationValidation.message}
                    </p>
                    {locationValidation.data && (
                      <div className="mt-3 text-sm">
                        <p className="text-gray-600">
                          Distance: <span className="font-semibold">{locationValidation.data.distance}m</span>
                          {' '}(Allowed: {locationValidation.data.allowedRadius}m)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Location Display */}
                {currentLocation && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FiNavigation className="mr-2 text-gray-600" />
                      Your Current Location
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="font-medium text-gray-900">Latitude</p>
                        <p className="text-gray-600 font-mono">{currentLocation.latitude.toFixed(6)}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="font-medium text-gray-900">Longitude</p>
                        <p className="text-gray-600 font-mono">{currentLocation.longitude.toFixed(6)}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="font-medium text-gray-900">Accuracy</p>
                        <p className="text-gray-600">±{Math.round(currentLocation.accuracy)}m</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* No Location Assigned */
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center">
                  <FiAlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="text-yellow-800 font-semibold">No Location Assigned</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Please contact your administrator to assign a location to your account for attendance marking.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today's Attendance Card */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiCalendar className="mr-3 text-blue-600" />
                Today's Attendance
              </h2>
              <span className="text-sm text-gray-600 font-medium bg-white px-3 py-1 rounded-lg">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Status Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-600 mb-3 font-medium">Current Status</div>
                {!todayStatus || !todayStatus.CheckInTime ? (
                  <div className="text-2xl font-bold text-gray-400">Not Marked</div>
                ) : (
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${
                    todayStatus.Status === 'Checked In' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    <FiCheckCircle className="mr-2" />
                    {todayStatus.Status}
                  </div>
                )}
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="text-sm text-emerald-700 mb-3 font-medium">Check In</div>
                <div className="text-2xl font-bold text-emerald-900">
                  {todayStatus?.CheckInTime 
                    ? format(new Date(todayStatus.CheckInTime), 'hh:mm a')
                    : '--:--'
                  }
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
                <div className="text-sm text-rose-700 mb-3 font-medium">Check Out</div>
                <div className="text-2xl font-bold text-rose-900">
                  {todayStatus?.CheckOutTime 
                    ? format(new Date(todayStatus.CheckOutTime), 'hh:mm a')
                    : '--:--'
                  }
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {!userLocation || !userLocation.hasCoordinates ? (
                <div className="flex items-center text-yellow-700 bg-yellow-100 px-8 py-4 rounded-xl border-2 border-yellow-200 font-semibold text-lg">
                  <FiAlertTriangle className="mr-3 text-yellow-600" />
                  {!userLocation ? 'Location assignment required' : 'Location coordinates required'}
                </div>
              ) : !todayStatus || !todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkInLoading || gettingLocation}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-lg"
                >
                  <FiClock className="mr-3" />
                  {checkInLoading ? 'Checking In...' : gettingLocation ? 'Verifying Location...' : 'Check In'}
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkOutLoading || gettingLocation}
                  className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-xl hover:from-rose-700 hover:to-rose-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-lg"
                >
                  <FiClock className="mr-3" />
                  {checkOutLoading ? 'Checking Out...' : gettingLocation ? 'Verifying Location...' : 'Check Out'}
                </button>
              ) : (
                <div className="flex items-center text-emerald-700 bg-emerald-100 px-8 py-4 rounded-xl border-2 border-emerald-200 font-semibold text-lg">
                  <FiCheckCircle className="mr-3 text-emerald-600" />
                  Attendance completed for today
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiUser className="mr-3 text-blue-600" />
                Attendance History
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={dateRange.fromDate}
                    onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
                    className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                  />
                  <span className="text-gray-500 font-medium">to</span>
                  <input
                    type="date"
                    value={dateRange.toDate}
                    onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
                    className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                  <FiDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Working Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record, index) => (
                  <tr key={record.AttendanceID} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {format(new Date(record.AttendanceDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.CheckInTime ? format(new Date(record.CheckInTime), 'hh:mm a') : '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.CheckOutTime ? format(new Date(record.CheckOutTime), 'hh:mm a') : '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.WorkingHours || '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.AttendanceStatus)}`}>
                        {record.AttendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {attendanceRecords.length === 0 && (
              <div className="text-center py-12">
                <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Your attendance history will appear here once you start marking attendance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}