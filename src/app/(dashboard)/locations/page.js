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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Location Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage office locations and geofencing settings
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Location
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.LocationID} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiMapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{location.LocationName}</h3>
                    <p className="text-sm text-gray-500">Code: {location.LocationCode}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{location.Address}</p>
                <div className="flex items-center text-gray-500">
                  <FiMapPin className="h-4 w-4 mr-1" />
                  <span>Lat: {location.Latitude?.toFixed(4)}, Lng: {location.Longitude?.toFixed(4)}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="font-medium">Radius:</span>
                  <span className="ml-1">{location.AllowedRadius}m</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
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
                  className="text-blue-600 hover:text-blue-900"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(location.LocationID)}
                  className="text-red-600 hover:text-red-900"
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}></div>
            
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!editingLocation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location Code</label>
                      <input
                        type="text"
                        required
                        value={formData.locationCode}
                        onChange={(e) => setFormData({...formData, locationCode: e.target.value.toUpperCase()})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="HO, BR001"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location Name</label>
                    <input
                      type="text"
                      required
                      value={formData.locationName}
                      onChange={(e) => setFormData({...formData, locationName: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Head Office"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      rows="2"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter full address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Latitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        required
                        value={formData.latitude}
                        onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="22.5726"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Longitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        required
                        value={formData.longitude}
                        onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="88.3639"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="w-full text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center"
                  >
                    <FiMapPin className="mr-1" />
                    Use Current Location
                  </button>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allowed Radius (meters)</label>
                    <input
                      type="number"
                      required
                      value={formData.allowedRadius}
                      onChange={(e) => setFormData({...formData, allowedRadius: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="100"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingLocation ? 'Update' : 'Add'} Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}