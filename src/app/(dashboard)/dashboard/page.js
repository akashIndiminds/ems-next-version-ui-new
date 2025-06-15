// src/app/(dashboard)/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { companyAPI, attendanceAPI } from '@/app/lib/api';
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const StatsCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Only fetch data once when component mounts and user is available
    if (user && !loading) {
      fetchDashboardData();
    }
  }, []); // Empty dependency array to run only once on mount

  // Separate effect to handle user changes
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Use user data directly from AuthContext
      // Ensure employeeId is a single value, not an array
      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }
      
      // Ensure companyId is a single value
      let companyId = user.company?.companyId;
      if (Array.isArray(companyId)) {
        companyId = companyId[0];
      }

      // Fetch company dashboard stats if admin
      if (user.role === 'admin' && companyId) {
        try {
          const response = await companyAPI.getDashboard(companyId);
          if (response.data.success) {
            setStats(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching company dashboard:', error);
          // Don't show error toast for company stats, just log it
        }
      }

      // Fetch today's attendance status
      if (employeeId) {
        try {
          const todayResponse = await attendanceAPI.getTodayStatus(employeeId);
          if (todayResponse.data.success) {
            setTodayStatus(todayResponse.data.data);
          }
        } catch (error) {
          console.error('Error fetching today status:', error);
          // Don't show error toast for attendance status, just log it
        }
      }

      // Mock chart data (in real app, fetch from API)
      setChartData([
        { name: 'Mon', present: 85, absent: 15 },
        { name: 'Tue', present: 88, absent: 12 },
        { name: 'Wed', present: 92, absent: 8 },
        { name: 'Thu', present: 87, absent: 13 },
        { name: 'Fri', present: 90, absent: 10 },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handleCheckIn = async () => {
    try {
      // Use user data directly from AuthContext
      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }

      const response = await attendanceAPI.checkIn({
        employeeId: employeeId,
        locationId: user.locationId || 1,
        remarks: 'Check-in from dashboard'
      });

      if (response.data.success) {
        toast.success('Checked in successfully!');
        fetchDashboardData(true); // Refresh data
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      // Use user data directly from AuthContext
      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }

      const response = await attendanceAPI.checkOut({
        employeeId: employeeId,
        locationId: user.locationId || 1,
        remarks: 'Check-out from dashboard'
      });

      if (response.data.success) {
        toast.success('Checked out successfully!');
        fetchDashboardData(true); // Refresh data
      }
    } catch (error) {
      console.error('Check-out error:', error);
      toast.error(error.response?.data?.message || 'Failed to check out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading user data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back, {user.fullName}! Here's what's happening today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          {!todayStatus || !todayStatus.CheckInTime ? (
            <button
              onClick={handleCheckIn}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            >
              <FiClock className="mr-2" />
              Check In
            </button>
          ) : !todayStatus.CheckOutTime ? (
            <button
              onClick={handleCheckOut}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
            >
              <FiClock className="mr-2" />
              Check Out
            </button>
          ) : (
            <div className="text-green-600 flex items-center">
              <FiClock className="mr-2" />
              Attendance marked for today
            </div>
          )}
        </div>
        
        {todayStatus && todayStatus.CheckInTime && (
          <div className="mt-4 text-sm text-gray-600">
            <p>Check-in: {new Date(todayStatus.CheckInTime).toLocaleTimeString()}</p>
            {todayStatus.CheckOutTime && (
              <p>Check-out: {new Date(todayStatus.CheckOutTime).toLocaleTimeString()}</p>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid - Only for Admin/Manager */}
      {(user.role === 'admin' || user.role === 'manager') && stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Employees"
            value={stats.ActiveEmployees || 0}
            icon={FiUsers}
          />
          <StatsCard
            title="Present Today"
            value={stats.TodayAttendance || 0}
            icon={FiClock}
            change="+12%"
            changeType="increase"
          />
          <StatsCard
            title="Pending Leaves"
            value={stats.PendingLeaves || 0}
            icon={FiCalendar}
          />
          <StatsCard
            title="Departments"
            value={stats.TotalDepartments || 0}
            icon={FiTrendingUp}
          />
        </div>
      )}

      {/* Attendance Chart - Only for Admin/Manager */}
      {(user.role === 'admin' || user.role === 'manager') && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Attendance Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10B981" name="Present" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
            <p className="text-gray-600">You checked in at 9:15 AM today</p>
          </div>
          <div className="flex items-center text-sm">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <p className="text-gray-600">Leave request approved for Dec 25-26</p>
          </div>
          <div className="flex items-center text-sm">
            <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
            <p className="text-gray-600">New company policy updated</p>
          </div>
        </div>
      </div>
    </div>
  );
}