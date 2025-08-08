// src/app/(dashboard)/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { companyAPI, attendanceAPI } from "@/app/lib/api";
import { locationAPI } from "@/app/lib/api/locationAPI";
import timeUtils from "@/app/lib/utils/timeUtils";
import { FiRefreshCw, FiActivity, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

// Import responsive components
import MobileDashboardStats from "@/components/dashboard/mobile/MobileDashboardStats";
import MobileAttendanceStatus from "@/components/dashboard/mobile/MobileAttendanceStatus";
import MobileDashboardHeader from "@/components/dashboard/mobile/MobileDashboardHeader";
import MobileDashboardChart from "@/components/dashboard/mobile/MobileDashboardChart";

import DesktopDashboardStats from "@/components/dashboard/dekstop/DesktopDashboardStats";
import DesktopAttendanceStatus from "@/components/dashboard/dekstop/DesktopAttendanceStatus";
import DesktopDashboardChart from "@/components/dashboard/dekstop/DesktopDashboardChart";
import DesktopDashboardHeader from "@/components/dashboard/dekstop/DesktopDashboardHeader";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivities, setRecentActivities] = useState([]);

  // Screen size detection
  const [isMobile, setIsMobile] = useState(false);

  // Location validation states (same as attendance page)
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationValidation, setLocationValidation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const userLocation = user?.assignedLocation;

  // Screen size detection effect
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
      if (user.role === "admin" && companyId) {
        try {
          const response = await companyAPI.getDashboard(companyId);
          if (response.data.success) {
            setStats(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching company dashboard:", error);
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
          console.error("Error fetching today status:", error);
        }
      }

      // Mock chart data (in real app, fetch from API)
      setChartData([
        { name: "Mon", present: 85, absent: 15 },
        { name: "Tue", present: 88, absent: 12 },
        { name: "Wed", present: 92, absent: 8 },
        { name: "Thu", present: 87, absent: 13 },
        { name: "Fri", present: 90, absent: 10 },
      ]);

      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          type: "checkin",
          message: "You checked in today",
          time: todayStatus?.CheckInTime || new Date().toISOString(),
          color: "emerald",
        },
        {
          id: 2,
          type: "leave",
          message: "Leave request approved for Dec 25-26",
          time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          color: "blue",
        },
        {
          id: 3,
          type: "policy",
          message: "New company policy updated",
          time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          color: "amber",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
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

  // Location validation functions (copied from attendance page)
  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
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
          let message = "Failed to get location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "Location permission denied. Please enable location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "Location request timed out.";
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
        toast.error("No location assigned to your account");
        return null;
      }

      if (!userLocation.hasCoordinates) {
        toast.error("Your assigned location needs coordinate setup");
        return null;
      }

      const position = await getCurrentLocation();

      const response = await locationAPI.validateLocation(
        userLocation.locationId,
        position.latitude,
        position.longitude,
        user.employeeId
      );

      console.log("🔍 Location validation response:", response.data);
      setLocationValidation(response.data);

      if (response.data.success) {
        toast.success(
          `✅ Location verified! Distance: ${response.data.data.distance}m from ${response.data.data.locationName}`
        );
        return position;
      } else {
        toast.error(`❌ ${response.data.message}`);
        return null;
      }
    } catch (error) {
      console.error("❌ Location validation error:", error);
      toast.error(error.message);
      return null;
    }
  };

  // Updated handleCheckIn with location validation
  const handleCheckIn = async () => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      setCheckInLoading(true);

      // Validate location first
      const position = await validateLocation();
      if (!position) {
        return;
      }

      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }

      const response = await attendanceAPI.checkIn({
        employeeId: employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceId: 5,
        remarks: "Dashboard check-in with location validation",
      });

      if (response.data.success) {
        toast.success("✅ Checked in successfully!");
        fetchDashboardData(true);
      }
    } catch (error) {
      console.error("❌ Check-in error:", error);
      toast.error(error.response?.data?.message || "Failed to check in");
    } finally {
      setCheckInLoading(false);
    }
  };

  // Updated handleCheckOut with location validation
  const handleCheckOut = async () => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      setCheckOutLoading(true);

      // Validate location first
      const position = await validateLocation();
      if (!position) {
        return;
      }

      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }

      const response = await attendanceAPI.checkOut({
        employeeId: employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceId: 1,
        remarks: "Dashboard check-out with location validation",
      });

      if (response.data.success) {
        toast.success("✅ Checked out successfully!");
        fetchDashboardData(true);
      }
    } catch (error) {
      console.error("❌ Check-out error:", error);
      toast.error(error.response?.data?.message || "Failed to check out");
    } finally {
      setCheckOutLoading(false);
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
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="sm:p-6 space-y-6">
        {/* Header - Conditional Rendering */}
        {isMobile ? (
          <MobileDashboardHeader
            user={user}
            timeUtils={timeUtils}
            handleRefresh={handleRefresh}
            refreshing={refreshing}
          />
        ) : (
          <DesktopDashboardHeader
            user={user}
            timeUtils={timeUtils}
            handleRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}

        {/* Today's Attendance Status - Conditional Rendering */}
        {isMobile ? (
          <MobileAttendanceStatus
            todayStatus={todayStatus}
            userLocation={userLocation}
            timeUtils={timeUtils}
            currentTime={currentTime}
            handleCheckIn={handleCheckIn}
            handleCheckOut={handleCheckOut}
            getLiveWorkingHours={getLiveWorkingHours}
            checkInLoading={checkInLoading}
            checkOutLoading={checkOutLoading}
            gettingLocation={gettingLocation}
          />
        ) : (
          <DesktopAttendanceStatus
            todayStatus={todayStatus}
            timeUtils={timeUtils}
            userLocation={userLocation}
            currentTime={currentTime}
            handleCheckIn={handleCheckIn}
            handleCheckOut={handleCheckOut}
            getLiveWorkingHours={getLiveWorkingHours}
            checkInLoading={checkInLoading}
            checkOutLoading={checkOutLoading}
            gettingLocation={gettingLocation}
          />
        )}

        {/* Stats Grid - Conditional Rendering */}
        {isMobile ? (
          <MobileDashboardStats stats={stats} userRole={user.role} />
        ) : (
          <DesktopDashboardStats stats={stats} userRole={user.role} />
        )}

        {/* Attendance Chart - Conditional Rendering */}
        {isMobile ? (
          <MobileDashboardChart chartData={chartData} userRole={user.role} />
        ) : (
          <DesktopDashboardChart chartData={chartData} userRole={user.role} />
        )}

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
                    activity.color === "emerald"
                      ? "from-emerald-50 to-green-50 border-emerald-200"
                      : activity.color === "blue"
                      ? "from-blue-50 to-cyan-50 border-blue-200"
                      : "from-amber-50 to-yellow-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 w-3 h-3 rounded-full mr-3 sm:mr-4 ${
                        activity.color === "emerald"
                          ? "bg-emerald-500"
                          : activity.color === "blue"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                    ></div>
                    <div>
                      <p className="text-gray-700 font-medium text-sm sm:text-base">
                        {activity.message}
                      </p>
                      {activity.type === "checkin" &&
                        todayStatus?.CheckInTime && (
                          <p
                            className={`text-xs sm:text-sm mt-1 ${
                              activity.color === "emerald"
                                ? "text-emerald-600"
                                : activity.color === "blue"
                                ? "text-blue-600"
                                : "text-amber-600"
                            }`}
                          >
                            at {timeUtils.formatTimeUTC(activity.time)}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.type === "checkin" && todayStatus?.CheckInTime
                      ? timeUtils.formatDateLocale(activity.time)
                      : activity.type === "leave"
                      ? "2 days ago"
                      : "1 week ago"}
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
