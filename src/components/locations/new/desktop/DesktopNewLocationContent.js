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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Google Maps Search Component */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-4">
            <FiMapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Location on Map" : "Search Location"}
            </h2>
            <p className="text-gray-600">
              {isEditing ? "View and update location" : "Find and select your office location"}
            </p>
          </div>
        </div>

        {/* Google Maps Placeholder - Replace with actual GoogleMapsSearch component */}
        <GoogleMapsSearch
          formData={formData}
          onLocationSelect={onLocationSelect}
          onApiCallUpdate={() => {}} // Add your API call tracking if needed
          isEditing={isEditing}
          locationSelected={locationSelected}
          isMobile={false}
        />

        {/* Manual coordinates input */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Manual Entry</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                rows="3"
                placeholder="Enter full address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                  placeholder="0.000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                  placeholder="0.000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Status */}
        {locationSelected && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <FiCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Location Selected</span>
            </div>
          </div>
        )}
      </div>

      {/* Location Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mr-4">
            <FiEdit3 className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
            <p className="text-gray-600">Configure your location settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.locationName}
                  onChange={(e) => handleInputChange("locationName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                  placeholder="Main Office, Warehouse A, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locationCode}
                    onChange={(e) => handleInputChange("locationCode", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                    placeholder="LOC001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type
                  </label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => handleInputChange("locationType", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geofence Radius (meters) *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="10000"
                  value={formData.allowedRadius}
                  onChange={(e) => handleInputChange("allowedRadius", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 50-200m for offices, 100-500m for larger facilities
                </p>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.businessHours?.start || "09:00"}
                  onChange={(e) => handleInputChange("businessHours", {
                    ...formData.businessHours,
                    start: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.businessHours?.end || "18:00"}
                  onChange={(e) => handleInputChange("businessHours", {
                    ...formData.businessHours,
                    end: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.locationName || !formData.locationCode}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin h-5 w-5 mr-2" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FiSave className="h-5 w-5 mr-2" />
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