// src/app/(dashboard)/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { companyAPI, attendanceAPI } from '@/app/lib/api';
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const StatsCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
    {/* Subtle gradient accent */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <dt className="text-sm font-medium text-gray-600 mb-2">{title}</dt>
          <dd className="flex items-baseline">
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {change && (
              <div className={`ml-3 flex items-baseline text-sm font-semibold px-2 py-1 rounded-full ${
                changeType === 'increase' 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : 'text-red-700 bg-red-50'
              }`}>
                {change}
              </div>
            )}
          </dd>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
          <Icon className="h-7 w-7 text-blue-600" />
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

  // Main useEffect - runs when user changes or component mounts
  useEffect(() => {
    console.log('useEffect triggered, user:', user); // Debug log
    
    if (user) {
      console.log('User found, fetching data...'); // Debug log
      fetchDashboardData();
    } else {
      console.log('No user found, setting loading false'); // Debug log
      setLoading(false);
    }
  }, [user]); // Add user as dependency

  const handleRefresh = () => {
    if (user) {
      fetchDashboardData(true);
    }
  };

  const handleCheckIn = async () => {
    if (!user) {
      toast.error('User not found');
      return;
    }

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
    if (!user) {
      toast.error('User not found');
      return;
    }

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

  // Show loading state
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

  // Show no user state
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No user data found</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user.fullName}! Here's what's happening today.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium"
          >
            <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              {!todayStatus || !todayStatus.CheckInTime ? (
                <button
                  onClick={handleCheckIn}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <FiClock className="mr-2" />
                  Check In
                </button>
              ) : !todayStatus.CheckOutTime ? (
                <button
                  onClick={handleCheckOut}
                  className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-3 rounded-xl hover:from-rose-700 hover:to-rose-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <FiClock className="mr-2" />
                  Check Out
                </button>
              ) : (
                <div className="flex items-center text-emerald-700 bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-200">
                  <FiClock className="mr-2" />
                  <span className="font-medium">Attendance marked for today</span>
                </div>
              )}
            </div>
            
            {todayStatus && todayStatus.CheckInTime && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Check-in Time</p>
                  <p className="text-blue-900 font-semibold text-lg">
                    {new Date(todayStatus.CheckInTime).toLocaleTimeString()}
                  </p>
                </div>
                {todayStatus.CheckOutTime && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm text-purple-700 font-medium">Check-out Time</p>
                    <p className="text-purple-900 font-semibold text-lg">
                      {new Date(todayStatus.CheckOutTime).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid - Only for Admin/Manager */}
        {(user.role === 'admin' || user.role === 'manager') && stats && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Employees"
              value={stats.ActiveEmployees || 0}
              icon={FiUsers}
              change="+5.2%"
              changeType="increase"
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
              change="-8%"
              changeType="decrease"
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
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Attendance Overview</h2>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="present" 
                      fill="#10b981" 
                      name="Present" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="absent" 
                      fill="#ef4444" 
                      name="Absent" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <p className="text-gray-700 font-medium">You checked in at 9:15 AM today</p>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                <p className="text-gray-700 font-medium">Leave request approved for Dec 25-26</p>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                <div className="flex-shrink-0 w-3 h-3 bg-amber-500 rounded-full mr-4"></div>
                <p className="text-gray-700 font-medium">New company policy updated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}