// src/app/(dashboard)/attendance/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceAPI } from '@/app/lib/api';
import { FiClock, FiMapPin, FiCalendar, FiDownload, FiCheckCircle, FiUser } from 'react-icons/fi';
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
      case 'Present': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'Absent': return 'text-red-700 bg-red-100 border-red-200';
      case 'Late': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'OnLeave': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

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
            Mark your attendance and view your attendance history
          </p>
        </div>

        {/* Today's Status Card */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Status */}
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

              {/* Check In Time */}
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="text-sm text-emerald-700 mb-3 font-medium">Check In</div>
                <div className="text-2xl font-bold text-emerald-900">
                  {todayStatus?.CheckInTime 
                    ? format(new Date(todayStatus.CheckInTime), 'hh:mm a')
                    : '--:--'
                  }
                </div>
              </div>

              {/* Check Out Time */}
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
              {!todayStatus || !todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkInLoading}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-lg"
                >
                  <FiClock className="mr-3" />
                  {checkInLoading ? 'Checking In...' : 'Check In'}
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkOutLoading}
                  className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-xl hover:from-rose-700 hover:to-rose-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-lg"
                >
                  <FiClock className="mr-3" />
                  {checkOutLoading ? 'Checking Out...' : 'Check Out'}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Working Hours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record, index) => (
                  <tr key={record.AttendanceID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {format(new Date(record.AttendanceDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.CheckInTime 
                        ? format(new Date(record.CheckInTime), 'hh:mm a')
                        : '--'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.CheckOutTime 
                        ? format(new Date(record.CheckOutTime), 'hh:mm a')
                        : '--'
                      }
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
          </div>
        </div>
      </div>
    </div>
  );
}