// src/app/(dashboard)/locations/new/page.js
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { locationAPI } from "@/app/lib/api/locationAPI";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiArrowLeft,
  FiMapPin,
  FiSearch,
  FiLoader,
  FiCheck,
  FiTarget,
  FiEdit3,
  FiRefreshCw,
  FiNavigation,
  FiMap,
  FiGlobe,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

// Google Maps Configuration
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// API Usage Tracking Component
const ApiUsageTracker = ({ apiCalls }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiInfo className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">API Usage Today</span>
        </div>
        <div className="text-sm text-blue-700">
          <span className="font-semibold">{apiCalls.places}</span> Places • 
          <span className="font-semibold ml-2">{apiCalls.geocoding}</span> Geocoding
        </div>
      </div>
    </div>
  );
};

export default function NewLocationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  // Refs for Google Maps
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  // State management
  const [loading, setLoading] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapMode, setMapMode] = useState("roadmap"); // roadmap, satellite, hybrid, terrain
  const [apiCalls, setApiCalls] = useState({ places: 0, geocoding: 0 });

  const [formData, setFormData] = useState({
    locationCode: "",
    locationName: "",
    address: "",
    latitude: "",
    longitude: "",
    allowedRadius: "100",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    placeId: "",
    locationType: "office", // office, warehouse, site, other
    timezone: "",
    businessHours: {
      start: "09:00",
      end: "18:00"
    }
  });

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

  // Load Google Maps Script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error("Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file");
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      initializeGoogleMaps();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Global callback for Google Maps
    window.initMap = () => {
      setMapsLoaded(true);
      initializeGoogleMaps();
    };

    script.onerror = () => {
      toast.error("Failed to load Google Maps. Check your API key and billing status.");
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Load existing location data for editing
  useEffect(() => {
    if (isEditing && editId) {
      loadLocationForEdit(editId);
    }
  }, [isEditing, editId]);

  const loadLocationForEdit = async (locationId) => {
    try {
      setLoading(true);
      const response = await locationAPI.getById(locationId);
      if (response.data.success) {
        const location = response.data.data;
        setFormData({
          locationCode: location.LocationCode,
          locationName: location.LocationName,
          address: location.Address,
          latitude: location.Latitude,
          longitude: location.Longitude,
          allowedRadius: location.AllowedRadius,
          city: location.City || "",
          state: location.State || "",
          country: location.Country || "",
          postalCode: location.PostalCode || "",
          placeId: location.PlaceId || "",
          locationType: location.LocationType || "office",
          timezone: location.Timezone || "",
          businessHours: location.BusinessHours || { start: "09:00", end: "18:00" }
        });
        setSearchValue(location.LocationName);
        setLocationSelected(true);
        
        // Update map with location
        if (mapInstance.current) {
          updateMapLocation(location.Latitude, location.Longitude, location.LocationName, location.AllowedRadius);
        }
      }
    } catch (error) {
      console.error("Error loading location:", error);
      toast.error("Failed to load location data");
    } finally {
      setLoading(false);
    }
  };

  const initializeGoogleMaps = () => {
    if (!window.google || !window.google.maps) return;

    // Initialize autocomplete for search with optimized options
    if (searchInputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ["establishment", "geocode"],
          fields: [
            "place_id",
            "formatted_address", 
            "name",
            "geometry",
            "address_components",
            "types",
            "utc_offset_minutes" // For timezone
          ],
        }
      );

      // Set country restrictions if needed (to reduce API costs)
      // autocompleteRef.current.setComponentRestrictions({ country: ["in"] });

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }

    // Initialize map with custom styling
    if (mapRef.current) {
      const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Mumbai, India
      
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: window.google.maps.ControlPosition.TOP_RIGHT,
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
        },
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        styles: getMapStyles(),
      });

      // Add click listener for manual selection
      mapInstance.current.addListener("click", handleMapClick);

      // Add custom controls
      addCustomControls();
    }
  };

  const getMapStyles = () => {
    return [
      {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a2daf2" }],
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [{ color: "#f7f1df" }],
      },
    ];
  };

  const addCustomControls = () => {
    // Add a custom control for quick radius adjustment
    const radiusControlDiv = document.createElement("div");
    radiusControlDiv.className = "custom-map-control";
    radiusControlDiv.innerHTML = `
      <div style="background: white; padding: 10px; margin: 10px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,.3);">
        <label style="font-size: 14px; font-weight: 500;">Quick Radius:</label>
        <select id="quickRadius" style="margin-left: 8px; padding: 4px 8px; border-radius: 4px;">
          <option value="50">50m</option>
          <option value="100" selected>100m</option>
          <option value="200">200m</option>
          <option value="500">500m</option>
        </select>
      </div>
    `;
    
    mapInstance.current.controls[window.google.maps.ControlPosition.TOP_CENTER].push(radiusControlDiv);
    
    // Add event listener for radius change
    setTimeout(() => {
      const radiusSelect = document.getElementById("quickRadius");
      if (radiusSelect) {
        radiusSelect.addEventListener("change", (e) => {
          setFormData(prev => ({ ...prev, allowedRadius: e.target.value }));
          if (markerRef.current) {
            updateGeofenceCircle(
              markerRef.current.getPosition().lat(),
              markerRef.current.getPosition().lng(),
              parseInt(e.target.value)
            );
          }
        });
      }
    }, 100);
  };

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    
    if (!place.geometry || !place.geometry.location) {
      toast.error("No location data found for this place");
      return;
    }

    // Track API usage
    setApiCalls(prev => ({ ...prev, places: prev.places + 1 }));

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    // Extract address components
    const addressComponents = extractAddressComponents(place.address_components || []);
    
    // Calculate timezone offset
    const timezoneOffset = place.utc_offset_minutes ? 
      `UTC${place.utc_offset_minutes >= 0 ? '+' : ''}${Math.floor(place.utc_offset_minutes / 60)}:${String(Math.abs(place.utc_offset_minutes % 60)).padStart(2, '0')}` : 
      "";

    // Auto-generate location code
    const autoCode = generateLocationCode(place.name || place.formatted_address);

    // Determine location type based on place types
    let locationType = "office";
    if (place.types) {
      if (place.types.includes("storage") || place.types.includes("warehouse")) {
        locationType = "warehouse";
      } else if (place.types.includes("factory") || place.types.includes("industrial")) {
        locationType = "site";
      }
    }

    // Fill all form data automatically
    setFormData(prev => ({
      ...prev,
      locationCode: autoCode,
      locationName: place.name || place.formatted_address.split(",")[0] || "",
      address: place.formatted_address || "",
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
      placeId: place.place_id || "",
      locationType,
      timezone: timezoneOffset,
      ...addressComponents,
    }));

    setSearchValue(place.name || place.formatted_address);
    setLocationSelected(true);
    updateMapLocation(lat, lng, place.name, parseInt(formData.allowedRadius));
    
    toast.success("✅ Location selected! All details auto-filled.");
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Track API usage
    setApiCalls(prev => ({ ...prev, geocoding: prev.geocoding + 1 }));

    // Use Google's Geocoding service for reverse lookup
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const place = results[0];
        const addressComponents = extractAddressComponents(place.address_components || []);
        const autoCode = generateLocationCode(place.formatted_address);

        setFormData(prev => ({
          ...prev,
          locationCode: autoCode,
          locationName: place.formatted_address.split(",")[0] || "",
          address: place.formatted_address,
          latitude: lat.toFixed(8),
          longitude: lng.toFixed(8),
          placeId: place.place_id || "",
          ...addressComponents,
        }));

        setSearchValue(place.formatted_address);
        setLocationSelected(true);
        updateMapLocation(lat, lng, place.formatted_address, parseInt(formData.allowedRadius));
        toast.success("✅ Location selected from map!");
      } else {
        // Fallback without geocoding
        const autoCode = generateLocationCode(`Location ${lat.toFixed(4)}`);
        setFormData(prev => ({
          ...prev,
          locationCode: autoCode,
          locationName: `Custom Location`,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          latitude: lat.toFixed(8),
          longitude: lng.toFixed(8),
        }));
        setLocationSelected(true);
        updateMapLocation(lat, lng, "Selected Location", parseInt(formData.allowedRadius));
        toast.success("✅ Location coordinates captured!");
      }
    });
  };

  const extractAddressComponents = (components) => {
    const result = {
      city: "",
      state: "",
      country: "",
      postalCode: "",
    };

    components.forEach((component) => {
      const types = component.types;
      if (types.includes("locality")) {
        result.city = component.long_name;
      } else if (types.includes("administrative_area_level_2")) {
        if (!result.city) result.city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        result.state = component.long_name;
      } else if (types.includes("country")) {
        result.country = component.long_name;
      } else if (types.includes("postal_code")) {
        result.postalCode = component.long_name;
      }
    });

    return result;
  };

  const updateMapLocation = (lat, lng, title, radius = 100) => {
    if (!mapInstance.current || !window.google) return;

    const position = { lat, lng };

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker with custom icon
    markerRef.current = new window.google.maps.Marker({
      position,
      map: mapInstance.current,
      title,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.95 0 0 8.95 0 20C0 35 20 48 20 48C20 48 40 35 40 20C40 8.95 31.05 0 20 0Z" fill="#EA4335"/>
            <circle cx="20" cy="20" r="10" fill="white"/>
            <circle cx="20" cy="20" r="6" fill="#EA4335"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 48),
        anchor: new window.google.maps.Point(20, 48)
      }
    });

    // Update geofence circle
    updateGeofenceCircle(lat, lng, radius);

    // Center map on location
    mapInstance.current.setCenter(position);
    mapInstance.current.setZoom(17);
  };

  const updateGeofenceCircle = (lat, lng, radius) => {
    if (!mapInstance.current || !window.google) return;

    // Remove existing circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    // Add geofence circle
    circleRef.current = new window.google.maps.Circle({
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      map: mapInstance.current,
      center: { lat, lng },
      radius: radius,
      editable: true,
      draggable: false
    });

    // Listen for radius changes
    circleRef.current.addListener("radius_changed", () => {
      const newRadius = Math.round(circleRef.current.getRadius());
      setFormData(prev => ({ ...prev, allowedRadius: newRadius.toString() }));
    });
  };

  // Get current location using browser's geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Track API usage
        setApiCalls(prev => ({ ...prev, geocoding: prev.geocoding + 1 }));

        // Use Google's Geocoding for reverse lookup
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
              const place = results[0];
              const addressComponents = extractAddressComponents(place.address_components || []);
              const autoCode = generateLocationCode("Current Location");

              setFormData(prev => ({
                ...prev,
                locationCode: autoCode,
                locationName: "My Current Location",
                address: place.formatted_address,
                latitude: lat.toFixed(8),
                longitude: lng.toFixed(8),
                placeId: place.place_id || "",
                ...addressComponents,
              }));

              setSearchValue("My Current Location");
              setLocationSelected(true);
              updateMapLocation(lat, lng, "Your Location", parseInt(formData.allowedRadius));
              toast.success("✅ Current location captured with full address!");
            } else {
              // Fallback without geocoding
              const autoCode = generateLocationCode("Current Location");
              setFormData(prev => ({
                ...prev,
                locationCode: autoCode,
                locationName: "Current Location",
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                latitude: lat.toFixed(8),
                longitude: lng.toFixed(8),
              }));
              setLocationSelected(true);
              updateMapLocation(lat, lng, "Your Location", parseInt(formData.allowedRadius));
              toast.success("✅ Current location captured!");
            }
            setGettingLocation(false);
          });
        } else {
          setGettingLocation(false);
          toast.error("Google Maps not loaded");
        }
      },
      (error) => {
        setGettingLocation(false);
        let errorMessage = "Failed to get current location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!locationSelected) {
      toast.error("Please select a location first");
      return;
    }

    try {
      setLoading(true);
      
      const locationData = {
        CompanyID: user.company.companyId,
        LocationCode: formData.locationCode,
        LocationName: formData.locationName,
        Address: formData.address,
        Latitude: parseFloat(formData.latitude),
        Longitude: parseFloat(formData.longitude),
        AllowedRadius: parseInt(formData.allowedRadius),
        PlaceId: formData.placeId,
        City: formData.city,
        State: formData.state,
        Country: formData.country,
        PostalCode: formData.postalCode,
        LocationType: formData.locationType,
        Timezone: formData.timezone,
        BusinessHours: formData.businessHours,
      };

      if (isEditing) {
        await locationAPI.update(editId, locationData);
        toast.success("Location updated successfully!");
      } else {
        await locationAPI.create(locationData);
        toast.success("Location created successfully!");
      }

      router.push("/locations");
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(error.response?.data?.message || "Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/locations")}
            className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FiArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {isEditing ? "Edit Location" : "Add New Location"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditing 
                ? "Update location details with Google Maps integration"
                : "Search and select location with Google Maps"}
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Google Maps API Usage Notice:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Each search uses Places API (autocomplete)</li>
                <li>Map clicks use Geocoding API for address details</li>
                <li>Enable billing in Google Cloud Console for production use</li>
                <li>Consider implementing session tokens for cost optimization</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search & Map Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiGlobe className="mr-2 text-blue-600" />
                Google Maps Location Search
              </h2>
              <p className="text-gray-600 mt-1">
                Search any place or click on map to select location
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* API Usage Tracker */}
              <ApiUsageTracker apiCalls={apiCalls} />

              {/* Google Places Search */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for offices, buildings, landmarks..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  disabled={!mapsLoaded}
                />
                {locationSelected && (
                  <FiCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                )}
              </div>

              {!mapsLoaded && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <FiLoader className="h-5 w-5 text-yellow-600 mr-2 animate-spin" />
                    <span className="text-yellow-800 font-medium">Loading Google Maps...</span>
                  </div>
                </div>
              )}

              {/* Current Location Button */}
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation || !mapsLoaded}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                {gettingLocation ? (
                  <FiLoader className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <FiNavigation className="mr-2 h-5 w-5" />
                )}
                Use My Current Location
              </button>

              {/* Map Container */}
              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-96 rounded-xl border border-gray-200"
                  style={{ minHeight: "400px" }}
                />
                {!mapsLoaded && (
                  <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <FiLoader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-600">Loading Google Maps...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Tips */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Tips:</p>
                <ul className="space-y-1">
                  <li>• Click anywhere on map to select that location</li>
                  <li>• Drag the blue circle border to adjust radius</li>
                  <li>• Use map type control for satellite view</li>
                  <li>• Zoom in for more precise selection</li>
                </ul>
              </div>

              {/* Location Status */}
              {locationSelected && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FiCheck className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Location Selected!</span>
                  </div>
                  <div className="text-green-700 text-sm space-y-1">
                    <p>📍 Lat: {formData.latitude}, Lng: {formData.longitude}</p>
                    {formData.city && <p>🏙️ City: {formData.city}</p>}
                    {formData.country && <p>🌍 Country: {formData.country}</p>}
                    {formData.timezone && <p>🕐 Timezone: {formData.timezone}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
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
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locationCode: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Auto-generated code"
                    maxLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = generateLocationCode(formData.locationName || formData.address);
                      setFormData({ ...formData, locationCode: newCode });
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
                  onChange={(e) =>
                    setFormData({ ...formData, locationName: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
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
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
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
                    onChange={(e) => {
                      setFormData({ ...formData, allowedRadius: e.target.value });
                      if (markerRef.current) {
                        updateGeofenceCircle(
                          markerRef.current.getPosition().lat(),
                          markerRef.current.getPosition().lng(),
                          parseInt(e.target.value)
                        );
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="100"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    meters
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p>Recommended ranges:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Small office/shop: 30-50m</li>
                    <li>• Medium building: 50-100m</li>
                    <li>• Large office/mall: 100-200m</li>
                    <li>• Campus/factory: 200-500m</li>
                  </ul>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.businessHours.start}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessHours: { ...formData.businessHours, start: e.target.value }
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.businessHours.end}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessHours: { ...formData.businessHours, end: e.target.value }
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>
              </div>

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
                  onClick={() => router.push("/locations")}
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
        </div>

        {/* Implementation Guide */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiInfo className="mr-2 text-blue-600" />
            Implementation Guide for Backend
          </h3>
          <div className="prose prose-sm text-gray-600">
            <h4 className="font-semibold text-gray-800">1. Enable Required APIs in Google Cloud Console:</h4>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Maps JavaScript API</li>
              <li>Places API</li>
              <li>Geocoding API</li>
            </ul>

            <h4 className="font-semibold text-gray-800">2. Backend API Structure:</h4>
            <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
{`// Location Model
{
  LocationID: number,
  CompanyID: number,
  LocationCode: string,
  LocationName: string,
  Address: string,
  Latitude: number,
  Longitude: number,
  AllowedRadius: number,
  PlaceId: string,
  City: string,
  State: string,
  Country: string,
  PostalCode: string,
  LocationType: string,
  Timezone: string,
  BusinessHours: object,
  IsActive: boolean
}`}
            </pre>

            <h4 className="font-semibold text-gray-800 mt-4">3. Cost Optimization Tips:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Implement session tokens for Places Autocomplete</li>
              <li>Cache geocoding results in your database</li>
              <li>Use viewport biasing to limit search area</li>
              <li>Set up billing alerts in Google Cloud Console</li>
              <li>Consider using Maps Static API for display-only needs</li>
            </ul>

            <h4 className="font-semibold text-gray-800 mt-4">4. Security Best Practices:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Restrict API key to specific domains/IPs</li>
              <li>Use separate keys for development and production</li>
              <li>Never expose backend API keys in frontend</li>
              <li>Implement rate limiting on your backend</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}