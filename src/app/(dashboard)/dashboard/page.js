// src/app/(dashboard)/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { companyAPI, attendanceAPI } from '@/app/lib/api';
import timeUtils from '@/app/lib/utils/timeUtils';
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiRefreshCw, FiPlus, FiCheckCircle, FiXCircle, FiEye, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import Link from 'next/link';

const StatsCard = ({ title, value, icon: Icon, change, changeType, href, linkText }) => (
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
          {href && linkText && (
            <div className="mt-3">
              <Link
                href={href}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center group-hover:underline"
              >
                {linkText} →
              </Link>
            </div>
          )}
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for live working hours calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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

  // Calculate live working hours
  const getLiveWorkingHours = () => {
    if (todayStatus?.CheckInTime && !todayStatus?.CheckOutTime) {
      return timeUtils.calculateWorkingHours(
        todayStatus.CheckInTime, 
        currentTime.toISOString()
      );
    }
    return null;
  };

  // Check if user can approve leaves (only admin and manager)
  const canManageLeaves = user?.role === 'admin' || user?.role === 'manager';

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

  const liveWorkingHours = getLiveWorkingHours();

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
            <div className="mt-1 text-sm text-gray-500">
              {timeUtils.formatDateTime(new Date().toISOString())}
            </div>
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

        {/* Today's Attendance Status - Enhanced */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiClock className="mr-3 text-emerald-600" />
              Today's Attendance
            </h2>
          </div>
          <div className="p-6">
            {todayStatus ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <FiCheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-700">Check-in</div>
                    <div className="text-lg font-bold text-green-900">
                      {todayStatus.CheckInTime ? timeUtils.formatTimeUTC(todayStatus.CheckInTime) : '--'}
                    </div>
                    {todayStatus.CheckInTime && (
                      <div className="text-xs text-green-600 mt-1">
                        {timeUtils.formatDateLocale(todayStatus.CheckInTime)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <FiXCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-purple-700">Check-out</div>
                    <div className="text-lg font-bold text-purple-900">
                      {todayStatus.CheckOutTime ? timeUtils.formatTimeUTC(todayStatus.CheckOutTime) : '--'}
                    </div>
                    {todayStatus.CheckOutTime && (
                      <div className="text-xs text-purple-600 mt-1">
                        {timeUtils.formatDateLocale(todayStatus.CheckOutTime)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <FiClock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-blue-700">
                      {liveWorkingHours ? 'Current Working Hours' : 'Total Working Hours'}
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      {todayStatus.CheckInTime && todayStatus.CheckOutTime 
                        ? `${timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h`
                        : liveWorkingHours 
                          ? `${liveWorkingHours}h (Live)`
                          : '--'
                      }
                    </div>
                    {liveWorkingHours && (
                      <div className="text-xs text-blue-600 mt-1 animate-pulse">
                        Live tracking...
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex justify-center space-x-4">
                  {!todayStatus.CheckInTime ? (
                    <button
                      onClick={handleCheckIn}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                      <FiCheckCircle className="mr-2" />
                      Check In Now
                    </button>
                  ) : !todayStatus.CheckOutTime ? (
                    <button
                      onClick={handleCheckOut}
                      className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-3 rounded-xl hover:from-rose-700 hover:to-rose-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                      <FiXCircle className="mr-2" />
                      Check Out Now
                    </button>
                  ) : (
                    <div className="flex items-center text-emerald-700 bg-emerald-50 px-8 py-3 rounded-xl border border-emerald-200">
                      <FiCheckCircle className="mr-2" />
                      <span className="font-medium">Attendance completed for today</span>
                    </div>
                  )}
                </div>

                {/* Time since check-in */}
                {todayStatus.CheckInTime && !todayStatus.CheckOutTime && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-700 mb-1">Time since check-in</div>
                      <div className="text-xl font-bold text-blue-900">
                        {timeUtils.formatTimeDifference(todayStatus.CheckInTime, currentTime.toISOString())}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed day summary */}
                {todayStatus.CheckInTime && todayStatus.CheckOutTime && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-700 mb-2">Today's Summary</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-green-600 font-medium">Session Duration</div>
                          <div className="text-green-900 font-bold">
                            {timeUtils.formatTimeDifference(todayStatus.CheckInTime, todayStatus.CheckOutTime)}
                          </div>
                        </div>
                        <div>
                          <div className="text-green-600 font-medium">Working Hours</div>
                          <div className="text-green-900 font-bold">
                            {timeUtils.calculateWorkingHours(todayStatus.CheckInTime, todayStatus.CheckOutTime)}h
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No attendance recorded for today</p>
                <p className="text-sm text-gray-400 mt-2 mb-6">Start your day by checking in</p>
                <button
                  onClick={handleCheckIn}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center mx-auto transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <FiCheckCircle className="mr-2" />
                  Check In Now
                </button>
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
              href="/employees"
              linkText="View details"
            />
            <StatsCard
              title="Present Today"
              value={stats.TodayAttendance || 0}
              icon={FiClock}
              change="+12%"
              changeType="increase"
              href="/attendanceManagement"
              linkText="View details"
            />
            <StatsCard
              title="Pending Leaves"
              value={stats.PendingLeaves || 0}
              icon={FiCalendar}
              change="-8%"
              changeType="decrease"
              href="/leaves/approved"
              linkText="View details"
            />
            <StatsCard
              title="Departments"
              value={stats.TotalDepartments || 0}
              icon={FiTrendingUp}
              href="/departments"
              linkText="View details"
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
              {todayStatus?.CheckInTime && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                    <div>
                      <p className="text-gray-700 font-medium">You checked in today</p>
                      <p className="text-sm text-green-600">
                        at {timeUtils.formatTimeUTC(todayStatus.CheckInTime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {timeUtils.formatDateLocale(todayStatus.CheckInTime)}
                  </div>
                </div>
              )}

              {todayStatus?.CheckOutTime && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
                    <div>
                      <p className="text-gray-700 font-medium">You checked out today</p>
                      <p className="text-sm text-purple-600">
                        at {timeUtils.formatTimeUTC(todayStatus.CheckOutTime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {timeUtils.formatDateLocale(todayStatus.CheckOutTime)}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                  <p className="text-gray-700 font-medium">Leave request approved for Dec 25-26</p>
                </div>
                <div className="text-xs text-gray-400">
                  2 days ago
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-3 h-3 bg-amber-500 rounded-full mr-4"></div>
                  <p className="text-gray-700 font-medium">New company policy updated</p>
                </div>
                <div className="text-xs text-gray-400">
                  1 week ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}