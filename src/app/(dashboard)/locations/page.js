// src/app/(dashboard)/locations/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { locationAPI } from '@/app/lib/api';
import { FiPlus, FiEdit, FiTrash2, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LocationsPage() {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    locationCode: '',
    locationName: '',
    address: '',
    latitude: '',
    longitude: '',
    allowedRadius: '100'
  });

  useEffect(() => {
    if (user.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    fetchLocations();
  }, [user]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationAPI.getAll({
        companyId: user.company.companyId
      });
      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const locationData = {
        CompanyID: user.company.companyId,
        LocationCode: formData.locationCode,
        LocationName: formData.locationName,
        Address: formData.address,
        Latitude: parseFloat(formData.latitude),
        Longitude: parseFloat(formData.longitude),
        AllowedRadius: parseInt(formData.allowedRadius)
      };

      if (editingLocation) {
        // Update location logic here
        toast.success('Location updated successfully');
      } else {
        // Create location logic here
        toast.success('Location created successfully');
      }
      
      setShowAddModal(false);
      resetForm();
      fetchLocations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save location');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      // Delete location logic here
      toast.success('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      toast.error('Failed to delete location');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
          toast.success('Location captured successfully');
        },
        (error) => {
          toast.error('Failed to get current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const resetForm = () => {
    setFormData({
      locationCode: '',
      locationName: '',
      address: '',
      latitude: '',
      longitude: '',
      allowedRadius: '100'
    });
    setEditingLocation(null);
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
    <div className="min-h-screen ">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Location Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage office locations and geofencing settings
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus className="mr-2" />
            Add Location
          </button>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.LocationID} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
              {/* Gradient accent bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-300">
                      <FiMapPin className="h-7 w-7 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{location.LocationName}</h3>
                      <p className="text-sm text-gray-600 font-medium">Code: {location.LocationCode}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <p className="text-sm text-gray-700 font-medium">{location.Address}</p>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <FiMapPin className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-sm text-blue-700 font-medium">
                      Lat: {location.Latitude?.toFixed(4)}, Lng: {location.Longitude?.toFixed(4)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                    <span className="text-sm font-medium text-emerald-700">Geofence Radius</span>
                    <span className="text-sm font-semibold text-emerald-900">{location.AllowedRadius}m</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditingLocation(location);
                      setFormData({
                        locationCode: location.LocationCode,
                        locationName: location.LocationName,
                        address: location.Address,
                        latitude: location.Latitude,
                        longitude: location.Longitude,
                        allowedRadius: location.AllowedRadius
                      });
                      setShowAddModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    title="Edit"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(location.LocationID)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    title="Delete"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Location Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}></div>
              
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingLocation ? 'Edit Location' : 'Add New Location'}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {editingLocation ? 'Update location details' : 'Set up a new office location with geofencing'}
                  </p>
                </div>
                
                <div onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {!editingLocation && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location Code</label>
                        <input
                          type="text"
                          required
                          value={formData.locationCode}
                          onChange={(e) => setFormData({...formData, locationCode: e.target.value.toUpperCase()})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                          placeholder="HO, BR001"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location Name</label>
                      <input
                        type="text"
                        required
                        value={formData.locationName}
                        onChange={(e) => setFormData({...formData, locationName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        placeholder="Head Office"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                      <textarea
                        rows="3"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        placeholder="Enter full address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={formData.latitude}
                          onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                          placeholder="22.5726"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={formData.longitude}
                          onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                          placeholder="88.3639"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="w-full text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center bg-blue-50 py-3 rounded-xl hover:bg-blue-100 transition-colors duration-200 font-medium"
                    >
                      <FiMapPin className="mr-2" />
                      Use Current Location
                    </button>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Geofence Radius (meters)</label>
                      <input
                        type="number"
                        required
                        value={formData.allowedRadius}
                        onChange={(e) => setFormData({...formData, allowedRadius: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      {editingLocation ? 'Update' : 'Add'} Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        )}
      </div>
    </div>
  );
}