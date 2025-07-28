// components/locations/new/mobile/MobileNewLocationContent.js
"use client";

import { useState } from "react";
import { FiMapPin, FiSave, FiX, FiLoader, FiCheck, FiEdit3, FiRefreshCw } from "react-icons/fi";
import GoogleMapsSearch from "@/components/locations/GoogleMapsSearch";
import ApiUsageTracker from "@/components/locations/ApiUsageTracker";

export default function MobileNewLocationContent({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
  isEditing,
  locationSelected,
  onLocationSelect,
  onApiCallUpdate,
  apiCalls
}) {
  const [activeTab, setActiveTab] = useState("search");

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

  const generateLocationCode = (placeName) => {
    if (!placeName) return "";
    
    const words = placeName.toUpperCase().split(" ");
    let code = "";
    
    if (words.length >= 2) {
      code = words[0].substring(0, 3) + words[1].substring(0, 2);
    } else {
      code = words[0].substring(0, 5);
    }
    
    const timestamp = Date.now().toString().slice(-3);
    code += timestamp;
    
    return code.substring(0, 8);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === "search"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600"
          }`}
        >
          <FiMapPin className="h-4 w-4 inline mr-2" />
          Search Location
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === "form"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600"
          }`}
          disabled={!locationSelected && !isEditing}
        >
          <FiCheck className="h-4 w-4 inline mr-2" />
          Details
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === "search" && (
          <div className="p-4">
            {/* API Usage Tracker */}
            {apiCalls && (
              <ApiUsageTracker 
                apiCalls={apiCalls}
                dailyLimit={1000}
              />
            )}

            {/* Google Maps Search Component */}
            <GoogleMapsSearch
              formData={formData}
              onLocationSelect={onLocationSelect}
              onApiCallUpdate={onApiCallUpdate || (() => {})}
              isEditing={isEditing}
              locationSelected={locationSelected}
            />

            {/* Quick Action Button */}
            {locationSelected && (
              <button
                onClick={() => setActiveTab("form")}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center"
              >
                Continue to Details
                <FiCheck className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Location Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FiEdit3 className="h-4 w-4 mr-2 text-blue-600" />
                Location Information
              </h3>
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
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                    placeholder="Office Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Code *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.locationCode}
                      onChange={(e) => handleInputChange("locationCode", e.target.value.toUpperCase())}
                      className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg text-black"
                      placeholder="LOC001"
                      maxLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = generateLocationCode(formData.locationName || formData.address);
                        handleInputChange('locationCode', newCode);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                      title="Regenerate Code"
                    >
                      <FiRefreshCw className="h-4 w-4" />
                    </button>
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
                    max="5000"
                    value={formData.allowedRadius}
                    onChange={(e) => handleInputChange("allowedRadius", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type
                  </label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => handleInputChange("locationType", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                  >
                    <option value="office">Office</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="site">Site/Factory</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Address Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                    rows="3"
                    placeholder="Complete address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                      placeholder="0.000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                      placeholder="0.000000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
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
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Bottom Action Bar */}
      {(activeTab === "form" || (activeTab === "search" && locationSelected)) && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.locationName || !formData.locationCode || !locationSelected}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
        </div>
      )}
    </div>
  );
}