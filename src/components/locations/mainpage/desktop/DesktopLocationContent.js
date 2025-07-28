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
      <div className="text-center py-16">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
          <FiMapPin className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Locations Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start by adding your first office location with Google Maps integration
        </p>
        <button
          onClick={onAddLocation}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center mx-auto transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          <FiPlus className="mr-2" />
          Add Your First Location
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location) => (
        <div
          key={location.LocationID}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
        >
          {/* Gradient accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-300">
                  <FiMapPin className="h-7 w-7 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {location.LocationName}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Code: {location.LocationCode}
                  </p>
                </div>
              </div>
              <div
                className={`h-3 w-3 rounded-full ${
                  location.IsActive ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <p className="text-sm text-gray-700 font-medium line-clamp-2">
                  {location.Address}
                </p>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <FiMapPin className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-blue-700 font-medium">
                  {location.Latitude?.toFixed(4)},{" "}
                  {location.Longitude?.toFixed(4)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <span className="text-sm font-medium text-emerald-700">
                  Geofence Radius
                </span>
                <span className="text-sm font-semibold text-emerald-900">
                  {location.AllowedRadius}m
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => onTest(location)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center transition-all duration-200 text-sm font-medium"
              >
                <FiTarget className="mr-2 h-4 w-4" />
                Test Location
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(location.LocationID)}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  title="Edit"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(location.LocationID)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  title="Delete"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}