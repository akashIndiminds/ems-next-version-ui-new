// src/components/locations/LocationForm.js
"use client";

import { useCallback } from "react";
import { FiEdit3, FiCheck, FiLoader, FiRefreshCw } from "react-icons/fi";

const LocationForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  isEditing, 
  locationSelected, 
  onCancel 
}) => {

  // Generate unique location code
  const generateLocationCode = useCallback((placeName) => {
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessHoursChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FiEdit3 className="mr-2 text-blue-600" />
          Location Details
        </h2>
        <p className="text-gray-600 mt-1">
          All fields are automatically filled when you select a location
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Location Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location Type
          </label>
          <select
            value={formData.locationType}
            onChange={(e) => handleInputChange('locationType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="office">Office</option>
            <option value="warehouse">Warehouse</option>
            <option value="site">Site/Factory</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Location Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location Code (Auto-Generated)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.locationCode}
              onChange={(e) => handleInputChange('locationCode', e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Auto-generated code"
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

        {/* Location Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.locationName}
            onChange={(e) => handleInputChange('locationName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="e.g., Main Office, Warehouse A"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Address
          </label>
          <textarea
            rows="3"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Complete address will be auto-filled"
          />
        </div>

        {/* Coordinates Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Latitude
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              step="0.00000001"
              required
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="19.0760"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Longitude
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              step="0.00000001"
              required
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="72.8777"
            />
          </div>
        </div>

        {/* Geofence Radius */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Geofence Radius (meters)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min="10"
              max="5000"
              value={formData.allowedRadius}
              onChange={(e) => handleInputChange('allowedRadius', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="100"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              meters
            </span>
          </div>
          {/* <div className="mt-2 text-xs text-gray-500">
            <p>Recommended ranges:</p>
            <ul className="mt-1 space-y-1">
              <li>• Small office/shop: 30-50m</li>
              <li>• Medium building: 50-100m</li>
              <li>• Large office/mall: 100-200m</li>
              <li>• Campus/factory: 200-500m</li>
            </ul>
          </div> */}
        </div>

        {/* Business Hours */}
        {/* <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Hours
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Start Time</label>
              <input
                type="time"
                value={formData.businessHours.start}
                onChange={(e) => handleBusinessHoursChange('start', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">End Time</label>
              <input
                type="time"
                value={formData.businessHours.end}
                onChange={(e) => handleBusinessHoursChange('end', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        </div> */}

        {/* Additional Location Info */}
        {(formData.city || formData.state || formData.country || formData.timezone) && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-3">Additional Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {formData.city && (
                <div>
                  <span className="text-gray-600">City:</span>
                  <span className="ml-2 text-gray-800 font-medium">{formData.city}</span>
                </div>
              )}
              {formData.state && (
                <div>
                  <span className="text-gray-600">State:</span>
                  <span className="ml-2 text-gray-800 font-medium">{formData.state}</span>
                </div>
              )}
              {formData.country && (
                <div>
                  <span className="text-gray-600">Country:</span>
                  <span className="ml-2 text-gray-800 font-medium">{formData.country}</span>
                </div>
              )}
              {formData.postalCode && (
                <div>
                  <span className="text-gray-600">Postal Code:</span>
                  <span className="ml-2 text-gray-800 font-medium">{formData.postalCode}</span>
                </div>
              )}
              {formData.timezone && (
                <div className="col-span-2">
                  <span className="text-gray-600">Timezone:</span>
                  <span className="ml-2 text-gray-800 font-medium">{formData.timezone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !locationSelected}
            className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
          >
            {loading ? (
              <>
                <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <FiCheck className="mr-2 h-4 w-4" />
                {isEditing ? "Update Location" : "Create Location"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;