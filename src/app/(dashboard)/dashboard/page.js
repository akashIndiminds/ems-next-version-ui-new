// src/app/(dashboard)/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { companyAPI, attendanceAPI } from '@/app/lib/api';
import timeUtils from '@/app/lib/utils/timeUtils';
import { FiRefreshCw, FiActivity, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Import responsive components
import MobileDashboardStats from '@/components/dashboard/MobileDashboardStats';
import DesktopDashboardStats from '@/components/dashboard/DesktopDashboardStats';
import MobileAttendanceStatus from '@/components/dashboard/MobileAttendanceStatus';
import DesktopAttendanceStatus from '@/components/dashboard/DesktopAttendanceStatus';
import MobileDashboardChart from '@/components/dashboard/MobileDashboardChart';
import DesktopDashboardChart from '@/components/dashboard/DesktopDashboardChart';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivities, setRecentActivities] = useState([]);

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
      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }
      
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

      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          type: 'checkin',
          message: 'You checked in today',
          time: todayStatus?.CheckInTime || new Date().toISOString(),
          color: 'emerald'
        },
        {
          id: 2,
          type: 'leave',
          message: 'Leave request approved for Dec 25-26',
          time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          color: 'blue'
        },
        {
          id: 3,
          type: 'policy',
          message: 'New company policy updated',
          time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          color: 'amber'
        }
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

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

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
        fetchDashboardData(true);
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
        fetchDashboardData(true);
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-1 text-sm md:text-base text-gray-600 leading-relaxed">
          Welcome back, {user.fullName}! Here's what's happening today.
        </p>
        <div className="mt-2 text-xs md:text-sm text-gray-500">
          {timeUtils.formatDateTime(new Date().toISOString())}
        </div>
      </div>
      
      <div className="flex-shrink-0 md:mt-0">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-sm md:text-base"
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>

        {/* Today's Attendance Status - Mobile Version */}
        <MobileAttendanceStatus 
          todayStatus={todayStatus}
          timeUtils={timeUtils}
          currentTime={currentTime}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          getLiveWorkingHours={getLiveWorkingHours}
        />

        {/* Today's Attendance Status - Desktop Version */}
        <DesktopAttendanceStatus 
          todayStatus={todayStatus}
          timeUtils={timeUtils}
          currentTime={currentTime}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          getLiveWorkingHours={getLiveWorkingHours}
        />

        {/* Stats Grid - Mobile Version */}
        <MobileDashboardStats 
          stats={stats}
          userRole={user.role}
        />

        {/* Stats Grid - Desktop Version */}
        <DesktopDashboardStats 
          stats={stats}
          userRole={user.role}
        />

        {/* Attendance Chart - Mobile Version */}
        {/* <MobileDashboardChart 
          chartData={chartData}
          userRole={user.role}
        /> */}

        {/* Attendance Chart - Desktop Version */}
        <DesktopDashboardChart 
          chartData={chartData}
          userRole={user.role}
        />

        {/* Recent Activities */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <FiActivity className="mr-2 sm:mr-3 text-indigo-600 h-5 w-5 sm:h-6 sm:w-6" />
              Recent Activities
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className={`flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r rounded-xl border transition-colors duration-200 hover:shadow-sm ${
                    activity.color === 'emerald' ? 'from-emerald-50 to-green-50 border-emerald-200' :
                    activity.color === 'blue' ? 'from-blue-50 to-cyan-50 border-blue-200' :
                    'from-amber-50 to-yellow-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-3 sm:mr-4 ${
                      activity.color === 'emerald' ? 'bg-emerald-500' :
                      activity.color === 'blue' ? 'bg-blue-500' :
                      'bg-amber-500'
                    }`}></div>
                    <div>
                      <p className="text-gray-700 font-medium text-sm sm:text-base">{activity.message}</p>
                      {activity.type === 'checkin' && todayStatus?.CheckInTime && (
                        <p className={`text-xs sm:text-sm mt-1 ${
                          activity.color === 'emerald' ? 'text-emerald-600' :
                          activity.color === 'blue' ? 'text-blue-600' :
                          'text-amber-600'
                        }`}>
                          at {timeUtils.formatTimeUTC(activity.time)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.type === 'checkin' && todayStatus?.CheckInTime 
                      ? timeUtils.formatDateLocale(activity.time)
                      : activity.type === 'leave' ? '2 days ago'
                      : '1 week ago'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}