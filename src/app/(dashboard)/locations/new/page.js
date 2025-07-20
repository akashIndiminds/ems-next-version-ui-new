// src/app/(dashboard)/locations/new/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { locationAPI } from "@/app/lib/api/locationAPI";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiLoader, FiCheck, FiEdit3, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

// Import Components
import GoogleMapsSearch from "@/components/locations/GoogleMapsSearch";
import LocationForm from "@/components/locations/LocationForm";
import ApiUsageTracker from "@/components/locations/ApiUsageTracker";

export default function NewLocationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

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
    if (!locationSelected) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/locations")}
            className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FiArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {isEditing ? "Edit Location" : "Add New Location"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditing 
                ? "Update location details with Google Maps integration"
                : "Search and select location with Google Maps"}
            </p>
          </div>
        </div>

        {/* API Key Status */}
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <FiAlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Google Maps API Key Missing!</p>
                <p>Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your .env.local file</p>
              </div>
            </div>
          </div>
        )}

        {/* API Usage Tracker */}
        {/* <ApiUsageTracker apiCalls={apiCalls} /> */}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Google Maps Search Component */}
          <GoogleMapsSearch
            formData={formData}
            onLocationSelect={handleLocationSelect}
            onApiCallUpdate={handleApiCallUpdate}
            isEditing={isEditing}
            locationSelected={locationSelected}
          />

          {/* Location Form Component */}
          <LocationForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            isEditing={isEditing}
            locationSelected={locationSelected}
            onCancel={() => router.push("/locations")}
          />
        </div>
      </div>
    </div>
  );
}