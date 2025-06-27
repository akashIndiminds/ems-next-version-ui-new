// src/app/lib/api/locationAPI.js
import apiClient from './apiClient';

export const locationAPI = {
  // Get all locations with filters
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) searchParams.append(key, params[key]);
    });
    
    return await apiClient.get(`/locations?${searchParams.toString()}`);
  },

  // Get location by ID
  getById: async (id) => {
    return await apiClient.get(`/locations/${id}`);
  },

  // Create new location
  create: async (locationData) => {
    return await apiClient.post('/locations', locationData);
  },

  // Update location
  update: async (id, updateData) => {
    return await apiClient.put(`/locations/${id}`, updateData);
  },

  // Delete location
  delete: async (id) => {
    return await apiClient.delete(`/locations/${id}`);
  },

  // Validate location for geofencing
  validateLocation: async (locationId, latitude, longitude, employeeId = null) => {
    return await apiClient.post('/locations/validate', {
      locationId,
      latitude,
      longitude,
      employeeId
    });
  },

  // Advanced geofencing validation
  advancedValidation: async (locationId, latitude, longitude, employeeId, additionalChecks = {}) => {
    return await apiClient.post('/locations/validate/advanced', {
      locationId,
      latitude,
      longitude,
      employeeId,
      additionalChecks
    });
  },

  // Get nearby locations
  getNearby: async (latitude, longitude, maxDistance = 1000, companyId = null) => {
    const params = new URLSearchParams();
    if (maxDistance) params.append('maxDistance', maxDistance);
    if (companyId) params.append('companyId', companyId);
    
    return await apiClient.get(`/locations/nearby/${latitude}/${longitude}?${params.toString()}`);
  },

  // Get closest location
  getClosest: async (latitude, longitude, companyId) => {
    return await apiClient.get(`/locations/closest/${latitude}/${longitude}?companyId=${companyId}`);
  },

  // Validate multiple locations
  validateMultiple: async (locationIds, latitude, longitude) => {
    return await apiClient.post('/locations/validate/multiple', {
      locationIds,
      latitude,
      longitude
    });
  },

  // Get locations with coordinates
  getWithCoordinates: async (companyId = null) => {
    const params = companyId ? `?companyId=${companyId}` : '';
    return await apiClient.get(`/locations/coordinates/all${params}`);
  },

  // Validate coordinates
  validateCoordinates: async (locationId) => {
    return await apiClient.get(`/locations/${locationId}/validate-coordinates`);
  },

  // Calculate distance
  calculateDistance: async (lat1, lon1, lat2, lon2) => {
    return await apiClient.post('/locations/distance/calculate', {
      lat1, lon1, lat2, lon2
    });
  }
};

// Geolocation utilities
export const geolocationUtils = {
  // Get current position with enhanced error handling
  getCurrentPosition: (options = {}) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let message = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out. Please try again.';
              break;
          }
          reject(new Error(message));
        },
        defaultOptions
      );
    });
  },

  // Watch position changes
  watchPosition: (callback, errorCallback, options = {}) => {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation is not supported'));
      return null;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000,
      ...options
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      errorCallback,
      defaultOptions
    );
  },

  // Stop watching position
  clearWatch: (watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  },

  // Calculate distance (client-side)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  },

  // Format coordinates for display
  formatCoordinates: (lat, lon, precision = 6) => {
    return {
      latitude: parseFloat(lat).toFixed(precision),
      longitude: parseFloat(lon).toFixed(precision),
      display: `${parseFloat(lat).toFixed(precision)}, ${parseFloat(lon).toFixed(precision)}`
    };
  },

  // Validate coordinates
  isValidCoordinate: (lat, lon) => {
    return !isNaN(lat) && !isNaN(lon) && 
           lat >= -90 && lat <= 90 && 
           lon >= -180 && lon <= 180;
  }
};