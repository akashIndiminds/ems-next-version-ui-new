// src/components/locations/GoogleMapsSearch.js
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiLoader, FiCheck, FiNavigation, FiGlobe } from "react-icons/fi";
import toast from "react-hot-toast";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Global state to prevent multiple script loads
const GoogleMapsLoader = {
  isLoading: false,
  isLoaded: false,
  loadPromise: null,
  
  load() {
    // If already loaded, return resolved promise
    if (this.isLoaded) {
      return Promise.resolve();
    }
    
    // If currently loading, return existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }
    
    // Check if Google Maps is already available
    if (typeof window !== 'undefined' && 
        window.google && 
        window.google.maps && 
        window.google.maps.places &&
        window.google.maps.geometry) {
      this.isLoaded = true;
      return Promise.resolve();
    }
    
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      this.isLoading = true;
      this.loadPromise = new Promise((resolve, reject) => {
        const checkLoaded = () => {
          if (typeof window !== 'undefined' && 
              window.google && 
              window.google.maps && 
              window.google.maps.places &&
              window.google.maps.geometry) {
            this.isLoaded = true;
            this.isLoading = false;
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        
        // Timeout after 15 seconds
        setTimeout(() => {
          if (!this.isLoaded) {
            this.isLoading = false;
            reject(new Error('Google Maps loading timeout'));
          }
        }, 15000);
      });
      return this.loadPromise;
    }
    
    // Load new script
    this.isLoading = true;
    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const callbackName = `googleMapsCallback_${Date.now()}`;
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      window[callbackName] = () => {
        this.isLoaded = true;
        this.isLoading = false;
        resolve();
        // Clean up callback
        setTimeout(() => {
          delete window[callbackName];
        }, 1000);
      };
      
      script.onerror = () => {
        this.isLoading = false;
        reject(new Error('Failed to load Google Maps'));
      };
      
      document.head.appendChild(script);
    });
    
    return this.loadPromise;
  }
};

