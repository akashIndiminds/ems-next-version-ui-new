// src/app/(dashboard)/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { companyAPI, attendanceAPI } from "@/app/lib/api";
import { locationAPI } from "@/app/lib/api/locationAPI";
import timeUtils from "@/app/lib/utils/timeUtils";
import { FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

// Import components with correct paths
import MobileDashboardStats from "@/components/dashboard/mobile/MobileDashboardStats";
import MobileAttendanceMarking from "@/components/dashboard/mobile/MobileAttendanceMarking";
import MobileDashboardHeader from "@/components/dashboard/mobile/MobileDashboardHeader";
import MobileHolidayList from "@/components/dashboard/mobile/MobileHolidayList";

import DesktopDashboardStats from "@/components/dashboard/desktop/DesktopDashboardStats";
import DesktopAttendanceMarking from "@/components/dashboard/desktop/DesktopAttendanceMarking";
import DesktopDashboardHeader from "@/components/dashboard/desktop/DesktopDashboardHeader";
import DesktopHolidayList from "@/components/dashboard/desktop/DesktopHolidayList";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Screen size detection
  const [isMobile, setIsMobile] = useState(false);

  // Location and attendance states
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationValidation, setLocationValidation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const userLocation = user?.assignedLocation;

  // Screen size detection effect
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch company holidays
  const fetchHolidays = async () => {
    try {
      let companyId = user.company?.companyId;
      if (Array.isArray(companyId)) {
        companyId = companyId[0];
      }

      if (companyId) {
        // Mock holiday data - replace with actual API call
        const mockHolidays = [
          {
            id: 1,
            name: "New Year's Day",
            date: "2025-01-01",
            type: "National Holiday",
            isUpcoming: new Date("2025-01-01") > new Date(),
          },
          {
            id: 2,
            name: "Republic Day",
            date: "2025-01-26",
            type: "National Holiday",
            isUpcoming: new Date("2025-01-26") > new Date(),
          },
          {
            id: 3,
            name: "Independence Day",
            date: "2025-08-15",
            type: "National Holiday",
            isUpcoming: new Date("2025-08-15") > new Date(),
          },
          {
            id: 4,
            name: "Gandhi Jayanti",
            date: "2025-10-02",
            type: "National Holiday",
            isUpcoming: new Date("2025-10-02") > new Date(),
          },
          {
            id: 5,
            name: "Christmas Day",
            date: "2025-12-25",
            type: "National Holiday",
            isUpcoming: new Date("2025-12-25") > new Date(),
          },
        ];

        // Filter upcoming holidays
        const upcomingHolidays = mockHolidays
          .filter(h => h.isUpcoming)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 4); // Show only next 4 holidays

        setHolidays(upcomingHolidays);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }

      let companyId = user.company?.companyId;
      if (Array.isArray(companyId)) {
        companyId = companyId[0];
      }

      // Fetch role-based dashboard stats
      if ((user.role === "admin" || user.role === "manager") && companyId) {
        try {
          const response = await companyAPI.getDashboard(companyId);
          if (response.data.success) {
            setStats(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching company dashboard:", error);
        }
      }

      // Fetch today's attendance status for all users
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

      // Fetch holidays
      await fetchHolidays();

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

  // Location validation functions
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
              message = "Location permission denied. Please enable location access.";
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

  // Enhanced handleCheckIn with better error handling
  const handleCheckIn = async () => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      setCheckInLoading(true);

      const position = await validateLocation();
      if (!position) {
        return;
      }

      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }

      const deviceInfo = {
        deviceUUID: navigator.userAgent,
        deviceType: "web",
        deviceName: "Web Browser",
        platform: navigator.platform,
      };

      const response = await attendanceAPI.checkIn({
        employeeId: employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceInfo: deviceInfo,
        remarks: "Dashboard check-in",
      });

      if (response.data.success) {
        const { shiftDetails, message } = response.data;
        
        if (shiftDetails && shiftDetails.isLate) {
          toast.success(`✅ ${message}`, { duration: 4000 });
        } else {
          toast.success("✅ Checked in successfully!");
        }
        
        fetchDashboardData(true);
      }
    } catch (error) {
      console.error("❌ Check-in error:", error);
      const errorMessage = error.response?.data?.message || "Failed to check in";
      toast.error(errorMessage);
    } finally {
      setCheckInLoading(false);
    }
  };

  // Enhanced handleCheckOut with working hours display
  const handleCheckOut = async () => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      setCheckOutLoading(true);

      const position = await validateLocation();
      if (!position) {
        return;
      }

      let employeeId = user.employeeId;
      if (Array.isArray(employeeId)) {
        employeeId = employeeId[0];
      }

      const deviceInfo = {
        deviceUUID: navigator.userAgent,
        deviceType: "web",
        deviceName: "Web Browser",
        platform: navigator.platform,
      };

      const response = await attendanceAPI.checkOut({
        employeeId: employeeId,
        locationId: userLocation.locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        deviceInfo: deviceInfo,
        remarks: "Dashboard check-out",
      });

      if (response.data.success) {
        const { workingDetails, message } = response.data;
        
        if (workingDetails) {
          toast.success(
            `✅ ${message}\nWorking hours: ${workingDetails.totalWorkingHours}h`,
            { duration: 4000 }
          );
        } else {
          toast.success("✅ Checked out successfully!");
        }
        
        fetchDashboardData(true);
      }
    } catch (error) {
      console.error("❌ Check-out error:", error);
      const errorMessage = error.response?.data?.message || "Failed to check out";
      toast.error(errorMessage);
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
        {/* Header - Role-based */}
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

        {/* Attendance Marking - For all users */}
        {isMobile ? (
          <MobileAttendanceMarking
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
          <DesktopAttendanceMarking
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

        {/* Stats Grid - Only for Admin/Manager */}
        {(user.role === 'admin' || user.role === 'manager') && (
          isMobile ? (
            <MobileDashboardStats stats={stats} userRole={user.role} />
          ) : (
            <DesktopDashboardStats stats={stats} userRole={user.role} />
          )
        )}

        {/* Company Holidays - For all users */}
        {isMobile ? (
          <MobileHolidayList holidays={holidays} />
        ) : (
          <DesktopHolidayList holidays={holidays} />
        )}
      </div>
    </div>
  );
}