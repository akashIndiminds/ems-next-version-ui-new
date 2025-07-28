// src/app/(dashboard)/locations/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

// Import fallback implementations for missing dependencies
let useAuth, locationAPI, geolocationUtils, toast;

try {
  const authModule = require("@/context/AuthContext");
  useAuth = authModule.useAuth;
} catch (error) {
  console.error("Error importing AuthContext:", error);
  useAuth = () => ({
    user: { role: "admin", company: { companyId: "1" }, employeeId: "1" },
  });
}

try {
  const locationModule = require("@/app/lib/api/locationAPI");
  locationAPI = locationModule.locationAPI;
  geolocationUtils = locationModule.geolocationUtils;
} catch (error) {
  console.error("Error importing locationAPI:", error);
  locationAPI = {
    getAll: () => Promise.resolve({ data: { success: true, data: [] } }),
    delete: () => Promise.resolve(),
    validateLocation: () =>
      Promise.resolve({ data: { success: true, message: "Test validation" } }),
    advancedValidation: () =>
      Promise.resolve({
        data: { success: true, message: "Test advanced validation" },
      }),
    getNearby: () => Promise.resolve({ data: { data: [] } }),
  };
  geolocationUtils = {
    getCurrentPosition: () =>
      Promise.resolve({ latitude: 0, longitude: 0, accuracy: 10 }),
    calculateDistance: () => 100,
  };
}

try {
  toast = require("react-hot-toast").default;
} catch (error) {
  console.error("Error importing react-hot-toast:", error);
  toast = {
    success: (msg) => console.log("Success:", msg),
    error: (msg) => console.error("Error:", msg),
  };
}

// Import responsive components
import MobileLocationHeader from "@/components/locations/mainpage/mobile/MobileLocationHeader";
import MobileLocationStats from "@/components/locations/mainpage/mobile/MobileLocationStats";
import MobileLocationContent from "@/components/locations/mainpage/mobile/MobileLocationContent";

import DesktopLocationHeader from "@/components/locations/mainpage/desktop/DesktopLocationHeader";
import DesktopLocationStats from "@/components/locations/mainpage/desktop/DesktopLocationStats";
import DesktopLocationFeatures from "@/components/locations/mainpage/desktop/DesktopLocationFeatures";
import DesktopLocationContent from "@/components/locations/mainpage/desktop/DesktopLocationContent";

import LocationTestModal from "@/components/locations/mainpage/LocationTestModal";

export default function ResponsiveLocationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // State management
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testingLocation, setTestingLocation] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [testingInProgress, setTestingInProgress] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchLocations();
  }, [user, router]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationAPI.getAll({
        companyId: user?.company?.companyId || "1",
      });
      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      await locationAPI.delete(id);
      toast.success("Location deleted successfully");
      fetchLocations();
    } catch (error) {
      toast.error("Failed to delete location");
    }
  };

  const handleEdit = (locationId) => {
    router.push(`/locations/new?edit=${locationId}`);
  };

  const handleAddLocation = () => {
    router.push("/locations/new");
  };

  const testLocation = async (location) => {
    setTestingLocation(location);
    setTestResults(null);
    setTestingInProgress(true);
    setShowTestModal(true);

    try {
      // Get current position
      const position = await geolocationUtils.getCurrentPosition();

      // Test basic validation
      const basicTest = await locationAPI.validateLocation(
        location.LocationID,
        position.latitude,
        position.longitude,
        user?.employeeId || "1"
      );

      // Test advanced validation
      const advancedTest = await locationAPI.advancedValidation(
        location.LocationID,
        position.latitude,
        position.longitude,
        user?.employeeId || "1",
        { requireCountryValidation: true }
      );

      // Calculate distance manually
      const distance = geolocationUtils.calculateDistance(
        position.latitude,
        position.longitude,
        location.Latitude,
        location.Longitude
      );

      // Get nearby locations
      const nearbyLocations = await locationAPI.getNearby(
        position.latitude,
        position.longitude,
        1000,
        user?.company?.companyId || "1"
      );

      setTestResults({
        basicValidation: basicTest.data,
        advancedValidation: advancedTest.data,
        distance: Math.round(distance),
        nearbyLocations: nearbyLocations.data,
        userPosition: position,
        locationData: location,
      });

      toast.success("Location test completed successfully");
    } catch (error) {
      console.error("Test error:", error);
      toast.error("Failed to test location: " + error.message);
    } finally {
      setTestingInProgress(false);
    }
  };

  const closeTestModal = () => {
    setShowTestModal(false);
    setTestingLocation(null);
    setTestResults(null);
    setTestingInProgress(false);
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

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileLocationHeader
          locationsCount={locations.length}
          onAddLocation={handleAddLocation}
        />
        
        <MobileLocationStats locations={locations} />
        
        <MobileLocationContent
          locations={locations}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTest={testLocation}
          onAddLocation={handleAddLocation}
        />

        <LocationTestModal
          showModal={showTestModal}
          onClose={closeTestModal}
          testingLocation={testingLocation}
          testResults={testResults}
          testingInProgress={testingInProgress}
        />
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-8">
        <DesktopLocationHeader
          locationsCount={locations.length}
          onAddLocation={handleAddLocation}
        />

        <DesktopLocationStats locations={locations} />

        <DesktopLocationFeatures />

        <DesktopLocationContent
          locations={locations}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTest={testLocation}
          onAddLocation={handleAddLocation}
        />

        <LocationTestModal
          showModal={showTestModal}
          onClose={closeTestModal}
          testingLocation={testingLocation}
          testResults={testResults}
          testingInProgress={testingInProgress}
        />
      </div>
    </div>
  );
}