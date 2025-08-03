// components/locations/new/desktop/DesktopNewLocationContent.js
"use client";

import { FiMapPin, FiSave, FiLoader, FiCheck, FiEdit3 } from "react-icons/fi";
import GoogleMapsSearch from "@/components/locations/GoogleMapsSearch";
import ApiUsageTracker from "@/components/locations/ApiUsageTracker";

export default function DesktopNewLocationContent({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
  isEditing,
  locationSelected,
  onLocationSelect
}) {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Google Maps Search Component */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <FiMapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Location on Map" : "Search Location"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isEditing ? "View and update location" : "Find and select your office location"}
            </p>
          </div>
        </div>

        {/* Google Maps Placeholder */}
        <GoogleMapsSearch
          formData={formData}
          onLocationSelect={onLocationSelect}
          onApiCallUpdate={() => {}}
          isEditing={isEditing}
          locationSelected={locationSelected}
          isMobile={false}
        />

        {/* Location Status */}
        {locationSelected && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <FiCheck className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800 font-medium text-sm">Location Selected</span>
            </div>
          </div>
        )}
      </div>

      {/* Location Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center mr-3">
            <FiEdit3 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Location Details</h2>
            <p className="text-gray-600 text-sm">Configure your location settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.locationName}
                  onChange={(e) => handleInputChange("locationName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Main Office, Warehouse A, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locationCode}
                    onChange={(e) => handleInputChange("locationCode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="LOC001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type
                  </label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => handleInputChange("locationType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="office">Office</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="factory">Factory</option>
                    <option value="retail">Retail Store</option>
                    <option value="remote">Remote Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Geofence Radius (meters) *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="10000"
                  value={formData.allowedRadius}
                  onChange={(e) => handleInputChange("allowedRadius", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 50-200m for offices, 100-500m for larger facilities
                </p>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Address Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Business Hours</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.businessHours?.start || "09:00"}
                  onChange={(e) => handleInputChange("businessHours", {
                    ...formData.businessHours,
                    start: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.businessHours?.end || "18:00"}
                  onChange={(e) => handleInputChange("businessHours", {
                    ...formData.businessHours,
                    end: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.locationName || !formData.locationCode}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin h-4 w-4 mr-2" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Location" : "Create Location"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
