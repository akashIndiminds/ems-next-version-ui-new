
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Compact Tab Navigation */}
      <div className="flex bg-white border-b border-gray-100 sticky top-0 z-40">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-2.5 px-3 text-sm font-medium transition-all duration-150 ${
            activeTab === "search"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 active:bg-gray-50"
          }`}
        >
          <FiMapPin className="h-4 w-4 inline mr-1.5" />
          Search
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2.5 px-3 text-sm font-medium transition-all duration-150 ${
            activeTab === "form"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 active:bg-gray-50"
          }`}
          disabled={!locationSelected && !isEditing}
        >
          <FiCheck className="h-4 w-4 inline mr-1.5" />
          Details
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "search" && (
          <div className="p-3 space-y-3">
            {/* Compact API Usage Tracker */}
            {apiCalls && (
              <div className="bg-white rounded-lg border border-gray-100 p-2">
                <ApiUsageTracker 
                  apiCalls={apiCalls}
                  dailyLimit={1000}
                />
              </div>
            )}

            {/* Google Maps Search Component */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <GoogleMapsSearch
                formData={formData}
                onLocationSelect={onLocationSelect}
                onApiCallUpdate={onApiCallUpdate || (() => {})}
                isEditing={isEditing}
                locationSelected={locationSelected}
              />
            </div>

            {/* Quick Action Button */}
            {locationSelected && (
              <button
                onClick={() => setActiveTab("form")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] flex items-center justify-center shadow-sm"
              >
                Continue to Details
                <FiCheck className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className="p-3 space-y-3 pb-20">
            {/* Compact Location Info Card */}
            <div className="bg-white rounded-lg border border-gray-100 p-3">
              <div className="flex items-center mb-2">
                <FiEdit3 className="h-4 w-4 mr-1.5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-sm">Location Information</h3>
              </div>
              
              <div className="space-y-3">
                {/* Location Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locationName}
                    onChange={(e) => handleInputChange("locationName", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Office Name"
                  />
                </div>

                {/* Location Code with Generator */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Location Code *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.locationCode}
                      onChange={(e) => handleInputChange("locationCode", e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="LOC001"
                      maxLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = generateLocationCode(formData.locationName || formData.address);
                        handleInputChange('locationCode', newCode);
                      }}
                      className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 transition-all active:scale-95"
                      title="Generate Code"
                    >
                      <FiRefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Compact Grid for Radius and Type */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Radius (m) *
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      max="5000"
                      value={formData.allowedRadius}
                      onChange={(e) => handleInputChange("allowedRadius", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.locationType}
                      onChange={(e) => handleInputChange("locationType", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="office">Office</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="site">Site/Factory</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Address Details Card */}
            <div className="bg-white rounded-lg border border-gray-100 p-3">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Address Details</h3>
              
              <div className="space-y-3">
                {/* Full Address - Compact textarea */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows="2"
                    placeholder="Complete address"
                  />
                </div>

                {/* Compact Lat/Long Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.000000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.000000"
                    />
                  </div>
                </div>

                {/* City - Full width */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Compact State/Country Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Compact Bottom Action Bar */}
      {(activeTab === "form" || (activeTab === "search" && locationSelected)) && (
        <div className="bg-white border-t border-gray-100 p-3 safe-area-bottom">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 active:scale-[0.98] active:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.locationName || !formData.locationCode || !locationSelected}
              className="flex-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin h-4 w-4 mr-1.5" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4 mr-1.5" />
                  {isEditing ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}