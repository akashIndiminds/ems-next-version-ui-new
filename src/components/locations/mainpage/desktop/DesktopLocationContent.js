// components/locations/mainpage/desktop/DesktopLocationContent.js
"use client";

import { FiMapPin, FiEdit, FiTrash2, FiTarget, FiPlus } from "react-icons/fi";

export default function DesktopLocationContent({ 
  locations, 
  onEdit, 
  onDelete, 
  onTest, 
  onAddLocation 
}) {
  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FiMapPin className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Locations Yet
        </h3>
        <p className="text-gray-500 mb-4 text-sm">
          Start by adding your first office location with Google Maps integration
        </p>
        <button
          onClick={onAddLocation}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center mx-auto transition-colors duration-200 shadow-sm hover:shadow text-sm font-medium"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Your First Location
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((location) => (
        <div
          key={location.LocationID}
          className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
        >
          {/* Compact accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                  <FiMapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {location.LocationName}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Code: {location.LocationCode}
                  </p>
                </div>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${
                  location.IsActive ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-700 line-clamp-2">
                  {location.Address}
                </p>
              </div>

              <div className="flex items-center p-2.5 bg-blue-50 rounded-lg">
                <FiMapPin className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-xs text-blue-700 font-medium">
                  {location.Latitude?.toFixed(4)},{" "}
                  {location.Longitude?.toFixed(4)}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-lg">
                <span className="text-xs font-medium text-emerald-700">
                  Geofence Radius
                </span>
                <span className="text-xs font-semibold text-emerald-900">
                  {location.AllowedRadius}m
                </span>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => onTest(location)}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 flex items-center transition-colors duration-200 text-xs font-medium"
              >
                <FiTarget className="mr-1.5 h-3 w-3" />
                Test Location
              </button>

              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(location.LocationID)}
                  className="text-blue-600 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50 transition-colors duration-200"
                  title="Edit"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(location.LocationID)}
                  className="text-red-600 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors duration-200"
                  title="Delete"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

