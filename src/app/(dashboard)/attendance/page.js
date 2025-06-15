// src/app/(dashboard)/attendance/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceAPI } from '@/app/lib/api';
import { FiClock, FiMapPin, FiCalendar, FiDownload } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchAttendanceData();
  }, [user, dateRange]);

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
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckInLoading(true);
      
      // Get user's current location (in production, implement proper geolocation)
      const response = await attendanceAPI.checkIn({
        employeeId: user.employeeId,
        locationId: user.locationId || 1,
        latitude: 0, // In production, get actual location
        longitude: 0,
        deviceId: 1, // Web device
        remarks: 'Web check-in'
      });

      if (response.data.success) {
        toast.success('Checked in successfully!');
        fetchAttendanceData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check in');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setCheckOutLoading(true);
      
      const response = await attendanceAPI.checkOut({
        employeeId: user.employeeId,
        locationId: user.locationId || 1,
        latitude: 0,
        longitude: 0,
        deviceId: 1,
        remarks: 'Web check-out'
      });

      if (response.data.success) {
        toast.success('Checked out successfully!');
        fetchAttendanceData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check out');
    } finally {
      setCheckOutLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'text-green-600 bg-green-100';
      case 'Absent': return 'text-red-600 bg-red-100';
      case 'Late': return 'text-yellow-600 bg-yellow-100';
      case 'OnLeave': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance Management</h1>
        <p className="mt-2 text-sm text-gray-700">
          Mark your attendance and view your attendance history
        </p>
      </div>

      {/* Today's Status Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Today's Attendance</h2>
          <span className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">Status</div>
            {!todayStatus || !todayStatus.CheckInTime ? (
              <div className="text-2xl font-semibold text-gray-400">Not Marked</div>
            ) : (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                todayStatus.Status === 'Checked In' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {todayStatus.Status}
              </div>
            )}
          </div>

          {/* Check In Time */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">Check In</div>
            <div className="text-2xl font-semibold">
              {todayStatus?.CheckInTime 
                ? format(new Date(todayStatus.CheckInTime), 'hh:mm a')
                : '--:--'
              }
            </div>
          </div>

          {/* Check Out Time */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">Check Out</div>
            <div className="text-2xl font-semibold">
              {todayStatus?.CheckOutTime 
                ? format(new Date(todayStatus.CheckOutTime), 'hh:mm a')
                : '--:--'
              }
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          {!todayStatus || !todayStatus.CheckInTime ? (
            <button
              onClick={handleCheckIn}
              disabled={checkInLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
            >
              <FiClock className="mr-2" />
              {checkInLoading ? 'Checking In...' : 'Check In'}
            </button>
          ) : !todayStatus.CheckOutTime ? (
            <button
              onClick={handleCheckOut}
              disabled={checkOutLoading}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center disabled:opacity-50"
            >
              <FiClock className="mr-2" />
              {checkOutLoading ? 'Checking Out...' : 'Check Out'}
            </button>
          ) : (
            <div className="text-green-600 font-medium">
              ✓ Attendance completed for today
            </div>
          )}
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Attendance History</h2>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button className="text-blue-600 hover:text-blue-700">
                <FiDownload className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.AttendanceID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.AttendanceDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.CheckInTime 
                      ? format(new Date(record.CheckInTime), 'hh:mm a')
                      : '--'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.CheckOutTime 
                      ? format(new Date(record.CheckOutTime), 'hh:mm a')
                      : '--'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.WorkingHours || '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.AttendanceStatus)}`}>
                      {record.AttendanceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}