// components/locations/mainpage/mobile/MobileLocationContent.js
"use client";

import { useState } from "react";
import { FiMapPin, FiEdit, FiTrash2, FiTarget, FiMoreVertical } from "react-icons/fi";

export default function MobileLocationContent({ 
  locations, 
  onEdit, 
  onDelete, 
  onTest, 
  onAddLocation 
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (locationId) => {
    setActiveDropdown(activeDropdown === locationId ? null : locationId);
  };

  if (locations.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
          <FiMapPin className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Locations Yet
        </h3>
        <p className="text-gray-500 mb-6 text-sm">
          Add your first office location with Google Maps integration
        </p>
        <button
          onClick={onAddLocation}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg active:scale-95"
        >
          Add Your First Location
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      {/* Location cards */}
      <div className="space-y-3">
        {locations.map((location) => (
          <div
            key={location.LocationID}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Gradient accent */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-3">
                    <FiMapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {location.LocationName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {location.LocationCode}
                    </p>
                  </div>
                </div>
                
                {/* Status and menu */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      location.IsActive ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  
                  {/* Action menu */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(location.LocationID)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <FiMoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                    
                    {/* Dropdown menu */}
                    {activeDropdown === location.LocationID && (
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px] z-10">
                        <button
                          onClick={() => {
                            onTest(location);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <FiTarget className="h-4 w-4 mr-2 text-green-600" />
                          Test Location
                        </button>
                        <button
                          onClick={() => {
                            onEdit(location.LocationID);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <FiEdit className="h-4 w-4 mr-2 text-blue-600" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(location.LocationID);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <FiTrash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {location.Address}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">Coordinates</span>
                  <span className="text-sm font-medium text-blue-900">
                    {location.Latitude?.toFixed(4)}, {location.Longitude?.toFixed(4)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                  <span className="text-sm text-emerald-700">Radius</span>
                  <span className="text-sm font-semibold text-emerald-900">
                    {location.AllowedRadius}m
                  </span>
                </div>
              </div>

              {/* Primary action button */}
              <div className="mt-4">
                <button
                  onClick={() => onTest(location)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center"
                >
                  <FiTarget className="mr-2 h-4 w-4" />
                  Test Location
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}