// src/app/(dashboard)/locations/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Simple icon replacements using text/symbols
const Icons = {
  Plus: () => <span className="text-lg">+</span>,
  Edit: () => <span className="text-lg">✏️</span>,
  Trash: () => <span className="text-lg">🗑️</span>,
  MapPin: () => <span className="text-lg">📍</span>,
  Target: () => <span className="text-lg">🎯</span>,
  CheckCircle: () => <span className="text-lg">✅</span>,
  XCircle: () => <span className="text-lg">❌</span>,
  Clock: () => <span className="text-lg">⏰</span>,
  Map: () => <span className="text-lg">🗺️</span>,
  Building: () => <span className="text-lg">🏢</span>,
  Activity: () => <span className="text-lg">📊</span>,
};

// Mock implementations for missing APIs
const useAuth = () => ({ 
  user: { 
    role: "admin", 
    company: { companyId: "1" }, 
    employeeId: "1" 
  } 
});

const locationAPI = {
  getAll: () => Promise.resolve({ 
    data: { 
      success: true, 
      data: [
        {
          LocationID: 1,
          LocationName: "Main Office",
          LocationCode: "MO001",
          Address: "123 Business Street, City, State 12345",
          Latitude: 40.7128,
          Longitude: -74.0060,
          AllowedRadius: 100,
          IsActive: true
        },
        {
          LocationID: 2,
          LocationName: "Branch Office",
          LocationCode: "BO002",
          Address: "456 Commerce Ave, City, State 67890",
          Latitude: 40.7589,
          Longitude: -73.9851,
          AllowedRadius: 150,
          IsActive: true
        }
      ] 
    } 
  }),
  delete: () => Promise.resolve(),
  validateLocation: () => Promise.resolve({ 
    data: { success: true, message: "Location validation successful" } 
  }),
  advancedValidation: () => Promise.resolve({ 
    data: { success: true, message: "Advanced validation successful" } 
  }),
  getNearby: () => Promise.resolve({ data: { data: [] } })
};

const geolocationUtils = {
  getCurrentPosition: () => Promise.resolve({ 
    latitude: 40.7128, 
    longitude: -74.0060, 
    accuracy: 10 
  }),
  calculateDistance: () => 50
};

const toast = {
  success: (msg) => alert(`Success: ${msg}`),
  error: (msg) => alert(`Error: ${msg}`)
};