const GoogleMapsSearch = ({ 
  formData, 
  onLocationSelect, 
  onApiCallUpdate,
  isEditing,
  locationSelected 
}) => {
  // Refs for Google Maps
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const initializationTimeoutRef = useRef(null);

  // State management
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsInitialized, setMapsInitialized] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [geocodingCache, setGeocodingCache] = useState(new Map());

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

  // Cleanup function for Google Maps resources
  const cleanupGoogleMapsResources = useCallback(() => {
    try {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      if (mapInstance.current) {
        window.google?.maps?.event?.clearInstanceListeners(mapInstance.current);
        mapInstance.current = null;
      }
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }
  }, []);

  // Load Google Maps Script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error("Google Maps API key not configured");
      return;
    }

    GoogleMapsLoader.load()
      .then(() => {
        setMapsLoaded(true);
        setTimeout(() => {
          initializeGoogleMaps();
        }, 100);
      })
      .catch((error) => {
        console.error("Failed to load Google Maps:", error);
        toast.error("Failed to load Google Maps");
      });
  }, []);

  // Component cleanup
  useEffect(() => {
    return () => {
      cleanupGoogleMapsResources();
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [cleanupGoogleMapsResources]);

  // Update map when editing location
  useEffect(() => {
    if (isEditing && formData.latitude && formData.longitude && mapsInitialized) {
      setTimeout(() => {
        updateMapLocation(
          parseFloat(formData.latitude), 
          parseFloat(formData.longitude), 
          formData.locationName, 
          parseInt(formData.allowedRadius)
        );
        setSearchValue(formData.locationName);
      }, 500);
    }
  }, [isEditing, formData.latitude, formData.longitude, mapsInitialized]);

  const initializeGoogleMaps = () => {
    if (!GoogleMapsLoader.isLoaded) return;

    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }

    initializationTimeoutRef.current = setTimeout(() => {
      try {
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();

        // Initialize autocomplete
        if (searchInputRef.current && !autocompleteRef.current) {
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
                "utc_offset_minutes"
              ],
              sessionToken: sessionTokenRef.current
            }
          );

          autocompleteRef.current.setComponentRestrictions({ country: ["in"] });
          autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
        }

        // Initialize map
        if (mapRef.current && !mapInstance.current) {
          const defaultCenter = { lat: 19.0760, lng: 72.8777 };
          
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: 'greedy',
          });

          window.google.maps.event.addListenerOnce(mapInstance.current, 'idle', () => {
            mapInstance.current.addListener("click", handleMapClick);
            addCustomControls();
            setMapsInitialized(true);
          });
        }
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        toast.error("Error initializing Google Maps");
      }
    }, 300);
  };

  const addCustomControls = () => {
    if (!mapInstance.current) return;

    const radiusControlDiv = document.createElement("div");
    radiusControlDiv.className = "custom-map-control";
    // radiusControlDiv.innerHTML = `
    //   <div style="background: #ffffff; padding: 10px; margin: 10px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,.3); border: 1px solid #ddd;">
    //     <label style="font-size: 14px; color: #333333; font-weight: 500;">Quick Radius:</label>
    //     <select id="quickRadius" style="margin-left: 8px; padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc; color: #333333; background-color: #f9f9f9;">
    //       <option value="50">50m</option>
    //       <option value="100" selected>100m</option>
    //       <option value="200">200m</option>
    //       <option value="500">500m</option>
    //     </select>
    //   </div>
    // `;
    
    mapInstance.current.controls[window.google.maps.ControlPosition.TOP_CENTER].push(radiusControlDiv);
    
    setTimeout(() => {
      const radiusSelect = document.getElementById("quickRadius");
      if (radiusSelect) {
        radiusSelect.addEventListener("change", (e) => {
          const newRadius = e.target.value;
          onLocationSelect({ ...formData, allowedRadius: newRadius });
          if (markerRef.current && mapInstance.current) {
            updateGeofenceCircle(
              markerRef.current.getPosition().lat(),
              markerRef.current.getPosition().lng(),
              parseInt(newRadius)
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

    onApiCallUpdate({ places: 1 });

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const addressComponents = extractAddressComponents(place.address_components || []);
    
    const timezoneOffset = place.utc_offset_minutes ? 
      `UTC${place.utc_offset_minutes >= 0 ? '+' : ''}${Math.floor(place.utc_offset_minutes / 60)}:${String(Math.abs(place.utc_offset_minutes % 60)).padStart(2, '0')}` : 
      "";

    const autoCode = generateLocationCode(place.name || place.formatted_address);

    let locationType = "office";
    if (place.types) {
      if (place.types.includes("storage") || place.types.includes("warehouse")) {
        locationType = "warehouse";
      } else if (place.types.includes("factory") || place.types.includes("industrial")) {
        locationType = "site";
      }
    }

    const locationData = {
      locationCode: autoCode,
      locationName: place.name || place.formatted_address.split(",")[0] || "",
      address: place.formatted_address || "",
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
      placeId: place.place_id || "",
      locationType,
      timezone: timezoneOffset,
      ...addressComponents,
    };

    onLocationSelect(locationData);
    setSearchValue(place.name || place.formatted_address);
    updateMapLocation(lat, lng, place.name, parseInt(formData.allowedRadius));
    
    toast.success("✅ Location selected!");
    
    setTimeout(() => {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      if (autocompleteRef.current) {
        autocompleteRef.current.setOptions({ sessionToken: sessionTokenRef.current });
      }
    }, 1000);
  };

  const geocodeWithCache = async (location) => {
    const cacheKey = `${location.lat.toFixed(6)},${location.lng.toFixed(6)}`;
    
    if (geocodingCache.has(cacheKey)) {
      return geocodingCache.get(cacheKey);
    }
    
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          setGeocodingCache(prev => new Map(prev).set(cacheKey, results[0]));
          resolve(results[0]);
        } else {
          reject(status);
        }
      });
    });
  };

  const handleMapClick = async (event) => {
    if (!mapInstance.current) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      const place = await geocodeWithCache({ lat, lng });
      
      if (!geocodingCache.has(`${lat.toFixed(6)},${lng.toFixed(6)}`)) {
        onApiCallUpdate({ geocoding: 1 });
      }

      const addressComponents = extractAddressComponents(place.address_components || []);
      const autoCode = generateLocationCode(place.formatted_address);

      const locationData = {
        locationCode: autoCode,
        locationName: place.formatted_address.split(",")[0] || "",
        address: place.formatted_address,
        latitude: lat.toFixed(8),
        longitude: lng.toFixed(8),
        placeId: place.place_id || "",
        ...addressComponents,
      };

      onLocationSelect(locationData);
      setSearchValue(place.formatted_address);
      updateMapLocation(lat, lng, place.formatted_address, parseInt(formData.allowedRadius));
      toast.success("✅ Location selected from map!");
      
    } catch (error) {
      const autoCode = generateLocationCode(`Location ${lat.toFixed(4)}`);
      const locationData = {
        locationCode: autoCode,
        locationName: `Custom Location`,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: lat.toFixed(8),
        longitude: lng.toFixed(8),
      };
      
      onLocationSelect(locationData);
      updateMapLocation(lat, lng, "Selected Location", parseInt(formData.allowedRadius));
      toast.success("✅ Location coordinates captured!");
    }
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
    if (!mapInstance.current || !window.google || !window.google.maps) return;

    try {
      const position = { lat, lng };

      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

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

      updateGeofenceCircle(lat, lng, radius);
      mapInstance.current.setCenter(position);
      mapInstance.current.setZoom(17);
    } catch (error) {
      console.error("Error updating map location:", error);
    }
  };

  const updateGeofenceCircle = (lat, lng, radius) => {
    if (!mapInstance.current || !window.google || !window.google.maps) return;

    try {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }

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

      circleRef.current.addListener("radius_changed", () => {
        const newRadius = Math.round(circleRef.current.getRadius());
        onLocationSelect({ ...formData, allowedRadius: newRadius.toString() });
      });
    } catch (error) {
      console.error("Error updating geofence circle:", error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const place = await geocodeWithCache({ lat, lng });
          
          if (!geocodingCache.has(`${lat.toFixed(6)},${lng.toFixed(6)}`)) {
            onApiCallUpdate({ geocoding: 1 });
          }

          const addressComponents = extractAddressComponents(place.address_components || []);
          const autoCode = generateLocationCode("Current Location");

          const locationData = {
            locationCode: autoCode,
            locationName: "My Current Location",
            address: place.formatted_address,
            latitude: lat.toFixed(8),
            longitude: lng.toFixed(8),
            placeId: place.place_id || "",
            ...addressComponents,
          };

          onLocationSelect(locationData);
          setSearchValue("My Current Location");
          updateMapLocation(lat, lng, "Your Location", parseInt(formData.allowedRadius));
          toast.success("✅ Current location captured!");
          
        } catch (error) {
          const autoCode = generateLocationCode("Current Location");
          const locationData = {
            locationCode: autoCode,
            locationName: "Current Location",
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat.toFixed(8),
            longitude: lng.toFixed(8),
          };
          
          onLocationSelect(locationData);
          updateMapLocation(lat, lng, "Your Location", parseInt(formData.allowedRadius));
          toast.success("✅ Current location captured!");
        }
        
        setGettingLocation(false);
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Google Places Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for offices, buildings, landmarks..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-black"
            disabled={!mapsLoaded}
          />
          {locationSelected && (
            <FiCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
          )}
        </div>

        {!mapsLoaded && GOOGLE_MAPS_API_KEY && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center">
              <FiLoader className="h-5 w-5 text-yellow-600 mr-2 animate-spin" />
              <span className="text-yellow-800 font-medium">Loading Google Maps...</span>
            </div>
          </div>
        )}

        {mapsLoaded && !mapsInitialized && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <FiLoader className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
              <span className="text-blue-800 font-medium">Initializing Maps...</span>
            </div>
          </div>
        )}

        {/* Current Location Button */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={gettingLocation || !mapsInitialized}
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
          {!mapsInitialized && (
            <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <FiLoader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">
                  {!mapsLoaded ? "Loading Google Maps..." : "Initializing Maps..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map Tips */}
        {/* <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-medium mb-2">Tips:</p>
          <ul className="space-y-1">
            <li>• Click anywhere on map to select that location</li>
            <li>• Drag the blue circle border to adjust radius</li>
            <li>• Use map type control for satellite view</li>
            <li>• Zoom in for more precise selection</li>
          </ul>
        </div> */}

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
  );
};

export default GoogleMapsSearch;