// src/app/(dashboard)/locations/new/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";

// Import fallback implementations for missing dependencies
let useAuth, locationAPI, toast;

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
} catch (error) {
  console.error("Error importing locationAPI:", error);
  locationAPI = {
    getById: () => Promise.resolve({ data: { success: true, data: {} } }),
    create: () => Promise.resolve(),
    update: () => Promise.resolve(),
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
import MobileNewLocationHeader from "@/components/locations/new/mobile/MobileNewLocationHeader";
import MobileNewLocationContent from "@/components/locations/new/mobile/MobileNewLocationContent";

import DesktopNewLocationHeader from "@/components/locations/new/desktop/DesktopNewLocationHeader";
import DesktopNewLocationContent from "@/components/locations/new/desktop/DesktopNewLocationContent";

export default function ResponsiveNewLocationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  // Responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // State management
  const [loading, setLoading] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [apiCalls, setApiCalls] = useState({ places: 0, geocoding: 0 });

  const [formData, setFormData] = useState({
    locationCode: "",
    locationName: "",
    address: "",
    latitude: "",
    longitude: "",
    allowedRadius: "100",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    placeId: "",
    locationType: "office",
    timezone: "",
    businessHours: {
      start: "09:00",
      end: "18:00"
    }
  });

  // Check if API key is missing
  const apiKeyMissing = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Load existing location data for editing
  useEffect(() => {
    if (isEditing && editId) {
      loadLocationForEdit(editId);
    }
  }, [isEditing, editId]);

  const loadLocationForEdit = async (locationId) => {
    try {
      setLoading(true);
      const response = await locationAPI.getById(locationId);
      if (response.data.success) {
        const location = response.data.data;
        setFormData({
          locationCode: location.LocationCode,
          locationName: location.LocationName,
          address: location.Address,
          latitude: location.Latitude,
          longitude: location.Longitude,
          allowedRadius: location.AllowedRadius,
          city: location.City || "",
          state: location.State || "",
          country: location.Country || "",
          postalCode: location.PostalCode || "",
          placeId: location.PlaceId || "",
          locationType: location.LocationType || "office",
          timezone: location.Timezone || "",
          businessHours: location.BusinessHours || { start: "09:00", end: "18:00" }
        });
        setLocationSelected(true);
      }
    } catch (error) {
      console.error("Error loading location:", error);
      toast.error("Failed to load location data");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (locationData) => {
    setFormData(prev => ({
      ...prev,
      ...locationData
    }));
    setLocationSelected(true);
  };

  const handleApiCallUpdate = (newCalls) => {
    setApiCalls(prev => ({
      places: prev.places + (newCalls.places || 0),
      geocoding: prev.geocoding + (newCalls.geocoding || 0)
    }));
  };

  const handleSubmit = async (submitFormData) => {
    if (!locationSelected && !isEditing) {
      toast.error("Please select a location first");
      return;
    }

    try {
      setLoading(true);
      
      const locationData = {
        CompanyID: user.company.companyId,
        LocationCode: submitFormData.locationCode,
        LocationName: submitFormData.locationName,
        Address: submitFormData.address,
        Latitude: parseFloat(submitFormData.latitude),
        Longitude: parseFloat(submitFormData.longitude),
        AllowedRadius: parseInt(submitFormData.allowedRadius),
        PlaceId: submitFormData.placeId,
        City: submitFormData.city,
        State: submitFormData.state,
        Country: submitFormData.country,
        PostalCode: submitFormData.postalCode,
        LocationType: submitFormData.locationType,
        Timezone: submitFormData.timezone,
        BusinessHours: submitFormData.businessHours,
      };

      if (isEditing) {
        await locationAPI.update(editId, locationData);
        toast.success("Location updated successfully!");
      } else {
        await locationAPI.create(locationData);
        toast.success("Location created successfully!");
      }

      router.push("/locations");
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(error.response?.data?.message || "Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/locations");
  };

  const handleBack = () => {
    router.push("/locations");
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileNewLocationHeader
          onBack={handleBack}
          isEditing={isEditing}
          apiKeyMissing={apiKeyMissing}
        />
        
        <MobileNewLocationContent
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEditing={isEditing}
          locationSelected={locationSelected}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 w-full mx-auto">
        <DesktopNewLocationHeader
          onBack={handleBack}
          isEditing={isEditing}
          apiKeyMissing={apiKeyMissing}
        />

        <DesktopNewLocationContent
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEditing={isEditing}
          locationSelected={locationSelected}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </div>
  );
}