export default function LocationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testingLocation, setTestingLocation] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [testingInProgress, setTestingInProgress] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchLocations();
  }, [user, router]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationAPI.getAll({
        companyId: user?.company?.companyId || "1",
      });
      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      await locationAPI.delete(id);
      toast.success("Location deleted successfully");
      fetchLocations();
    } catch (error) {
      toast.error("Failed to delete location");
    }
  };

  const testLocation = async (location) => {
    setTestingLocation(location);
    setTestResults(null);
    setTestingInProgress(true);
    setShowTestModal(true);

    try {
      const position = await geolocationUtils.getCurrentPosition();
      const basicTest = await locationAPI.validateLocation(
        location.LocationID,
        position.latitude,
        position.longitude,
        user?.employeeId || "1"
      );
      const advancedTest = await locationAPI.advancedValidation(
        location.LocationID,
        position.latitude,
        position.longitude,
        user?.employeeId || "1",
        { requireCountryValidation: true }
      );
      const distance = geolocationUtils.calculateDistance(
        position.latitude,
        position.longitude,
        location.Latitude,
        location.Longitude
      );
      const nearbyLocations = await locationAPI.getNearby(
        position.latitude,
        position.longitude,
        1000,
        user?.company?.companyId || "1"
      );

      setTestResults({
        basicValidation: basicTest.data,
        advancedValidation: advancedTest.data,
        distance: Math.round(distance),
        nearbyLocations: nearbyLocations.data,
        userPosition: position,
        locationData: location,
      });

      toast.success("Location test completed successfully");
    } catch (error) {
      console.error("Test error:", error);
      toast.error("Failed to test location: " + error.message);
    } finally {
      setTestingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Location Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage office locations with Google Maps integration and geofencing
            </p>
          </div>
          <button
            onClick={() => router.push("/locations/new")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <Icons.Plus />
            <span className="ml-2">Add New Location</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Icons.Building />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{locations.length}</h3>
                <p className="text-gray-600">Total Locations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Icons.CheckCircle />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {locations.filter(loc => loc.IsActive).length}
                </h3>
                <p className="text-gray-600">Active Locations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Icons.Activity />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {Math.round(locations.reduce((acc, loc) => acc + (loc.AllowedRadius || 0), 0) / locations.length) || 0}m
                </h3>
                <p className="text-gray-600">Avg. Radius</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Features */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Icons.Map />
            <h2 className="text-xl font-bold text-blue-900 ml-3">
              Smart Location Management Features
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h3 className="font-semibold mb-2">🗺️ Google Maps Integration:</h3>
              <ul className="space-y-1">
                <li>• Search any place worldwide</li>
                <li>• Auto-fill address details</li>
                <li>• Precise coordinate selection</li>
                <li>• Visual map confirmation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Smart Geofencing:</h3>
              <ul className="space-y-1">
                <li>• Customizable radius settings</li>
                <li>• Real-time location validation</li>
                <li>• Distance calculation accuracy</li>
                <li>• Nearby locations detection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔧 Management Tools:</h3>
              <ul className="space-y-1">
                <li>• Auto-generated location codes</li>
                <li>• Bulk location import/export</li>
                <li>• Location testing & validation</li>
                <li>• Advanced analytics & reports</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        {locations.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <Icons.MapPin />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Locations Yet</h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first office location with Google Maps integration
            </p>
            <button
              onClick={() => router.push("/locations/new")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center mx-auto transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Icons.Plus />
              <span className="ml-2">Add Your First Location</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div
                key={location.LocationID}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-300">
                        <Icons.MapPin />
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
                    <div className={`h-3 w-3 rounded-full ${location.IsActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="text-sm text-gray-700 font-medium line-clamp-2">
                        {location.Address}
                      </p>
                    </div>

                    <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                      <Icons.MapPin />
                      <span className="text-sm text-blue-700 font-medium ml-2">
                        {location.Latitude?.toFixed(4)}, {location.Longitude?.toFixed(4)}
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

                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => testLocation(location)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center transition-all duration-200 text-sm font-medium"
                    >
                      <Icons.Target />
                      <span className="ml-2">Test Location</span>
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/locations/new?edit=${location.LocationID}`)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        title="Edit"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(location.LocationID)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        title="Delete"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Test Results Modal */}
        {showTestModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setShowTestModal(false)}
              ></div>

              <div className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Icons.Target />
                    <span className="ml-3">Location Test Results</span>
                  </h3>
                  {testingLocation && (
                    <p className="text-gray-600 mt-2">
                      Testing: {testingLocation.LocationName} ({testingLocation.LocationCode})
                    </p>
                  )}
                </div>

                {testingInProgress ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                    <p className="text-gray-600 flex items-center">
                      <Icons.Clock />
                      <span className="ml-2">Running location tests...</span>
                    </p>
                  </div>
                ) : testResults ? (
                  <div className="space-y-6">
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
                            <Icons.CheckCircle />
                          ) : (
                            <Icons.XCircle />
                          )}
                          <h4
                            className={`font-semibold ml-2 ${
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
                            <Icons.CheckCircle />
                          ) : (
                            <Icons.XCircle />
                          )}
                          <h4
                            className={`font-semibold ml-2 ${
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

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                        <Icons.MapPin />
                        <span className="ml-2">Distance Analysis</span>
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {testResults.distance}m
                          </div>
                          <div className="text-blue-700">Current Distance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {testResults.locationData.AllowedRadius}m
                          </div>
                          <div className="text-blue-700">Allowed Radius</div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-2xl font-bold ${
                              testResults.distance <= testResults.locationData.AllowedRadius
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {testResults.distance <= testResults.locationData.AllowedRadius ? "✓" : "✗"}
                          </div>
                          <div className="text-blue-700">Within Range</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
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
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No test results available</p>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}