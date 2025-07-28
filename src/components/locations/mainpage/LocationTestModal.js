// components/locations/mainpage/LocationTestModal.js
"use client";

import { FiTarget, FiClock, FiCheckCircle, FiXCircle, FiMapPin, FiX } from "react-icons/fi";

export default function LocationTestModal({
  showModal,
  onClose,
  testingLocation,
  testResults,
  testingInProgress
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-2xl max-w-2xl w-full p-4 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <FiTarget className="mr-3 text-blue-600" />
                Location Test Results
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiX className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            {testingLocation && (
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Testing: {testingLocation.LocationName} ({testingLocation.LocationCode})
              </p>
            )}
          </div>

          {testingInProgress ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 flex items-center">
                <FiClock className="mr-2" />
                Running location tests...
              </p>
            </div>
          ) : testResults ? (
            <div className="space-y-6">
              {/* Validation Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border-2 ${
                    testResults.basicValidation.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {testResults.basicValidation.success ? (
                      <FiCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <FiXCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <h4
                      className={`font-semibold ${
                        testResults.basicValidation.success
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Basic Validation
                    </h4>
                  </div>
                  <p
                    className={`text-sm ${
                      testResults.basicValidation.success
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {testResults.basicValidation.message}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl border-2 ${
                    testResults.advancedValidation.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {testResults.advancedValidation.success ? (
                      <FiCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <FiXCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <h4
                      className={`font-semibold ${
                        testResults.advancedValidation.success
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Advanced Validation
                    </h4>
                  </div>
                  <p
                    className={`text-sm ${
                      testResults.advancedValidation.success
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {testResults.advancedValidation.message}
                  </p>
                </div>
              </div>

              {/* Distance Information */}
              <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                  <FiMapPin className="mr-2" />
                  Distance Analysis
                </h4>
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                      {testResults.distance}m
                    </div>
                    <div className="text-blue-700 text-xs md:text-sm">Current Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                      {testResults.locationData.AllowedRadius}m
                    </div>
                    <div className="text-blue-700 text-xs md:text-sm">Allowed Radius</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-xl md:text-2xl font-bold ${
                        testResults.distance <= testResults.locationData.AllowedRadius
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {testResults.distance <= testResults.locationData.AllowedRadius ? "✓" : "✗"}
                    </div>
                    <div className="text-blue-700 text-xs md:text-sm">Within Range</div>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Coordinate Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-black mb-2">Your Position</h5>
                    <p className="text-gray-700">
                      Lat: {testResults.userPosition.latitude.toFixed(6)}
                    </p>
                    <p className="text-gray-700">
                      Lng: {testResults.userPosition.longitude.toFixed(6)}
                    </p>
                    <p className="text-gray-700">
                      Accuracy: ±{testResults.userPosition.accuracy}m
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-black mb-2">Location Center</h5>
                    <p className="text-gray-700">
                      Lat: {testResults.locationData.Latitude.toFixed(6)}
                    </p>
                    <p className="text-gray-700">
                      Lng: {testResults.locationData.Longitude.toFixed(6)}
                    </p>
                    <p className="text-gray-700">
                      Radius: {testResults.locationData.AllowedRadius}m
                    </p>
                  </div>
                </div>
              </div>

              {/* Nearby Locations */}
              {testResults.nearbyLocations &&
                testResults.nearbyLocations.data &&
                testResults.nearbyLocations.data.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-4 md:p-6 border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-4">
                      Nearby Locations
                    </h4>
                    <div className="space-y-2 text-sm">
                      {testResults.nearbyLocations.data
                        .slice(0, 3)
                        .map((loc, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-yellow-700">
                              {loc.LocationName}
                            </span>
                            <span className="text-yellow-600 font-medium">
                              {loc.distance}m away
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No test results available</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}